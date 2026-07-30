const userModel = require("../models/userModel");



exports.creatorHandler = async (req,res,next)=>{
    try {
        
        const userId = req?.user?.id;

        const user = await userModel.findOne({_id:userId});

        if(user.role == "creator" || user.role == "admin"){
            console.log('permission granted.');
            next();
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:'internal server error.'
        })
    }
}