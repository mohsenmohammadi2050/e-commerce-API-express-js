var db = require("../../models");
var RoleService = require("../../services/RoleService");
var roleService = new RoleService(db);
var UserService = require("../../services/UserService");
var userService = new UserService(db);


module.exports = {
    getAllRoles: async function() {
        try {
            const roles = await roleService.getAll();
    
            return {
                result: roles,
                statusCode: 200,
            }
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            }
        }
    },


    getOneRole: async function(roleId) {
        try {
            const role = await roleService.getOneById(roleId);
            
            if (role instanceof db.Role) {
                if (role.isDeleted) {
                    return {
                        message: "Role is flagged as deleted!. Recreate it if you want to restore it.",
                        statusCode: 400
                    }
                }
                return {
                    result: role,
                    statusCode: 200,
                }
            } else {
                return {
                    message: "Does not exist!!",
                    statusCode: 400,
                }
            }
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            }
        }
    },


    createRole: async function(roleName) {
        try {
            const isExist = await roleService.getOneByName(roleName);
            if (isExist instanceof db.Role) {
                if (isExist.isDeleted){
                    isExist.isDeleted = false;
                    await isExist.save()
                    return {result: "You created a role.", statusCode: 200}
                }
                return {
                    message: "This role name already exists",
                    statusCode: 400,
                }
            }

            const result = await roleService.createRole(roleName);
            if (result instanceof db.Role) {
                return {
                    result: "You created a role.",
                    statusCode: 200,
                }
            } else {
                return {
                    message: result?.message || "An error occured!",
                    statusCode: 400,
                }
            }
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            }
        }
    },


    updateRole: async function(roleId, newName) {
        try {
            const role = await roleService.getOneById(roleId);
            if (!(role instanceof db.Role)) {
                return {
                    message: `Not found role for id ${roleId}.`,
                    statusCode: 400,
                }
            } else if (role.isDeleted) {
                return {
                    message: `Role for id ${roleId} is Deleted. Restore it by recreating it.`,
                    statusCode: 400,
                }
            }

            const ifExists = await roleService.getOneByName(newName);
            if (ifExists instanceof db.Role) {
                return {
                    message: `There is already a role with name ${newName}. Duplicate name is not allowed!`,
                    statusCode: 400,
                }
            }


            const result = await roleService.updateRole(newName, roleId);
            if (result[0] === 1) {
                return {
                    result: "role updated successfully!",
                    statusCode: 200,
                }
            } else {
                return {
                    message:
                        "Could not updated. Check your provided information (New Name should not be the same current name).",
                    statusCode: 400,
                }
            }
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            }
        }
    },


    deleteRole: async function(roleId) {
        try {
            // check if a role is assigned to a user
            const assigendUser = await userService.getOneByRoleId(roleId);
            if (!(assigendUser instanceof db.User)) {
                const role = await roleService.getOneById(roleId);
    
                if (!(role instanceof db.Role)) {
                    return {
                        message: `Not found a role for id ${roleId}`,
                        statusCode: 400,
                    }
                }
    
                if (role.isDeleted) {
                    return { message: "This role has already been deleted", statusCode: 400}
                }else {
                    role.isDeleted = true;
                    await role.save()
                }
                return { result: "role deleted successfully!", statusCode: 200}
    
            } else {
                return {
                    message: "Could not deleted. This role is assigned to a user!!",
                    statusCode: 400,
                }
            }
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            }
        }
    }
}