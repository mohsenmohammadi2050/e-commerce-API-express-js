var express = require("express");
var router = express.Router();
var jsend = require("jsend");
var checkFieldValidator = require("../middlewares/validators/checkFieldValidator");
var isAdmin = require("../middlewares/auth/isAdmin");
var bodyParser = require("body-parser");
const { getAllRoles, getOneRole, createRole, updateRole, deleteRole } = require("../routerFuntions/roles/roleFunctions");
var jsonParser = bodyParser.json();

router.use(jsend.middleware);

router.get("/", isAdmin, async function (req, res) {
    // #swagger.tags = ['Roles']
    // #swagger.description = "Returns all roles. Only admin can view"
    // #swagger.produces = ['application/json']

    const response = await getAllRoles();

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
    // #swagger.tags = ['Roles']
    // #swagger.description = "Returns one role which has an id equals to the provided id in the url path. Only admin can view"
    // #swagger.produces = ['application/json']
    const roleId = req.params?.id;


    const response = await getOneRole(roleId);
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
    checkFieldValidator("roleName"),
    async function (req, res) {
        // #swagger.tags = ['Roles']
        // #swagger.description = "Create a new role. Only admin has access."
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which contains a roleName",
    "required": "true",
    "schema": {
        $ref: "#/definitions/CreateRole"
        }
    }
    */
        const { roleName } = req.body;

        const response = await createRole(roleName);
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
        // #swagger.tags = ['Roles']
        // #swagger.description = "Updates a role. id of the target role must be provided in the url path. Only admin has access"
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which contains a field newName",
    "required": "true",
    "schema": {
        $ref: "#/definitions/UpdateRole"
        }
    }
    */

        const { newName } = req.body;
        const roleId = parseInt(req.params?.id);
        const response = await updateRole(roleId, newName)
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
    // #swagger.tags = ['Roles']
    // #swagger.description = "Deletes a specific role. Role's id must be provided in the url path. Only admin!"
    // #swagger.produces = ['application/json']
    const roleId = req.params?.id;

    const response = await deleteRole(roleId);
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
