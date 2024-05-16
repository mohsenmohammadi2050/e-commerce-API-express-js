var express = require("express");
var router = express.Router();
var jsend = require("jsend");
var jwt = require("jsonwebtoken");
var db = require("../models");
var UserService = require("../services/UserService");
var userService = new UserService(db);
var RoleService = require("../services/RoleService");
var roleService = new RoleService(db);
var MembershipService = require("../services/MembershipService");
var membershipService = new MembershipService(db);
var crypto = require("crypto");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var emailPasswordValidator = require("../middlewares/validators/emailPasswordValidator");
var credentialValidator = require("../middlewares/validators/credentialValidator");
router.use(jsend.middleware);




// only admin
router.post(
    "/admin/login",
    jsonParser,
    emailPasswordValidator,
    async (req, res, next) => {
        // #swagger.tags = ['Auth-Admin']
        // #swagger.description = "Login in to account. It will return a token, admin's id and admin's username"
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which contains email and password, required to log in",
    "required": "true",
    "schema": {
      $ref: "#/definitions/LoginAdmin"
        }
    }
    */
        const { email, password } = req.body;

        await userService
            .getOneByEmail(email)
            .then(async (user) => {
                if (user == null) {
                    return res.status(400).jsend.fail({
                        message: "Incorrect email or password",
                        statusCode: 400,
                    });
                } 
                if (user?.RoleId != 1) {
                    return res.status(400).jsend.fail({
                        message: "Only admin can login",
                        statusCode: 400,
                    });
                }
                if (user.isDeleted) {
                    return { message: "This user is flagged as deleted", statusCode: 400}
                }

                crypto.pbkdf2(
                    password,
                    user.salt,
                    310000,
                    32,
                    "sha256",
                    (err, hashedPassword) => {
                        if (err) {
                            return res.status(500).jsend.error({
                                message: err?.message,
                                statusCode: 500,
                            });
                        }
                        if (
                            !crypto.timingSafeEqual(
                                user.encryptedPassword,
                                hashedPassword
                            )
                        ) {
                            return res.status(400).jsend.fail({
                                message: "Incorrect email or password",
                                statusCode: 400,
                            });
                        }
                        let token;
                        try {
                            token = jwt.sign(
                                {
                                    id: user.id,
                                    username: user.username,
                                },
                                process.env.TOKEN_SECRET,
                                { expiresIn: "2h" }
                            );
                        } catch (error) {
                            return res.status(500).jsend.error({
                                message: error?.message,
                                statusCode: 500,
                            });
                        }
                        return res.status(200).jsend.success({
                            result: "You are logged in",
                            id: user.id,
                            username: user.username,
                            token: token,
                            statusCode: 200,
                        });
                    }
                );
            })
            .catch((err) => {
                return res
                    .status(500)
                    .jsend.error({ message: err?.message, statusCode: 500 });
            });
    }
);


// only user

router.post(
    "/login",
    jsonParser,
    emailPasswordValidator,
    async (req, res, next) => {
        // #swagger.tags = ['Auth-User']
        // #swagger.description = "Login in to account. It will return a token, user's id and user's username"
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which contains email and password, required to log in",
    "required": "true",
    "schema": {
      $ref: "#/definitions/LoginUser"
        }
    }
    */
        const { email, password } = req.body;

        await userService
        .getOneByEmail(email)
        .then((user) => {
            if (user == null) {
                return res.status(400).jsend.fail({
                    message: "Incorrect email or password",
                    statusCode: 400,
                })
            }
            if (user?.RoleId != 2) {
                return res.status(400).jsend.fail({
                    message: "Only user can login",
                    statusCode: 400,
                });
            }

            if (user.isDeleted) {
                return res.status(400).jsend.fail({ message: "This user is flagged as deleted", statusCode: 400})
            }

            crypto.pbkdf2(
                password,
                user.salt,
                310000,
                32,
                "sha256",
                (err, hashedPassword) => {
                    if (err) {
                        return res.status(500).jsend.error({
                            message: err?.message,
                            statusCode: 500,
                        })
                    }
                    if (
                        !crypto.timingSafeEqual(
                            user.encryptedPassword,
                            hashedPassword
                        )
                    ) {
                        return res.status(400).jsend.fail({
                            message: "Incorrect email or password",
                            statusCode: 400,
                        })
                    }
                    let token;
                    try {
                        token = jwt.sign(
                            {
                                id: user.id,
                                username: user.username,
                            },
                            process.env.TOKEN_SECRET,
                            { expiresIn: "2h" }
                        );
                    } catch (error) {
                        return res.status(500).jsend.error({
                            message: error?.message,
                            statusCode: 500,
                        })
                    }
                    return res.status(200).jsend.success({
                        result: "You are logged in",
                        id: user.id,
                        username: user.username,
                        token: token,
                        statusCode: 200,
                    })
                }
            );
        })
        .catch((err) => {
            return res.status(500).jsend.error({ message: err?.message, statusCode: 500 })
        });
    }
);

// Post for new users to register / signup
router.post(
    "/register",
    jsonParser,
    credentialValidator,
    async (req, res, next) => {
        // #swagger.tags = ['Auth-User']
        // #swagger.description = "Sign up user"
        // #swagger.produces = ['application/json']
        /* #swagger.parameters['body'] =  {
    "in": "body",
    "description": "An object which contains credentials such as fristName, lastName, username, email, password, address and phoneNumber, required to sign up",
    "required": "true",
    "schema": {
        $ref: "#/definitions/SignupUser"
        }
    }
    */
        const {
            firstName,
            lastName,
            username,
            email,
            password,
            address,
            phoneNumber,
        } = req.body;


        try {

            // if user wants to create a new account with the same username and email
            const userExists = await userService.getOneByEmailUsername(email, username);
            if (userExists instanceof db.User) {
                return res.status(400).jsend.fail({
                    message: "There is already a user with these email and useraname. A link is sent to your email to restore your account. Please follow the link for restoring process.",
                    statusCode: 400,
                })
            }

            const emailIsUsed = await userService.getOneByEmail(email);
            
            if (emailIsUsed != null) {
                return res.status(400).jsend.fail({
                    message: "Provided email is already in use.",
                    statusCode: 400,
                })
            }

            const usernameIsUsed = await userService.getOneByUsername(username);
            if (usernameIsUsed != null) {
                return res.status(400).jsend.fail({
                    message: "Provided username is already in use.",
                    statusCode: 400,
                })
            }

            let membershipId;
            let roleId;
            const membershipBronze = await membershipService.getOneNotDeletedById(1);

            if (membershipBronze instanceof db.Membership) {
                membershipId = membershipBronze.id;
            } else {
                return res.status(500).jsend.error({
                    message:
                        "Error from server. Could not find data for user's membership!. Check if membership data exist in database",
                    statusCode: 500,
                })
            }

            const roleUser = await roleService.getOneNotDeletedById(2);

            if (roleUser instanceof db.Role) {
                roleId = roleUser.id;
            } else {
                return res.status(500).jsend.error({
                    message:
                        "Error from server. Could not find data for user's role!. Check if role data exist",
                    statusCode: 500,
                })
            }
            
            const salt = crypto.randomBytes(16);
            crypto.pbkdf2(
                password,
                salt,
                310000,
                32,
                "sha256",
                async (err, hashedPassword) => {
                    if (err) {
                        return res.status(500).jsend.error({
                            message: err?.message,
                            statusCode: 500,
                        })
                    }
                    
                    const result = await userService.createUser(
                        firstName,
                        lastName,
                        username,
                        email,
                        hashedPassword,
                        salt,
                        address,
                        phoneNumber,
                        membershipId,
                        roleId
                    );

                    
                    if (result instanceof db.User) {
                        return res.status(200).jsend.success({
                            result: "You created an account.",
                            statusCode: 200,
                        })
                    } else {
                        return res.status(400).jsend.fail({
                            message: result.errors[0].message,
                            statusCode: 400,
                        })
                    }
                }
            );
        } catch (error) {
            return res.status(500).jsend.error({
                message: error?.message,
                statusCode: 500,
            })
        }
    }
);

module.exports = router;
