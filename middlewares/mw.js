const jwt = require("jsonwebtoken")
require("dotenv").config();

exports.mw = (req, res, next) => {
    try{
        // const token = req.body.token
        console.log("cookie", req.cookies.token)
        console.log("body", req.body.token)
        console.log("body", req.header("Authorization"))

        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","")

        if(!token || token === undefined){
            return res.status(401).json({
                success: false,
                message: "Token Missing",
            })
        }
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET)
            console.log(payload),

            req.user = payload;
        }catch(error){
            return res.status(401).json({
                success: false,
                message: "token is invalid"
            })
        }
        next();
    }catch(error){
        return res.status(401).json({
            success: false,
            message: "something went wrong"
        })
    }
}

exports.isStudent = (req, res, next) => {
    try{
        if(req.user.role !== "student"){
            return res.status(401).json({
                success: false,
                message: "This is protected route for students"
            })
        }
        next()
    }catch(error){
        return res.status(401).json({
            success: false,
            message: "something went wrong while accessing the Student route"
        })
    }
}

exports.isAdmin = (req, res, next) => {
    try{
        if(req.user.role !== "admin"){
            return res.status(401).json({
                success: false,
                message: "This is protected route for Admin"
            })
        }
        next()
    }catch(error){
        return res.status(401).json({
            success: false,
            message: "something went wrong while accessing the Admin route"
        })
    }
}