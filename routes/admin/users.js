var express = require("express");
var router = express.Router();
var axios = require("axios");
var isAdminLoggedIn = require("../../middlewares/auth/isAdminLoggedIn")

router.get("/all", isAdminLoggedIn, async function (req, res) {
    const user = req.user;
    let errorMessage;
    let users;
    let roles;
    const token = req.cookies?.adminToken

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response_users = await axios.get("http://localhost:3000/users/admin/allUsers", config)
        if (response_users.status === "error") {
            errorMessage = "Error from server! try later on";
        }else {
            users = response_users.data.data.result;
        }

        const response_roles = await axios.get("http://localhost:3000/roles/", config)
        if (response_roles.status === "error") {
            errorMessage = "Error from server! try later on";
        }else {
            roles = response_roles.data.data.result;
        }
        res.render("users", { users: users, roles: roles, error: errorMessage, user: user});

    } catch (error) {
        errorMessage = "Error from server! try later on";
        res.render("users", {users: users, roles: roles, error: errorMessage, user: user});
    }
});


router.get("/all/deleted", isAdminLoggedIn, async function (req, res) {
    const user = req.user;
    let errorMessage;
    let users;
    let roles;
    const token = req.cookies?.adminToken
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const response = await axios.get("http://localhost:3000/users/admin/allUsers/deleted", config)
        if (response.status === "error") {
            errorMessage = "Error from server! try later on";
        }else {
            users = response.data.data.result;
        }
        const response_roles = await axios.get("http://localhost:3000/roles/", config)
        if (response_roles.status === "error") {
            errorMessage = "Error from server! try later on";
        }else {
            roles = response_roles.data.data.result;
        }
        res.render("users", { users: users, roles: roles, error: errorMessage, user: user});

    } catch (error) {
        errorMessage = "Error from server! try later on";
        res.render("users", {users: users, roles: roles, error: errorMessage, user: user});
    }
});


module.exports = router;