const { uploadImage, uploadAudio } = require("../config/cloudinary");
const albumModel = require("../models/albumModel");
const songModel = require("../models/songModel");
const userModel = require("../models/userModel");


exports.createSongController = async (req, res) => {
    try {
        const name = req.body.name;
        const albumId = req?.body.album_id;
        const userId = req.user.id;
        const image = req.files.image[0];
        const audio = req.files.audio[0];


        const exists = await songModel.findOne({ name });

        if (exists) {
            return res.status(400).json({
                message: 'song already exists.'
            })
        }

        const imageResult = await uploadImage(image.buffer);
        const audioResult = await uploadAudio(audio.buffer);
        console.log('images result : : : ', imageResult)

        const song = await songModel.create({
            name: name,
            img: imageResult.secure_url,
            audio: audioResult.secure_url,
            user_id: userId,
            album_id: albumId || null
        });

        if (albumId) {
            const album = await albumModel.findById(albumId);

            if (!album) {
                return res.status(404).json({
                    message: "Album not found."
                });
            }

            album.songs.push(song._id);

            await album.save();
        }

        res.status(201).json({
            message: 'song uploaded.',
            song
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'internal server error.'
        })
    }
}

exports.roleBasedAllsongController = async (req, res) => {
    try {

        const page = Number(req?.query?.page) || 1;
        const limit = Number(req?.query?.limit) || 10;

        const skip = (page - 1) * limit;

        const userId = req?.user?.id;

        const user = await userModel.findById(userId);

        if (user.role == "creator") {
            const songs = await songModel.find({ user_id: userId }).skip(skip).limit(limit);
            return res.status(200).json({
                message: 'uploaded songs',
                songs
            })
        }

        if (user.role == "admin") {
            const songs = await songModel.find().skip(skip).limit(limit).populate("user_id");
            return res.status(200).json({
                message: 'all uploaded songs',
                songs
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'internal server error.'
        })
    }
}


//


exports.getAllSongController = async (req, res) => {
    try {

        const page = Number(req?.query?.page) || 1;
        const limit = Number(req?.query?.limit) || 10;

        const skip = (page - 1) * limit;

        const songs = await songModel.find().populate('user_id').skip(skip).limit(limit);

        res.status(200).json({
            message: 'all songs',
            songs,
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'internal server error.'
        });
    }
}

exports.deleteSongController = async (req, res) => {
    try {

        const id = req?.params?.id;
        const userId = req?.user?.id;

        if (!id) {
            return res.status(400).json({
                message: 'id is not present in url'
            })
        }

        const user = await userModel.findById(userId);

        const song = await songModel.findOne({_id:id});

        if (!song) {
            return res.status(404).json({
                message: 'song not found.'
            })
        }

        await userModel.updateMany(
            { likes: song._id },
            {
                $pull: {
                    likes: song._id,
                },
            }
        );


        if (song.album_id) {
            await albumModel.findByIdAndUpdate(
                song.album_id,
                {
                    $pull: {
                        songs: song._id,
                    },
                }
            );
        }

        if (user.role == "creator") {

            const deletedSong = await songModel.deleteOne({ _id: id, user_id: userId });

            return res.status(200).json({
                message: 'song deleted.',
                deletedSong,
            });
        }

        if (user.role == "admin") {

            const deletedSong = await songModel.deleteOne({ _id: id })

            return res.status(200).json({
                message: 'admin delete a song',
                deletedSong,
            })
        }

        res.status(400).json({
            message: 'creator can not delete others songs'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'internal server error.'
        })
    }
}

exports.viewSongController = async (req, res) => {
    try {
        const i = req?.params?.i;

        if (!i) {
            return res.status(400).json({
                message: 'song is is null or undefined'
            })
        }

        const song = await songModel?.findOne({ _id: i }).populate('user_id');

        if (!song) {
            return res.status(404).json({
                message: 'song not found.'
            })
        }

        res.status(200).json({
            message: `${song.name} is playing`,
            song
        })

    } catch (error) {
        console.log(error)
    }
}

exports.SearchSongController = async (req, res) => {
  try {
    const query = req.query.query?.trim();

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required.",
      });
    }

    const songs = await songModel
      .find({
        name: {
          $regex: query,
          $options: "i",
        },
      })
      .populate("user_id")
      .skip(skip)
      .limit(limit);

    const total = await songModel.countDocuments({
      name: {
        $regex: query,
        $options: "i",
      },
    });

    return res.status(200).json({
      message: songs.length
        ? "Songs found."
        : "No songs found.",
      total,
      page,
      totalPages: Math.ceil(total / limit),
      songs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}