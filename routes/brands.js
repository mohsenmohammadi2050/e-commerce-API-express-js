var express = require("express");
var router = express.Router();
var jsend = require("jsend");
const { getAllBrands, getOneBrand, createBrand, deleteBrand, updateBrand } = require("../routerFuntions/brands/brandFunctions")
var isAdmin = require("../middlewares/auth/isAdmin");
var checkFieldValidator = require("../middlewares/validators/checkFieldValidator");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

router.use(jsend.middleware);

router.get("/", async function (req, res) {
    // #swagger.tags = ['Brands']
    // #swagger.description = "Returns all brands"
    // #swagger.produces = ['application/json']
    const response = await getAllBrands();

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
    // #swagger.tags = ['Brands']
    // #swagger.description = "Returns one brand which has an id equals to the provided id in the url path."
    // #swagger.produces = ['application/json']
    const brandId = req.params?.id;
    
    const response = await getOneBrand(brandId);
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
    checkFieldValidator("brandName"),
    async function (req, res) {
        // #swagger.tags = ['Brands']
        // #swagger.description = "Create a new brand. Only admin!!."
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which contains a brandName",
    "required": "true",
    "schema": {
        $ref: "#/definitions/CreateBrand"
        }
    }
    */
        const { brandName } = req.body;

        const response = await createBrand(brandName);
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
        // #swagger.tags = ['Brands']
        // #swagger.description = "Updates a brand. id of the target brand must be provided in the url path. Only admin has access"
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which contains a field newName",
    "required": "true",
    "schema": {
        $ref: "#/definitions/UpdateBrand"
        }
    }
    */

        const { newName } = req.body;
        const brandId = parseInt(req.params?.id);
        const response = await updateBrand(brandId, newName)
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
    // #swagger.tags = ['Brands']
    // #swagger.description = "Deletes a specific brand. Brand's id must be provided in the url path. Only admin!!"
    // #swagger.produces = ['application/json']
    const brandId = req.params?.id;

    const response = await deleteBrand(brandId);
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
