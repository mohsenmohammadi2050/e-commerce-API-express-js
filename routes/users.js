var express = require("express");
var router = express.Router();
const isAdmin = require("../middlewares/auth/isAdmin");
const isAuth = require("../middlewares/auth/isAuth");
var db = require("../models");
var UserService = require("../services/UserService");
var userService = new UserService(db);
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var jsend = require("jsend");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
const { getOneUser, deleteUser, getAllUsers, getOneUserByAdmin, updateRoleUser, getAllDeleted } = require("../routerFuntions/users/userFunctions");
const { userUpdateValidator } = require("../middlewares/validators/userValidators");
const checkFieldValidator = require("../middlewares/validators/checkFieldValidator")

router.use(jsend.middleware);



// only user
router.get("/user", isAuth, async function (req, res) {
    // #swagger.tags = ['Users']
    // #swagger.description = "Returns credetials of the logged in user"
    // #swagger.produces = ['application/json']
    
    const response = await getOneUser(req.user?.id);
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


router.put("/user/update", jsonParser, isAuth, userUpdateValidator, async function (req, res) {
    // #swagger.tags = ['Users']
        // #swagger.description = "Change/updates credentials for a specific user. Only user!"
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which must contain at least one of the following credentials:
     newFirstName, newLastName, newEmail, newUserName, newPhoneNumber, newAddress, newPassword",
    "required": "true",
    "schema": {
        $ref: "#/definitions/UpdateUser"
        }
    }
    */
  
    const {newFirstName, newLastName, newEmail, newUserName, newPhoneNumber, newAddress, newPassword} = req.body;

    try {
        if (newEmail){
            const emailIsUsed = await userService.getOneByEmail(newEmail);
            
            if (emailIsUsed != null) {
                return res.status(400).jsend.fail({
                    message: "Provided email is already in use.",
                    statusCode: 400,
                })
            }
        }

        if (newUserName){
            const usernameIsUsed = await userService.getOneByUsername(newUserName);
            if (usernameIsUsed != null) {
                return res.status(400).jsend.fail({
                    message: "Provided username is already in use.",
                    statusCode: 400,
                })
            }
        }
        
        let newSalt;
        let newHashedPassword;
        if (newPassword) {
            newSalt = crypto.randomBytes(16);
            newHashedPassword = crypto.pbkdf2Sync(
                newPassword,
                newSalt,
                310000,
                32,
                "sha256"
            );
        }
        
        const result = await userService.updateUserCredentails(
            req.user?.id,
            newFirstName,
            newLastName,
            newEmail,
            newUserName,
            newPhoneNumber,
            newAddress,
            newHashedPassword,
            newSalt,
        );

        if (result[0] === 1) {
            return res.status(200).jsend.success({
                result: "User updated successfully",
                statusCode: 200,
            });
        } else {
            return res.status(400).jsend.fail({
                message:
                    "Could not update user. Check your provided information (New values should not be the same current field's value).",
                statusCode: 400,
            });
        }
    } catch (error) {
        return res.status(500).jsend.error({
            message: error?.message,
            statusCode: 500,
        })
    }
  })


router.delete("/user/delete", isAuth, async function(req, res) {
    // #swagger.tags = ['Users']
    // #swagger.description = "Deletes a specific user. Only user"
    // #swagger.produces = ['application/json']
    const userId = req.user?.id;
    const response = await deleteUser(userId);
    
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
})




// only admin

router.get("/admin/allUsers", isAdmin, async function(req, res) {
    // #swagger.tags = ['Users-Admin']
    // #swagger.description = "Returns all users. Only admin has access."
    // #swagger.produces = ['application/json']
    const response = await getAllUsers();

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
})



router.get("/admin/allUsers/deleted", isAdmin, async function(req, res) {
    // #swagger.tags = ['Users-Admin']
    // #swagger.description = "Returns all deleted users. Only admin has access."
    // #swagger.produces = ['application/json']
    const response = await getAllDeleted();

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
})



router.get("/admin/user/:id", isAdmin, async function(req, res) {
    // #swagger.tags = ['Users-Admin']
    // #swagger.description = "Returns only one user. The returned user can be an admin or a user. Only admin has access."
    // #swagger.produces = ['application/json']
    const userId = req.params?.id
    const response = await getOneUserByAdmin(userId);

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
}),



router.put("/admin/updateAdmin", jsonParser, isAdmin, userUpdateValidator, async function (req, res) {
    // #swagger.tags = ['Users-Admin']
        // #swagger.description = "Change/updates credentials for admin. Only admin!"
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which must contain at least one of the following credentials:
     newFirstName, newLastName, newEmail, newUserName, newPhoneNumber, newAddress, newPassword",
    "required": "true",
    "schema": {
        $ref: "#/definitions/UpdateAdmin"
        }
    }
    */
    const {newFirstName, newLastName, newEmail, newUserName, newPhoneNumber, newAddress, newPassword} = req.body;
    

    try {
        if (newEmail){
            const emailIsUsed = await userService.getOneByEmail(newEmail);
            
            if (emailIsUsed != null) {
                return res.status(400).jsend.fail({
                    message: "Provided email is already in use.",
                    statusCode: 400,
                })
            }
        }

        if (newUserName){
            const usernameIsUsed = await userService.getOneByUsername(newUserName);
            if (usernameIsUsed != null) {
                return res.status(400).jsend.fail({
                    message: "Provided username is already in use.",
                    statusCode: 400,
                })
            }
        }
        
        let newSalt;
        let newHashedPassword;
        if (newPassword) {
            newSalt = crypto.randomBytes(16);
            newHashedPassword = crypto.pbkdf2Sync(
                newPassword,
                newSalt,
                310000,
                32,
                "sha256"
            );
        }
        
        const result = await userService.updateUserCredentails(
            req.user?.id,
            newFirstName,
            newLastName,
            newEmail,
            newUserName,
            newPhoneNumber,
            newAddress,
            newHashedPassword,
            newSalt,
        );

        if (result[0] === 1) {
            return res.status(200).jsend.success({
                result: "User updated successfully",
                statusCode: 200,
            });
        } else {
            return res.status(400).jsend.fail({
                message:
                    "Could not update user. Check your provided information (New values should not be the same current field's value).",
                statusCode: 400,
            });
        }
    } catch (error) {
        return res.status(500).jsend.error({
            message: error?.message,
            statusCode: 500,
        })
    }
  })



router.put("/admin/updateRole/:id", isAdmin, checkFieldValidator("roleName"), async function(req, res) {
    // #swagger.tags = ['Users-Admin']
        // #swagger.description = "Change/updates role of a specific user for provided id in the url path. Only admin!"
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which must contain a roleName field.",
    "required": "true",
    "schema": {
        $ref: "#/definitions/UpdateUserRole"
        }
    }
    */
    const userId = req.params?.id
    const { roleName } = req.body;
    const response = await updateRoleUser(userId, roleName);

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
})





module.exports = router;
