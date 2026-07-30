const { default: mongoose } = require("mongoose");

const songSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    img:{
        type:String,
        required:true
    },
    audio:{
        type:String,
        required:true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    album_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'album',
        required:true
    }
},{timestamps:true});


const songModel = mongoose.model('song',songSchema);

module.exports = songModel;