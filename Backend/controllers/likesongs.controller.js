const songModel = require("../models/songModel");
const userModel = require("../models/userModel");

exports.toggleLikeSongController = async (req, res) => {
    try {
        const songId = req.params.like;

        const song = await songModel.findById(songId);

        if (!song) {
            return res.status(404).json({
                message: "Song not found."
            });
        }

        const user = await userModel.findById(req.user.id);

        const alreadyLiked = user.likes.some(id =>
            id.equals(song._id)
        );

        if (alreadyLiked) {
                user.likes = user.likes.filter(
                id => !id.equals(song._id)
            );

            await user.save();

            return res.status(200).json({
                success: true,
                message: "Song removed from likes.",
                likes: user.likes
            });
        }


        user.likes.push(song._id);

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Song added to likes.",
            likes: user.likes
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.viewLikeSongController = async (req,res)=>{
    try {
        
        const user = await userModel.findOne({_id:req?.user?.id}).populate("likes");

        if(!user.likes){
            return res.status(400).json({
                message:'empty liked list.',
                likes:[]
            })
        }

        res.status(200).json({
            message:'liked songs',
            likes:user.likes,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:'internal server error.'
        })
    }
}