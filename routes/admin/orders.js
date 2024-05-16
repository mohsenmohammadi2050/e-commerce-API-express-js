var express = require("express");
var router = express.Router();
var axios = require("axios");
var isAdminLoggedIn = require("../../middlewares/auth/isAdminLoggedIn")

router.get("/", isAdminLoggedIn, async function (req, res) {
    const user = req.user;
    let errorMessage;
    let orders;
    let statuses;
    const token = req.cookies?.adminToken
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    
    try {
        const response_orders = await axios.get("http://localhost:3000/orders/admin/all/", config)
        if (response_orders.status === "error") {
            errorMessage = "Error from server! try later on";
        }else {
            orders = response_orders.data.data.result;
        }

        const response_statuses = await axios.get("http://localhost:3000/statuses/", config)
        if (response_statuses.status === "error") {
            errorMessage = "Error from server! try later on";
        }else {
            statuses = response_statuses.data.data.result;
        }
        res.render("orders", { orders: orders, statuses: statuses, error: errorMessage, user: user});

    } catch (error) {
        errorMessage = "Error from server! try later on";
        res.render("orders", {orders: orders, error: errorMessage, user: user});
    }
});


module.exports = router;