const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.registerController = async (req, res) => {
    try {

        const { name, email, password, role } = req?.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: 'bad request.'
            })
        }

        const existsUser = await userModel.findOne({ email });

        if (existsUser) {
            return res.status(400).json({
                message: 'user already exists.'
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            name,
            email,
            password: hashPassword,
            role,
        });

        res.status(201).json({
            message: 'user register successfully.',
            newUser,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'internal server error.'
        })
    }
}


exports.loginController = async (req, res) => {
    try {

        const { email, password } = req?.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'bad request'
            })
        }

        const findUser = await userModel.findOne({ email }).select('password role');

        if (!findUser) {
            return res.status(404).json({
                message: "user not found."
            })
        }

        const comparePassword = await bcrypt.compare(password, findUser.password);

        if (!comparePassword) {
            return res.status(400).json({
                message: 'inncorrect password.'
            })
        }

        const token = jwt.sign(
            { id: findUser._id, role: findUser.role },
            process.env.JWT
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.status(200).json({
            message: 'login successfully.',
            user: findUser,
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'internal server error.'
        })
    }
}


exports.logoutController = async (req, res) => {
    try {

        const token = req?.cookies.token;

        if (!token) {
            return res.status(404).json({
                message: 'token not found.'
            })
        }

        res.clearCookie('token');

        res.status(200).json({
            message: 'logout successfully.'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'internal server error.'
        })
    }
}


exports.profileController = async (req, res) => {
    try {
        const userid = req.user?.id;

        if (!userid) {
            return res.status(403).json({
                message: 'unauthorized.'
            })
        }

        const user = await userModel.findOne({ _id: userid }).select("-password");

        res.status(200).json({
            message: 'profile access',
            user: user,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'internal server error.'
        })
    }
}