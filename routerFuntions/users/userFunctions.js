var express = require("express");
var router = express.Router();

var db = require("../../models");
var UserService = require("../../services/UserService");
var userService = new UserService(db);
var OrderService = require("../../services/OrderService");
var orderService = new OrderService(db);
var CartService = require("../../services/CartService");
var cartService = new CartService(db);
var RoleService = require("../../services/RoleService");
var roleService = new RoleService(db);


var emailPasswordValidator = require("../../middlewares/validators/emailPasswordValidator");
var credentialValidator = require("../../middlewares/validators/credentialValidator");

module.exports = {
    getOneUser: async function (userId) {
        try {
            const user = await userService.getOneById(userId);
            if (user instanceof db.User) {
                const formmatedUser = {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    address: user.address,
                    membership: user.Membership.membershipName
                };
                return {
                    result: formmatedUser,
                    statusCode: 200,
                };
            } else {
                return {
                    message: "Does not exist!!",
                    statusCode: 400,
                };
            }
        } catch (error) {
            return { message: error?.message, statusCode: 500 };
        }
    },

    deleteUser: async function (userId) {
        try {
            const user = await userService.getOneById(userId);
            if (!(user instanceof db.User)) {
                return {
                    message: `Could not find user with id ${userId}.`,
                    statusCode: 400,
                };
            }

            const order = await orderService.getNotCompletedOrder(user.id);
          
            if (order instanceof db.Order) {
                return {
                    message:
                        "User has some orders which are under process. Account can not be deleted right now. Contact us!",
                    statusCode: 400,
                };
            }

            const userCart = await cartService.checkIfUserHasCart(user.id);

            if (userCart instanceof db.Order) {
                const cartItems = await cartService.getAllCartItems(
                    userCart.id
                );
                for (const item of cartItems) {
                    item.isDeleted = true;
                    await item.save();
                }
                userCart.isDeleted = true;
                await userCart.save();
            }

            user.isDeleted = true;
            await user.save();

            return {
                result: "User account deleted successfully",
                statusCode: 200,
            };
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },

    // only admin

    getAllUsers: async function () {
        try {
            const users = await userService.getAll();
            const listOfUsers = await Promise.all(
                users.map(async (user) => {
                    return {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                        address: user.address,
                        role: user.Role.roleName,
                        membership: user.Membership.membershipName,
                        isDeleted: user.isDeleted,
                    };
                })
            );

            return {
                result: listOfUsers,
                statusCode: 200,
            };
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },



    getAllDeleted: async function () {
        try {
            const users = await userService.getAllDeleted();
            const listOfUsers = await Promise.all(
                users.map(async (user) => {
                    return {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                        address: user.address,
                        role: user.Role.roleName,
                        membership: user.Membership.membershipName,
                        isDeleted: user.isDeleted,
                    };
                })
            );

            return {
                result: listOfUsers,
                statusCode: 200,
            };
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },


    getOneUserByAdmin: async function (userId) {
        try {
            const user = await userService.getOneById(userId);
            if (user instanceof db.User) {
                const formmatedUser = {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    address: user.address,
                    role: user.Role.roleName,
                    membership: user.Membership.membershipName,
                    isDeleted: user.isDeleted,
                };
                return {
                    result: formmatedUser,
                    statusCode: 200,
                };
            } else {
                return {
                    message: "Does not exist!!",
                    statusCode: 400,
                };
            }
        } catch (error) {
            return { message: error?.message, statusCode: 500 };
        }
    },


    updateRoleUser: async function(userId, roleName) {
        try {
            const role = await roleService.getOneNotDeletedByName(roleName);
            if (!(role instanceof db.Role)) {
                return { message: `Not found any role with this role name: '${roleName}'. Check if role has been deleted`, statusCode: 400}
            } 

            const user = await userService.getOneById(userId);
            if (!(user instanceof db.User)) {
                return { message: `Not found any user with this id: '${userId}'`, statusCode: 400}
            } 
            if (user?.RoleId === role.id) {
                return { message: `User has already role: '${roleName}'`, statusCode: 400}
            }
            if (user?.isDeleted){
                return {message: "This user is deleted. Can not be modified.", statusCode: 400}
            }
            user.RoleId = role.id;
            await user.save()

            return {result: "Role is changed!", statusCode: 200}
        } catch (error) {
            return { message: error?.message, statusCode: 500 };
        }
    }

};
