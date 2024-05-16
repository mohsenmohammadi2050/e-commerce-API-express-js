var express = require("express");
var router = express.Router();
var jsend = require("jsend");
var {
    membershipCreateValidator,
    membershipUpdateValidator,
} = require("../middlewares/validators/membershipValidators");
var isAdmin = require("../middlewares/auth/isAdmin");
var bodyParser = require("body-parser");
const { getAllMemberships, getOneMembership, createMembership, updateMembership, deleteMembership } = require("../routerFuntions/memberships/membershipFunctions");
var jsonParser = bodyParser.json();

router.use(jsend.middleware);

router.get("/", isAdmin, async function (req, res) {
    // #swagger.tags = ['Memberships']
    // #swagger.description = "Returns all memberships. Only admin can view"
    // #swagger.produces = ['application/json']
    
    const response = await getAllMemberships();

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
    // #swagger.tags = ['Memberships']
    // #swagger.description = "Returns one membership which has an id equals to the provided id in the url path. Only admin can view"
    // #swagger.produces = ['application/json']
    const membershipId = req.params?.id;

    const response = await getOneMembership(membershipId);
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
    membershipCreateValidator,
    async function (req, res) {
        // #swagger.tags = ['Memberships']
        // #swagger.description = "Create a new membership. Only admin has access."
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which contains a membershipName and amount of discount",
    "required": "true",
    "schema": {
        $ref: "#/definitions/CreateMembership"
        }
    }
    */
        const { membershipName, discount } = req.body;
        const response = await createMembership(membershipName, discount);
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
    membershipUpdateValidator,
    async function (req, res) {
        // #swagger.tags = ['Memberships']
        // #swagger.description = "Updates a membership. id of the target membership must be provided in the url path. Only admin has access"
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which contains a field newName and a field newDiscount",
    "required": "true",
    "schema": {
        $ref: "#/definitions/UpdateMembership"
        }
    }
    */
        const { newName, newDiscount } = req.body;
        const membershipId = parseInt(req.params?.id);

        const response = await updateMembership(
            membershipId, newName, newDiscount
        );

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
    // #swagger.tags = ['Memberships']
    // #swagger.description = "Deletes a specific membership. membership's id must be provided in the url path. Only admin has access"
    // #swagger.produces = ['application/json']
    const membershipId = req.params?.id;

    const response = await deleteMembership(membershipId);
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
