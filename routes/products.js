var express = require("express");
var router = express.Router();
const isAdmin = require("../middlewares/auth/isAdmin");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var jsend = require("jsend");
const {
    getAllProducts,
    getOneProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    updateItemsPrice,
    restoreProduct,
} = require("../routerFuntions/products/productFunctions");
const {
    productUpdateValidator, productCreateValidator,
} = require("../middlewares/validators/productValidator");

router.use(jsend.middleware);

/* Return all products*/
router.get("/", async (req, res) => {
    // #swagger.tags = ['Products']
    // #swagger.description = "Returns all the products"
    // #swagger.produces = ['application/json']
    const response = await getAllProducts();

    if (response?.statusCode === 500) {
        return res.status(500).jsend.error({
            message: response.message,
            statusCode: 500,
        });
    }
    return res.status(200).jsend.success({
        result: response.result,
        statusCode: 200,
    });
});

router.get("/:id", async function (req, res) {
    // #swagger.tags = ['Products']
    // #swagger.description = "Returns only one product for id provided in url path"
    // #swagger.produces = ['application/json']
    const productId = req.params?.id;

    const response = await getOneProduct(productId);
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

router.post(
    "/create",
    jsonParser,
    productCreateValidator,
    isAdmin,
    async function (req, res) {
        // #swagger.tags = ['Products']
        // #swagger.description = "Adds a new product. Only admin user has access"
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which contains credentials such as name, imgUrl, description, price, countInStock, brandName and categoryName.",
    "required": "true",
    "schema": {
        $ref: "#/definitions/CreateProduct"
        }
    }
    */
        const {
            name,
            imgUrl,
            description,
            price,
            countInStock,
            brandName,
            categoryName,
        } = req.body;

        const response = await createProduct(
            name,
            imgUrl,
            description,
            price,
            countInStock,
            brandName,
            categoryName
        );

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
            result: response?.result,
            statusCode: 200,
        });
    }
);

router.put(
    "/update/:id",
    jsonParser,
    isAdmin,
    productUpdateValidator,
    async function (req, res) {
        // #swagger.tags = ['Products']
        // #swagger.description = "Change/updates a specific product for provided id in the url path. Only admin!"
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which must contain following credentials:
     name, imgUrl, description, price, countInStock, brandName, categoryName.",
    "required": "true",
    "schema": {
        $ref: "#/definitions/UpdateProduct"
        }
    }
    */
        const {
            newName,
            newImgUrl,
            newDescription,
            newPrice,
            newCountInStock,
            newBrandName,
            newCategoryName,
        } = req.body;

        const productId = parseInt(req.params.id);

        const response = await updateProduct(
            newName,
            newImgUrl,
            newDescription,
            newPrice,
            newCountInStock,
            newBrandName,
            newCategoryName,
            productId
        );
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
        } else if (response?.statusCode === 200) {
            // update items which are not checked out yet. If price of a product is changed, price of these items should be changed based on membership status.
            if (newPrice || newPrice === 0) {
                const updatedItems = await updateItemsPrice(productId, newPrice);
                if (updatedItems?.statusCode === 500) {
                    return res.status(500).jsend.error({
                        message: updatedItems.message,
                        statusCode: 500,
                    });
                } else {
                    return res.status(200).jsend.success({
                        result: response.result,
                        statusCode: 200,
                    });
                }
            }
        } else {
            return res.status(200).jsend.success({
                result: response.result,
                statusCode: 200,
            });
        }
    }
);

router.put("/restore/:id", jsonParser, isAdmin, async function (req, res) {
    // #swagger.tags = ['Products']
    // #swagger.description = "Restore a specific product for provided id in the url path. Only admin!"
    // #swagger.produces = ['application/json']

    const productId = parseInt(req.params.id);

    const response = await restoreProduct(productId);
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

router.delete("/delete/:id", isAdmin, async function (req, res) {
    // #swagger.tags = ['Products']
    // #swagger.description = "Deletes a specific product for the provided id in url path. Only admin!"
    // #swagger.produces = ['application/json']
    const productId = req.params?.id;

    const response = await deleteProduct(productId);

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
