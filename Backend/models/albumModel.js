const { default: mongoose } = require("mongoose");

const albumSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    img:{
        type:String,
        required:true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    songs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"song", 
    }]
},{timestamps:true});


const albumModel = mongoose.model('album',albumSchema);

module.exports = albumModel;