var express = require("express");
var router = express.Router();
var axios = require("axios");
var isAdminLoggedIn = require("../../middlewares/auth/isAdminLoggedIn")

router.get("/", isAdminLoggedIn, async function (req, res) {
    const user = req.user;
    let errorMessage;
    let statuses;
    const token = req.cookies?.adminToken

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.get("http://localhost:3000/statuses/", config)
        if (response.status === "error") {
            errorMessage = "Error from server! try later on";
        }else {
            statuses = response.data.data.result;
        }
        res.render("statuses", { statuses: statuses, error: errorMessage, user: user});

    } catch (error) {
        errorMessage = "Error from server! try later on";
        res.render("statuses", { statuses: statuses, error: errorMessage, user: user});
    }
});

module.exports = router;