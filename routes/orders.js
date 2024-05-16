var express = require("express");
var router = express.Router();
var jsend = require("jsend");
var {
    getAllUserOrder,
    checkCartExist,
    checkCartIsEmpty,
    checkCountInStock,
    purchaseItems,
    updateProductQuantity,
    checkOut,
    updateMembership,
    getOneUserOrder,
    getAllOrders,
    changeStatus,
    deleteOrder,
    stopCheckOut,
    stopPurchaseItems,
} = require("../routerFuntions/orders/orderFunctions");
var isAdmin = require("../middlewares/auth/isAdmin");
var isAuth = require("../middlewares/auth/isAuth");
var checkFieldValidator = require("../middlewares/validators/checkFieldValidator");
var {
    updateOrderValidator,
} = require("../middlewares/validators/orderValidators");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

router.use(jsend.middleware);

// only user

router.post(
    "/user/checkout/:id",
    jsonParser,
    isAuth,
    async function (req, res) {
        // #swagger.tags = ['Orders-User']
        // #swagger.description = "Checks out a cart for a user. Only user has access"
        // #swagger.produces = ['application/json']
        const cartId = req.params?.id;
        let templateError;

        // check if user has a cart
        let userHasCart;
        if (!templateError) {
            userHasCart = await checkCartExist(cartId, req.user?.id);
            if (userHasCart?.statusCode !== 200) {
                templateError = userHasCart;
            }
        }

        // check if cart is empty or not
        if (!templateError) {
            const isEmpty = await checkCartIsEmpty(userHasCart?.result?.id);
            if (isEmpty?.statusCode !== 200) {
                templateError = isEmpty;
            }
        }

        // check countInStock for products
        if (!templateError) {
            const isInStock = await checkCountInStock(
                userHasCart?.result?.Items
            );
            if (isInStock?.statusCode !== 200) {
                templateError = isInStock;
            }
        }

        // try to check out
        if (!templateError) {
            const checkedOut = await checkOut(userHasCart?.result?.id);
            if (checkedOut?.statusCode !== 200) {
                templateError = checkedOut;
                
            }
        }

        // update items
        let itemIds;
        if (!templateError) {
            const itemsPurchased = await purchaseItems(
                userHasCart?.result?.Items
            );
            itemIds = itemsPurchased.result;
            if (itemsPurchased?.statusCode !== 200) {
                templateError = itemsPurchased;
                // if any error occurs in this phase, set back status of the order to 'not-checkout'
                await stopCheckOut(userHasCart?.result?.id)
            }
        }

        // update countInStock for products
        if (!templateError) {
            const productsUpdated = await updateProductQuantity(
                userHasCart?.result?.Items
            );
            if (productsUpdated?.statusCode !== 200) {
                templateError = productsUpdated;
                // if any error occurs in this phase, set back isPurchased of the items to 'false'
                await stopPurchaseItems(itemIds)
                // if any error occurs in this phase, set back status of the order to 'not-checkout'
                await stopCheckOut(userHasCart?.result?.id)
            }
        }


        
        // update memebership of user
        if (!templateError) {
            const updatedUser = await updateMembership(req.user?.id);
            if (updatedUser?.statusCode !== 200) {
                templateError = updatedUser;
            }
        }

        if (templateError?.statusCode === 400) {
            return res.status(400).jsend.fail({
                message: templateError.message,
                statusCode: 400,
            });
        } else if (templateError?.statusCode === 500) {
            return res.status(500).jsend.error({
                message: templateError.message,
                statusCode: 500,
            });
        } else {
            return res.status(200).jsend.success({
                message: "Your cart is now check out.",
                statusCode: 200,
            });
        }
    }
);

router.get("/user/all", isAuth, async function (req, res) {
    // #swagger.tags = ['Orders-User']
    // #swagger.description = "Returns all the orders for a user. Only user has access."
    // #swagger.produces = ['application/json']
    const orders = await getAllUserOrder(req.user?.id);
    if (orders?.statusCode === 500) {
        return res.status(500).jsend.error({
            message: orders.message,
            statusCode: 500,
        });
    }
    return res.status(200).jsend.success({
        result: orders.result,
        statusCode: 200,
    });
});

router.get("/user/:id", isAuth, async function (req, res) {
    // #swagger.tags = ['Orders-User']
    // #swagger.description = "Returns only one order for id provided in url path. Only user has access."
    // #swagger.produces = ['application/json']
    const orderId = req.params?.id;

    const response = await getOneUserOrder(orderId, req.user?.id);

    if (response?.statusCode === 500) {
        return res.status(500).jsend.error({
            message: response.message,
            statusCode: 500,
        });
    } else if (response?.statusCode === 400) {
        return res.status(400).jsend.fail({
            message: response.message,
            statusCode: 400,
        });
    }
    return res.status(200).jsend.success({
        result: response.result,
        statusCode: 200,
    });
});

// Only Admin ///////////////////////////////////////

router.get("/admin/all", isAdmin, async function (req, res) {
    // #swagger.tags = ['Orders-Admin']
    // #swagger.description = "Returns all the orders for all users. Only admin has access."
    // #swagger.produces = ['application/json']
    const orders = await getAllOrders();
    if (orders?.statusCode === 500) {
        return res.status(500).jsend.error({
            message: orders.message,
            statusCode: 500,
        });
    }
    return res.status(200).jsend.success({
        result: orders.result,
        statusCode: 200,
    });
});

router.put(
    "/admin/update/:id",
    isAdmin,
    updateOrderValidator,
    async function (req, res) {
        // #swagger.tags = ['Orders-Admin']
        // #swagger.description = "Change/updates status of a specific order for provided id in the url path. Only admin!"
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which must contain statusName field.",
    "required": "true",
    "schema": {
        $ref: "#/definitions/UpdateOrder"
        }
    }
    */
        const { statusName } = req.body;
        const orderId = req.params?.id;
        const response = await changeStatus(orderId, statusName);

        if (response?.statusCode === 500) {
            return res.status(500).jsend.error({
                message: response.message,
                statusCode: 500,
            });
        } else if (response?.statusCode === 400) {
            return res.status(400).jsend.fail({
                message: response.message,
                statusCode: 400,
            });
        }
        return res.status(200).jsend.success({
            result: response.result,
            statusCode: 200,
        });
    }
);

router.delete("/admin/delete/:id", isAdmin, async function (req, res) {
    // #swagger.tags = ['Orders-Admin']
    // #swagger.description = "Deletes a specific order. The order must reach the 'Completed' status, otherwise can not be deleted. Order id must be provided in the url path. Only admin"
    // #swagger.produces = ['application/json']
    const orderId = req.params?.id;
    const response = await deleteOrder(orderId);

    if (response?.statusCode === 500) {
        return res.status(500).jsend.error({
            message: response.message,
            statusCode: 500,
        });
    } else if (response?.statusCode === 400) {
        return res.status(400).jsend.fail({
            message: response.message,
            statusCode: 400,
        });
    }
    return res.status(200).jsend.success({
        result: response.result,
        statusCode: 200,
    });
});

module.exports = router;
