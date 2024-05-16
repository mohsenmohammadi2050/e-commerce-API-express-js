var express = require("express");
var router = express.Router();
var jsend = require("jsend");
const { getCartItems, getCartItemsDeleted, addItemtoCart, updateItemQuantity, deleteItemFromCart, createCart, getAllDeletedItems, getAllPurchasedItems } = require("../routerFuntions/carts/cartFunctions")
var isAuth = require("../middlewares/auth/isAuth");
var isAdmin = require("../middlewares/auth/isAdmin")
var {
    addItemValidator,
    updateItemByUserValidator,
} = require("../middlewares/validators/itemValidator");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

router.use(jsend.middleware);


// only user
router.get("/now/veiwItems", isAuth, async function (req, res) {
    // #swagger.tags = ['UserCartItems']
    // #swagger.description = "Returns all the cart items for a user. Only user has access"
    // #swagger.produces = ['application/json']
    const response = await getCartItems(req.user?.id)
    if (response?.statusCode === 400) {
        return res.status(400).jsend.fail({
            message: response.message,
            statusCode: 400,
        });
    }else if (response?.statusCode === 500) {
        return res.status(500).jsend.error({
            message: response.message,
            statusCode: 500,
        });
    }

    return res.status(200).jsend.success({
        result: response.result,
        statusCode: 200
    })
});


router.get("/now/veiwItems/deleted", isAuth, async function (req, res) {
    // #swagger.tags = ['UserCartItems']
    // #swagger.description = "Returns all the cart items which has been deleted by user. Only user has access"
    // #swagger.produces = ['application/json']
    const response = await getCartItemsDeleted(req.user?.id)
    if (response?.statusCode === 400) {
        return res.status(400).jsend.fail({
            message: response.message,
            statusCode: 400,
        });
    }else if (response?.statusCode === 500) {
        return res.status(500).jsend.error({
            message: response.message,
            statusCode: 500,
        });
    }

    return res.status(200).jsend.success({
        result: response.result,
        statusCode: 200
    })
});

router.post(
    "/now/addItem",
    jsonParser,
    isAuth,
    addItemValidator,
    async function (req, res) {
        // #swagger.tags = ['UserCartItems']
        // #swagger.description = "Adds a new item to user's cart. Only user has access"
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which contains credentials such as quantity and product id",
    "required": "true",
    "schema": {
        $ref: "#/definitions/AddItemToCart"
        }
    }
    */
        const { quantity, productId } = req.body;

        // check if user has a cart. If not, create a cart first.
        const response = await createCart(req.user?.id, productId, quantity)
        if (response?.statusCode === 400) {
            return res.status(400).jsend.fail({
                message: response.message,
                statusCode: 400,
            });
        }else if (response?.statusCode === 500) {
            return res.status(500).jsend.error({
                message: response.message,
                statusCode: 500,
            });
        } else if (response?.statusCode === 201) {
            return res.status(201).jsend.success({
                result: response.result,
                statusCode: 201,
            });
        }

        let cart = response.result;

        const result = await addItemtoCart(req.user?.id, productId, cart, quantity)
        if (result?.statusCode === 400) {
            return res.status(400).jsend.fail({
                message: result.message,
                statusCode: 400,
            });
        }else if (result?.statusCode === 500) {
            return res.status(500).jsend.error({
                message: result.message,
                statusCode: 500,
            });
        } else if (result?.statusCode === 200) {
            return res.status(200).jsend.success({
                result: result.result,
                statusCode: 200,
            });
        }
    }
);

router.put(
    "/now/updateItem/:id",
    jsonParser,
    isAuth,
    updateItemByUserValidator,
    async function (req, res) {
        // #swagger.tags = ['UserCartItems']
        // #swagger.description = "Updates only quantity of an item in user's cart. Item's id must be provided in url path. Only user!"
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which contain newQuantity field",
    "required": "true",
    "schema": {
        $ref: "#/definitions/UpdateQuantityCartItem"
        }
    }
    */
        const { newQuantity } = req.body;
        const itemId = req.params?.id;

        const updatedItem = await updateItemQuantity(req.user?.id, itemId, newQuantity);
        if (updatedItem?.statusCode === 400) {
            return res.status(400).jsend.fail({
                message: updatedItem.message,
                statusCode: 400,
            });
        }else if (updatedItem?.statusCode === 500) {
            return res.status(500).jsend.error({
                message: updatedItem.message,
                statusCode: 500,
            });
        } 
        return res.status(200).jsend.success({
            result: updatedItem.result,
            statusCode: 200,
        });
    }
);

router.delete("/now/deleteItem/:id", isAuth, async function (req, res) {
    // #swagger.tags = ['UserCartItems']
    // #swagger.description = "Deletes a specific item for the provided id in url path. Only user itself!"
    // #swagger.produces = ['application/json']
    const itemId = req.params?.id;
    const deleteItem = await deleteItemFromCart(req.user?.id, itemId);
    if (deleteItem?.statusCode === 400) {
        return res.status(400).jsend.fail({
            message: deleteItem.message,
            statusCode: 400,
        });
    }else if (deleteItem?.statusCode === 500) {
        return res.status(500).jsend.error({
            message: deleteItem.message,
            statusCode: 500,
        });
    } 
    return res.status(200).jsend.success({
        result: deleteItem.result,
        statusCode: 200,
    });
});


// only admin

router.get("/now/purchasedItems", isAdmin, async function(req, res) {
    // #swagger.tags = ['Items']
    // #swagger.description = "Returns all purchased items. Only admin"
    // #swagger.produces = ['application/json']
    const response = await getAllPurchasedItems()
    if (response?.statusCode === 500) {
        return res.status(500).jsend.error({
            message: response.message,
            statusCode: 500,
        });
    }

    return res.status(200).jsend.success({
        result: response.result,
        statusCode: 200
    })
})




router.get("/now/deletedItems", isAdmin, async function(req, res) {
    // #swagger.tags = ['Items']
    // #swagger.description = "Returns all deleted items. Only admin"
    // #swagger.produces = ['application/json']
    const response = await getAllDeletedItems()
    if (response?.statusCode === 500) {
        return res.status(500).jsend.error({
            message: response.message,
            statusCode: 500,
        });
    }

    return res.status(200).jsend.success({
        result: response.result,
        statusCode: 200
    })
})




module.exports = router;
