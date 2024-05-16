var express = require("express");
var router = express.Router();
var jsend = require("jsend");
var checkFieldValidator = require("../middlewares/validators/checkFieldValidator");
var isAdmin = require("../middlewares/auth/isAdmin");
const { getAllStauses, getOneStatus, createStatus, updateStatus, deleteStatus } = require("../routerFuntions/statuses/statusFunctions");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

router.use(jsend.middleware);

router.get("/", isAdmin, async function (req, res) {
    // #swagger.tags = ['Statuses']
    // #swagger.description = "Returns all statuses. Only admin can view"
    // #swagger.produces = ['application/json']
    
    const response = await getAllStauses();

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

router.get("/:id", isAdmin, async function (req, res) {
    // #swagger.tags = ['Statuses']
    // #swagger.description = "Returns one role which has an id equals to the provided id in the url path. Only admin can view"
    // #swagger.produces = ['application/json']
    const statusId = req.params?.id;
    
    const response = await getOneStatus(statusId);
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
    checkFieldValidator("statusName"),
    async function (req, res) {
        // #swagger.tags = ['Statuses']
        // #swagger.description = "Create a new status. Only admin has access."
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which contains a statusName",
    "required": "true",
    "schema": {
        $ref: "#/definitions/CreateStatus"
        }
    }
    */
        const { statusName } = req.body;

        const response = await createStatus(statusName);
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
        // #swagger.tags = ['Statuses']
        // #swagger.description = "Updates a status. id of the target status must be provided in the url path. Only admin has access"
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which contains a field newName",
    "required": "true",
    "schema": {
        $ref: "#/definitions/UpdateStatus"
        }
    }
    */

        const { newName } = req.body;
        const statusId = parseInt(req.params?.id);
        const response = await updateStatus(statusId, newName)
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
    // #swagger.tags = ['Statuses']
    // #swagger.description = "Deletes a specific status. status's id must be provided in the url path. Only admin!"
    // #swagger.produces = ['application/json']
    const statusId = req.params?.id;

    const response = await deleteStatus(statusId);
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