const { uploadImage } = require("../config/cloudinary");
const albumModel = require("../models/albumModel");
const songModel = require("../models/songModel");
const userModel = require("../models/userModel");


exports.createAlbumsController = async (req, res) => {
    try {

        const name = req.body.name;
        const userId = req.user.id;
        const file = req?.file;

        const exists = await albumModel.findOne({ name, user_id: userId });

        if (exists) {
            return res.status(400).json({
                message: 'album already exists.'
            })
        }
        let imageResult ;
        if(file)
        {
             imageResult = await uploadImage(file.buffer);
        }

        console.log('images result : : : ', imageResult)

        const newAlbum = await albumModel.create({
            name: name,
            user_id: userId,
            img: imageResult?.secure_url
        });

        res.status(201).json({
            message: 'album created.',
            album: newAlbum
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'internal server error.'
        })
    }
}


exports.roleBasedAllAlbumController = async (req, res) => {
    try {

        const page = Number(req?.query?.page) || 1;
        const limit = Number(req?.query?.limit) || 10;

        const skip = (page - 1) * limit;

        const userId = req?.user?.id;

        const user = await userModel.findById(userId);

        if (user.role == "creator") {
            const albums = await albumModel.find({ user_id: userId }).skip(skip).limit(limit);
            return res.status(200).json({
                message: 'uploaded songs',
                albums
            })
        }

        if (user.role == "admin") {
            const albums = await albumModel.find().skip(skip).limit(limit).populate("user_id");
            return res.status(200).json({
                message: 'all uploaded albums',
                albums
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'internal server error.'
        })
    }
}


exports.getAllAlbumsController = async (req, res) => {
    try {

        const page = Number(req?.query?.page) || 1;
        const limit = Number(req?.query?.limit) || 10;

        const skip = (page - 1) * limit;

        const albums = await albumModel.find().populate('user_id').select('-password').skip(skip).limit(limit);

        res.status(200).json({
            message: 'all albums',
            albums,
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'internal server error.'
        });
    }
}

exports.deleteAlbumController = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        if (!id) {
            return res.status(400).json({
                message: "Album id is required",
            });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        let deletedAlbum;

        if (user.role === "creator") {
            deletedAlbum = await albumModel.findOneAndDelete({
                _id: id,
                user_id: userId,
            });

            if (!deletedAlbum) {
                return res.status(404).json({
                    message: "Album not found or you are not authorized to delete it",
                });
            }
        } else if (user.role === "admin") {
            deletedAlbum = await albumModel.findByIdAndDelete(id);

            if (!deletedAlbum) {
                return res.status(404).json({
                    message: "Album not found",
                });
            }
        } else {
            return res.status(403).json({
                message: "You are not authorized to delete this album",
            });
        }

        // Delete all songs related to this album
        const deletedSongs = await songModel.deleteMany({
            album_id: id,
        });

        return res.status(200).json({
            message: "Album and related songs deleted successfully",
            deletedAlbum,
            deletedSongsCount: deletedSongs.deletedCount,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

exports.viewAlbumController = async (req, res) => {
    try {
        const id = req?.params?.id;

        const album = await albumModel.findOne({ _id: id }).populate('user_id songs');

        res.status(200).json({
            message: `${album.name} album`,
            album
        })

    } catch (error) {
        console.log(error)
    }
}