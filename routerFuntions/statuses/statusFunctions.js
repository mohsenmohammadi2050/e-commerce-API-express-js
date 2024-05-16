var db = require("../../models");
var StatusService = require("../../services/StatusService");
var statusService = new StatusService(db);
var OrderService = require("../../services/OrderService")
var orderService = new OrderService(db) 


module.exports = {
    getAllStauses: async function() {
        try {
            const statuses = await statusService.getAll();
            
            return {
                result: statuses,
                statusCode: 200,
            }
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            }
        }
    },


    getOneStatus: async function(statusId) {
        try {
            const status = await statusService.getOneById(statusId);
    
            if (status instanceof db.Status) {
                if (status.isDeleted) {
                    return {
                        message: "Status is flagged as deleted!. Recreate it if you want to restore it.",
                        statusCode: 400
                    }
                }
                return {
                    result: status,
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


    createStatus: async function(statusName) {
        try {
            const isExist = await statusService.getOneByName(statusName);
            if (isExist instanceof db.Status) {
                if (isExist.isDeleted){
                    isExist.isDeleted = false;
                    await isExist.save()
                    return {result: "You created a status.", statusCode: 200}
                }
                return {
                    message: "This status name already exists",
                    statusCode: 400,
                }
            }

            const result = await statusService.createStatus(statusName);
            if (result instanceof db.Status) {
                return {
                    result: "You created a status.",
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


    updateStatus: async function(statusId, newName){
        try {
            const status = await statusService.getOneById(statusId);
            
            if (!(status instanceof db.Status)) {
                return {
                    message: `Not found status for id ${statusId}`,
                    statusCode: 400,
                }
            }else if (status.isDeleted) {
                return {
                    message: `Status for id ${statusId} is Deleted. must be created again if you want to restore it.`,
                    statusCode: 400,
                }
            }

            const ifExists = await statusService.getOneByName(newName);
            if (ifExists instanceof db.Status) {
                return {
                    message: `There is already a status with name ${newName}. Duplicate name is not allowed!`,
                    statusCode: 400,
                }
            }

            const result = await statusService.updateStatus(newName, statusId);
            if (result[0] === 1) {
                return {
                    result: "Status updated successfully!",
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


    deleteStatus: async function(statusId) {
        try {
            // check if a status is assigned to a order
            const assigendOrder = await orderService.getOneByStatusId(statusId);
            if (!(assigendOrder instanceof db.Order)) {
                const status = await statusService.getOneById(statusId);
    
                if (!(status instanceof db.Status)) {
                    return {
                        message: `Not found a status for id ${statusId}`,
                        statusCode: 400,
                    }
                }
                if (status.isDeleted) {
                    return { message: "This status has already been deleted", statusCode: 400}
                }else {
                    status.isDeleted = true;
                    await status.save()
                }
                return { result: "status deleted successfully!", statusCode: 200}
    
            } else {
                return {
                    message: "Could not deleted. This status is assigned to an order!!",
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