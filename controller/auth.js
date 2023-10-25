const bcrypt = require("bcrypt")
const userModel = require("../models/userModel")

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