var db = require("../../models");
var MembershipService = require("../../services/MembershipService");
var membershipService = new MembershipService(db);
var UserService = require("../../services/UserService");
var userService = new UserService(db);

module.exports = {
    getAllMemberships: async function () {
        try {
            const memberships = await membershipService.getAll();
            return {
                result: memberships,
                statusCode: 200,
            };
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },

    getOneMembership: async function (membershipId) {
        try {
            const membership = await membershipService.getOneById(
                membershipId
            );

            if (membership instanceof db.Membership) {
                if (membership.isDeleted) {
                    return {
                        message: "membership is flagged as deleted. Recreate it if you want to restore it.",
                        statusCode: 400
                    }
                }
                return {
                    result: membership,
                    statusCode: 200,
                };
            } else {
                return {
                    message:
                        "Does not exist!!. Check if membership has been deleted!",
                    statusCode: 400,
                };
            }
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },

    createMembership: async function (membershipName, discount) {
        try {
            const isExist = await membershipService.getOneByName(
                membershipName
            );
            if (isExist instanceof db.Membership) {
                if (isExist.isDeleted) {
                    isExist.isDeleted = false;
                    isExist.discount = discount;
                    await isExist.save();
                    return {
                        result: "You created a memebership.",
                        statusCode: 200,
                    };
                }
                return {
                    message: "This membership name already exists",
                    statusCode: 400,
                };
            }

            const result = await membershipService.createMembership(
                membershipName,
                discount
            );
            if (result instanceof db.Membership) {
                return {
                    result: "You created an membership.",
                    statusCode: 200,
                };
            } else {
                return {
                    message: result?.message || "An error occured!",
                    statusCode: 400,
                };
            }
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },

    updateMembership: async function (membershipId, newName, newDiscount) {
        try {
            const membership = await membershipService.getOneById(membershipId);
            if (!(membership instanceof db.Membership)) {
                return {
                    message: `Not found Membership for id ${membershipId}`,
                    statusCode: 400,
                };
            } else if (membership.isDeleted) {
                return {
                    message: `Membership for id ${membershipId} is Deleted. must be created again if you want to restore it.`,
                    statusCode: 400,
                };
            }

            if (
                membership.membershipName.toLowerCase() !==
                newName.toLowerCase()
            ) {
                const ifExists = await membershipService.getOneByName(newName);
                if (ifExists instanceof db.Membership) {
                    return {
                        message: `There is already a membership with name ${newName}. Duplicate name is not allowed!`,
                        statusCode: 400,
                    };
                }
            }
            const result = await membershipService.updateMembership(
                newName,
                newDiscount,
                membershipId
            );
            if (result[0] === 1) {
                return {
                    result: "membership updated successfully!",
                    statusCode: 200,
                };
            } else {
                return {
                    message:
                        "Could not updated. Check your provided information. New values should not be the same current field's values.",
                    statusCode: 400,
                };
            }
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },

    deleteMembership: async function (membershipId) {
        try {
            // check if a membership is assigned to a user
            const assigendUser = await userService.getOneByMembershipId(
                membershipId
            );
            if (!(assigendUser instanceof db.User)) {
                const membership = await membershipService.getOneById(
                    membershipId
                );

                if (!(membership instanceof db.Membership)) {
                    return {
                        message: `Not found a membership for id ${membershipId}`,
                        statusCode: 400,
                    };
                }
                if (membership.isDeleted) {
                    return {
                        message: "This membership has already been deleted",
                        statusCode: 400,
                    };
                } else {
                    membership.isDeleted = true;
                    await membership.save();
                }
                return {
                    result: "Membership deleted successfully!",
                    statusCode: 200,
                };
            } else {
                return {
                    message:
                        "Could not deleted. This membership is assigned to a user!!",
                    statusCode: 400,
                };
            }
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },
};
