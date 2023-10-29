const bcrypt = require("bcrypt")
const userModel = require("../models/userModel")
require("dotenv").config()
const jwt = require("jsonwebtoken")

exports.signup = async(req, res) => {
    try{
        const {name, email, password, role} = req.body;
        const existingUser = await userModel.findOne({email})

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        let hashPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10)
        }
        catch(err){
            return res.status(500).json({
                success: false,
                message: "Error in hashing Password"
            })
        }

        //create entry for user

        const user = await userModel.create({
            name, email, password: hashedPassword, role
        })

        return res.status(200).json({
            success: true,
            message: 'User Created Successfully'
        })
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "User can not be registered, please try again"
        })
    }
}

//Handling user login

exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "please fill all the details carefully"
            })
        }

        let user = await userModel.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User is not registered"
            })
        }
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        }
        if(await bcrypt.compare(password, user.password)){
            let token = jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn: "2h"
            })

            user = user.toObject()
            user.token = token;
            user.password = undefined;
            const options = {
                expires: new Date((Date.now() + 3*24*60*60*1000)),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User logged in successfully"
            })
            // res.status(200).json({
            //     success: true,
            //     token,
            //     user,
            //     message: "User logged in successfully"
            // })

        }else{
            return res.status(403).json({
                success: false,
                message: "password incorrect"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "login failure"
        })
    }
}