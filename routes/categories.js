var express = require("express");
var router = express.Router();
var jsend = require("jsend");
var isAdmin = require("../middlewares/auth/isAdmin");
var checkFieldValidator = require("../middlewares/validators/checkFieldValidator");
var bodyParser = require("body-parser");
const { getAllCategories, getOneCategory, createCategory, updateCategory, deleteCategory } = require("../routerFuntions/categories/categoryFuctions");
var jsonParser = bodyParser.json();

router.use(jsend.middleware);

router.get("/", async function (req, res) {
    // #swagger.tags = ['Categories']
    // #swagger.description = "Returns all categories"
    // #swagger.produces = ['application/json']
    
    const response = await getAllCategories();

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
    // #swagger.tags = ['Categories']
    // #swagger.description = "Returns one category which has an id equals to the provided id in the url path."
    // #swagger.produces = ['application/json']
    const categoryId = req.params?.id;
    
    const response = await getOneCategory(categoryId);
    if (response?.statusCode === 500) {
        return res.status(500).jsend.error({
            message: response.message,
            statusCode: 500,
        });
    } else if (response?.statusCode === 400) {
        return res.status(500).jsend.fail({
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
    isAdmin,
    checkFieldValidator("categoryName"),
    async function (req, res) {
        // #swagger.tags = ['Categories']
        // #swagger.description = "Create a new category. Only admin!!."
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which contains a categoryName",
    "required": "true",
    "schema": {
        $ref: "#/definitions/CreateCategory"
        }
    }
    */
        const { categoryName } = req.body;

        const response = await createCategory(categoryName);
        if (response?.statusCode === 500) {
            return res.status(500).jsend.error({
                message: response.message,
                statusCode: 500,
            });
        } else if (response?.statusCode === 400) {
            return res.status(500).jsend.fail({
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

router.put(
    "/update/:id",
    jsonParser,
    isAdmin,
    checkFieldValidator("newName"),
    async function (req, res) {
        // #swagger.tags = ['Categories']
        // #swagger.description = "Updates a category. id of the target category must be provided in the url path. Only admin has access"
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which contains a field newName",
    "required": "true",
    "schema": {
        $ref: "#/definitions/UpdateCategory"
        }
    }
    */

        const { newName } = req.body;
        const categoryId = parseInt(req.params?.id);

        const response = await updateCategory(categoryId, newName)
        if (response?.statusCode === 500) {
            return res.status(500).jsend.error({
                message: response.message,
                statusCode: 500,
            });
        } else if (response?.statusCode === 400) {
            return res.status(500).jsend.fail({
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

router.delete("/delete/:id", isAdmin, async function (req, res) {
    // #swagger.tags = ['Categories']
    // #swagger.description = "Deletes a specific category. Category's id must be provided in the url path. Only admin"
    // #swagger.produces = ['application/json']
    const categoryId = req.params?.id;

    const response = await deleteCategory(categoryId);
    if (response?.statusCode === 500) {
        return res.status(500).jsend.error({
            message: response.message,
            statusCode: 500,
        });
    } else if (response?.statusCode === 400) {
        return res.status(500).jsend.fail({
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
