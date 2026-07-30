const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authHandler = (req,res,next) =>{
    try {
        
        const token = req?.cookies?.token;

        if(!token){
            return res.status(403).json({
                message:'unauthorized.'
            })
        }

        const decoded = jwt.verify(token,process.env.JWT);

        req.user = decoded;

        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:'internal server error.'
        })
    }
}