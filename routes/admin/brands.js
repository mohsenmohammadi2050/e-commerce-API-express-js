var express = require("express");
var router = express.Router();
var axios = require("axios");
var isAdminLoggedIn = require("../../middlewares/auth/isAdminLoggedIn")

router.get("/", isAdminLoggedIn, async function (req, res) {
    const user = req.user;
    let errorMessage;
    let brands;

    try {
        const response = await axios.get("http://localhost:3000/brands/")
        if (response.status === "error") {
            errorMessage = "Error from server! try later on";
        }else {
            brands = response.data.data.result;
        }
        res.render("brands", { brands: brands, error: errorMessage, user: user});

    } catch (error) {
        errorMessage = "Error from server! try later on";
        res.render("brands", {brands: brands, error: errorMessage, user: user});
    }
});

module.exports = router;