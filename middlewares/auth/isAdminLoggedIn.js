var jwt = require("jsonwebtoken");
var db = require("../../models");
var UserService = require("../../services/UserService");
var userService = new UserService(db);

async function isAdminLoggedIn(req, res, next) {
    let token = req.cookies?.adminToken 
    if (!token) {
        res.locals.authorizeMessage = "Token are not provided. Please log in first in the login page."
        return res.render("tokenerrorpage")
    } else {
        try {
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
            const user = await userService.getOneById(decodedToken?.id)
            if (user?.RoleId == 1) {
                req.user = decodedToken;
                next();
                return;
              } else {
                  res.locals.authorizeMessage = "Not authorized. Only admin user!!";
                  res.render("tokenerrorpage")
                  return;
              }
        } catch (err) {
            res.locals.authorizeMessage = err?.message
            return res.render("tokenerrorpage")
        }
    }
    
}

module.exports = isAdminLoggedIn;