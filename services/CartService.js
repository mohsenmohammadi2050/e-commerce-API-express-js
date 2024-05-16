class CartService {
    constructor(db) {
        this.client = db.sequelize;
        this.Order = db.Order;
        this.Status = db.Status;
        this.Item = db.Item;
        this.Product = db.Product;
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

    // create cart for a user. A cart is created once a user wants to choose a product to purchase, but not checked out yet. This means that the status must be 'not-checkout'
    async createCart(orderNumber, userId) {
        const statusNotcheckout = await this.findStatus(1)
        if (!(statusNotcheckout instanceof this.Status)) {
            throw new Error("Can not create cart. Not found a status for Not-checkout");
        }
        return await this.Order.create({
            orderNumber: orderNumber,
            StatusId: statusNotcheckout.id,
            UserId: userId,
        }).catch((error) => {
            return error;
        });
    }

    async checkIfUserHasCart(userId) {
        const statusNotcheckout = await this.findStatus(1)
        if (!(statusNotcheckout instanceof this.Status)) {
            throw new Error("Not found status not-checkout data");
        }

        return await this.Order.findOne({
            where: {
                StatusId: statusNotcheckout.id,
                UserId: userId,
                isDeleted: false
            },
        }).catch((error) => {
            return error;
        });
    }

    async getCartItemByProductId(cartId, productId) {
        return await this.Item.findOne({
            where: {
                ProductId: productId,
                OrderId: cartId,
                isDeleted: false,
                isPurchased: false
            },
        }).catch(function (error) {
            return error;
        });
    }

    async getCartItemByItemId(cartId, itemId) {
        return await this.Item.findOne({
            where: {
                id: itemId,
                OrderId: cartId,
            },
        }).catch(function (error) {
            return error;
        });
    }

    async getOneByOrderNumber(orderNumber) {
        return await this.Order.findOne({
            where: {
                orderNumber: orderNumber,
            },
        }).catch((error) => {
            return error;
        });
    }

    async getAllCartItems(cartId) {
        return await this.Item.findAll({
            where: {
                OrderId: cartId,
                isDeleted: false,
            },
            include: [
                {
                    model: this.Product,
                },
            ],
        }).catch(function (error) {
            return error;
        });
    }

    async getAllDeletedCartItems(cartId) {
        return await this.Item.findAll({
            where: {
                OrderId: cartId,
                isDeleted: true,
            },
            include: [
                {
                    model: this.Product,
                },
            ],
        }).catch(function (error) {
            return error;
        });
    }
}

module.exports = CartService;
