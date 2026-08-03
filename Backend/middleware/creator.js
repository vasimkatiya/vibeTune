const userModel = require("../models/userModel");



exports.creatorHandler = async (req,res,next)=>{
    try {
        
        const userId = req?.user?.id;
        const role = req?.user?.role;

        if(!userId || !role){
            return res.status(400).json({
                message: 'user id or role is missing.'
            })
        }
        const user = await userModel.findOne({_id:userId});

        if(role == "creator" || role == "admin"){
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