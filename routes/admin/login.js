var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var db = require("../../models");
var UserService = require("../../services/UserService");
var userService = new UserService(db);
var jsend = require("jsend");

router.use(jsend.middleware);

router.get("/login", async function (req, res, next) {
    let token = req.cookies?.adminToken 
    let user;
    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await userService.getOneById(decodedToken?.id)
        if (user?.RoleId === 1) {
            user = decodedToken;
        }else {
            user = null
        }
    } catch (err) {
        user = null
    }
    
    res.render("login", { user: user });
});


router.post("/login", function (req, res, next) {
    const { adminToken } = req.body;
    res.cookie('adminToken', adminToken, {
        httpOnly: true,
        secure: true, 
        maxAge: 7200000,
        path: '/',
      });
    res.status(200).json({result: "You are logged in", statusCode: 200})
});


router.post("/logout", function (req, res, next) {
    res.clearCookie('adminToken');
    res.status(200).json({result: "You are logged out", statusCode: 200})
});



module.exports = router;
