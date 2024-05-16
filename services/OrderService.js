const { Op } = require("sequelize");

class OrderService{
    constructor(db){
        this.client = db.sequelize;
        this.Order = db.Order;
        this.Status = db.Status
        this.Item = db.Item
        this.Product = db.Product
        this.User = db.User
    }


    // a utils method to find desired status

    async findStatus(statusId) {
        let status;
        try {
            status = await this.Status.findOne({
                where: {
                    id: statusId,
                    isDeleted: false
                },
            })
        } catch (error) {
            return error;
        }

        return status;
    }

    // user only

    async checkOut(cartId) {
        let statusInProgress = await this.findStatus(2)
    
        if (!(statusInProgress instanceof this.Status)) {
            throw new Error("Not found status in-progress in database");
        }

       
        return await this.Order.update({
            StatusId: statusInProgress.id
        }, {
            where: {
                id: cartId
            }
        })
    }


    async stopCheckOut(cartId) {
        let statusNotcheckout = await this.findStatus(1)
    
        if (!(statusNotcheckout instanceof this.Status)) {
            throw new Error("Not found status in-progress in database");
        }

        return await this.Order.update({
            StatusId: statusNotcheckout.id
        }, {
            where: {
                id: cartId
            }
        })
    }


    async checkIfCartExist(cartId, userId) {
        let statusNotcheckout = await this.findStatus(1)

        if (!( statusNotcheckout instanceof this.Status)) {
            throw new Error("Not found status not-checout in database");
        }

        return await this.Order.findOne({
            where: {
                id: cartId,
                UserId: userId,
                StatusId: statusNotcheckout.id,
                isDeleted: false,
            }, 
            include: {
                model : this.Item
            }
        }).catch(error => {
            return error
        }) 
    }



    async checkIfCartIsEmpty(cartId) {
        return await this.Item.findOne({
            where: {
                OrderId: cartId,
                isDeleted: false,
                isPurchased: false
            },
        }).catch(error => {
            return error
        }) 
    }



    async getAllUserOrders (userId) {
        let statusNotcheckout = await this.findStatus(1)
        if (!( statusNotcheckout instanceof this.Status)) {
            throw new Error("Not found status not-checout in database");
        }
        return await this.Order.findAll({
            where: {
                UserId: userId,
                StatusId: {
                    [Op.ne]: statusNotcheckout.id
                },
            }, 
            include: [{
                model : this.Item
            },
            {
                model : this.Status
            }
        ]
        }).catch(error => {
            return error
        })
    }


    async getNotCompletedOrder(userId) {
        let statusNotcheckout = await this.findStatus(1)
        if (!( statusNotcheckout instanceof this.Status)) {
            throw new Error("Not found status not-checkout in database");
        }
        let statusCompleted = await this.findStatus(4)
        if (!( statusCompleted instanceof this.Status)) {
            throw new Error("Not found status compeleted in database");
        }
        return await this.Order.findOne({
            where: {
                UserId: userId,
                StatusId: {
                    [Op.notIn]: [statusNotcheckout.id, statusCompleted.id]
                },
                isDeleted: false 
            }, 
            include: [{
                model : this.Item
            },
            {
                model : this.Status
            }
        ]
        }).catch(error => {
            return error
        })
    }



    async getOneUserOrder(orderId, userId) {
        return await this.Order.findOne({
            where: {
                id: orderId,
                UserId: userId,
            },
            include: [{
                model : this.Item
            },
            {
                model : this.Status
            }
        ]
        }).catch(error => {
            return error
        })
    }


    async getOneByStatusId(statusId) {
        return await this.Order.findOne({
          where: {
            StatusId: statusId
          }
        }).catch(function (error){
          return error
        });
      }


    // admin

    async getAllOrders () {
        let statusNotcheckout = await this.findStatus(1)
        if (!( statusNotcheckout instanceof this.Status)) {
            throw new Error("Can not create cart. Not found status data in database");
        }
        return await this.Order.findAll({
            where: {
                StatusId: {
                    [Op.ne]: statusNotcheckout.id
                },
            }, 
            include: [{
                model : this.Item
            },
            {
                model : this.Status
            },
            {
                model: this.User
            }
        ]
        }).catch(error => {
            return error
        })
    }


    async getOneNotDeleted(orderId) {
        let statusNotcheckout = await this.findStatus(1)
        if (!( statusNotcheckout instanceof this.Status)) {
            throw new Error("Not found status 'Not-checkout' in database");
        }
        return await this.Order.findOne({
            where: {
                id: orderId,
                StatusId: {
                    [Op.ne]: statusNotcheckout.id
                },
                isDeleted: false
            },
        }).catch(error => {
            return error
        }) 
    }



    async updateOrderStatus(orderId, statusId) {
        return await this.Order.update({
            StatusId: statusId
        }, {
            where: {
                id: orderId
            }
        })
    }

    








}


module.exports = OrderService;