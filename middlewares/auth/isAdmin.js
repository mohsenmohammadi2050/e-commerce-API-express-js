var jwt = require("jsonwebtoken");
var db = require("../../models");
var UserService = require("../../services/UserService");
var userService = new UserService(db);

async function isAdmin(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).jsend.fail({
            message: "token is not provided",
            statusCode: 401,
        });
    } else {
        try {
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
            const user_ = await userService.getOneById(decodedToken.id);
            if (user_?.isDeleted == true){
                return res.status(401).jsend.fail({
                    message: "Not found user(deleted)!!",
                    statusCode: 401,
                });
            } else if (user_.RoleId != 1) {
                return res.status(401).jsend.fail({
                    message: "Not authorized. Only admin user!!",
                    statusCode: 401,
                });
              } else {
                req.user = decodedToken;
                next();
                return;
              }
        } catch (err) {
            return res.status(401).jsend.fail({ message: err?.message, statusCode:401 });
        }
    }
    
}

module.exports = isAdmin;