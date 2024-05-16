var express = require("express");
var router = express.Router();
var axios = require("axios");
var isAdminLoggedIn = require("../../middlewares/auth/isAdminLoggedIn")

router.get("/all", isAdminLoggedIn, async function (req, res) {
    const user = req.user;
    let errorMessage;
    let items;
    const token = req.cookies?.adminToken

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.get("http://localhost:3000/checkout/now/purchasedItems", config)
        if (response.status === "error") {
            errorMessage = "Error from server! try later on";
        }else {
            items = response.data.data.result;
        }
        
        res.render("items", { items: items, error: errorMessage, user: user});

    } catch (error) {
        errorMessage = "Error from server! try later on";
        res.render("items", {items: items, error: errorMessage, user: user});
    }
});


router.get("/all/deleted", isAdminLoggedIn, async function (req, res) {
    const user = req.user;
    let errorMessage;
    let items;
    const token = req.cookies?.adminToken
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const response = await axios.get("http://localhost:3000/checkout/now/deletedItems", config)
        if (response.status === "error") {
            errorMessage = "Error from server! try later on";
        }else {
            items = response.data.data.result;
        }
        
        res.render("items", { items: items, error: errorMessage, user: user});

    } catch (error) {
        errorMessage = "Error from server! try later on";
        res.render("items", {items: items, error: errorMessage, user: user});
    }
});


module.exports = router;