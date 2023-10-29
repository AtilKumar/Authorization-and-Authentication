const express = require("express");
const router = express.Router()

const {login, signup} = require("../controller/auth")
const {mw, isStudent, isAdmin} = require("../middlewares/mw")

router.post("/login", login)
router.post("/signup", signup)

router.get("/student", mw, isStudent, (req,res) => {
    res.json({
        success: true,
        message: "Welcome to the Protected route for students"
    })
})
router.get("/admin", mw, isAdmin, (req,res) => {
    res.json({
        success: true,
        message: "Welcome to the Protected route for admins"
    })
})

module.exports = router;