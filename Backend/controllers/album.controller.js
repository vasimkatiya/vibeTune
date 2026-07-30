const { uploadImage } = require("../config/cloudinary");
const albumModel = require("../models/albumModel");
const songModel = require("../models/songModel");
const userModel = require("../models/userModel");


exports.createAlbumsController = async (req, res) => {
    try {

        const name = req.body.name;
        const userId = req.user.id;
        const file = req.file;

        const exists = await albumModel.findOne({ name, user_id: userId });

        if (exists) {
            return res.status(400).json({
                message: 'album already exists.'
            })
        }

        const imageResult = await uploadImage(file.buffer);

        console.log('images result : : : ', imageResult)

        const newAlbum = await albumModel.create({
            name: name,
            user_id: userId,
            img: imageResult.secure_url
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

        const id = req?.params?.id;
        const userId = req?.user?.id;

        if (!id) {
            return res.status(400).json({
                message: 'id is not present in url'
            })
        }

        const user = await userModel.findById(userId);

        if (user.role == "creator") {

            const deletedAlbum = await albumModel.deleteOne({ _id: id, user_id: userId });

            await songModel.updateMany(
                { album_id: id },
                {
                    $set: { album_id: null }
                }
            );

            return res.status(200).json({
                message: 'creator delete a album',
                deletedAlbum,
            })
        }

        if (user.role == "admin") {

            const deletedAlbum = await albumModel.deleteOne({ _id: id });
            console.log(deletedAlbum);
            await songModel.updateMany(
                { album_id: id },
                {
                    $set: { album_id: null }
                }
            );

            return res.status(200).json({
                message: 'admin delete a album',
                deletedAlbum,
            })
        }

        res.status(400).json({
            message: 'creator can not delete others albums'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'internal server error.'
        })
    }
}

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