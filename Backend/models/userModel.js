const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
          type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    role:{
        type:String,
        enum:['user','creator','admin'],
        default:'user'
    },
    likes:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "song",
    },
    ]
},{timestamps:true});

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;