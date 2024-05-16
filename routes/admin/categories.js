var express = require("express");
var router = express.Router();
var axios = require("axios");
var isAdminLoggedIn = require("../../middlewares/auth/isAdminLoggedIn")

router.get("/", isAdminLoggedIn, async function (req, res) {
    const user = req.user;
    let errorMessage;
    let categories;

    try {
        const response = await axios.get("http://localhost:3000/categories/")
        if (response.status === "error") {
            errorMessage = "Error from server! try later on";
        }else {
            categories = response.data.data.result;
        }
        res.render("categories", { categories: categories, error: errorMessage, user: user});

    } catch (error) {
        errorMessage = "Error from server! try later on";
        res.render("categories", {categories: categories, error: errorMessage, user: user});
    }
});

module.exports = router;