const { QueryTypes } = require('sequelize');

class ItemService {
    constructor(db) {
        this.client = db.sequelize;
        this.Category = db.Category;
        this.Brand = db.Brand;
        this.Product = db.Product;
        this.Item = db.Item;
        this.Order = db.Order
    }

    async addItem(
        quantity,
        unitPrice,
        orderId,
        productId,
    ) {
        return this.Item.create({
            quantity,
            unitPrice,
            OrderId: orderId,
            ProductId: productId,
        }).catch(function (error) {
            return error;
        });
    }


    async getAll(){
        return await this.Item.findAll({
            where: {},
            include: [
                {
                  model: this.Order,
                },
                {
                    model: this.Product,
                }
              ]
        }).catch(function (error) {
            return error;
        });
    }


    async getAllDeleted(){
        return await this.Item.findAll({
            where: {
                isDeleted: true
            },
            include: [
                {
                  model: this.Order,
                },
                {
                    model: this.Product,
                }
              ]
        }).catch(function (error) {
            return error;
        });
    }


    async getAllPurchased(){
        return await this.Item.findAll({
            where: {
                isPurchased: true
            },
            include: [
                {
                  model: this.Order,
                },
                {
                    model: this.Product,
                }
              ]
        }).catch(function (error) {
            return error;
        });
    }


    async getOneById(itemId){
        return await this.Item.findOne({
            where: {
                id: itemId
            },
            include: [
                {
                  model: this.Order,
                },
                {
                  model: this.Product,
                } 
              ]
        }).catch(function (error) {
            return error;
        });
    }


    async purchaseItem(listIds){
        try {
            let sqlQuery = `Update items Set isPurchased = True where id in (${listIds}) AND isDeleted = False`
            let updatedItems = await this.client.query(
                sqlQuery,
                { type: QueryTypes.UPDATE }
            );
            
            return updatedItems;

        } catch (error) {
            return error
        }
    }

    async stopPurchaseItem(listIds) {
        try {
            let sqlQuery = `Update items Set isPurchased = False where id in (${listIds}) AND isDeleted = False`
            let updatedItems = await this.client.query(
                sqlQuery,
                { type: QueryTypes.UPDATE }
            );
            
            return updatedItems;

        } catch (error) {
            return error
        }
    }


    async getTotalPurchase(listIds){
        try {
            let sqlQuery = `SELECT SUM(quantity) AS totalPurchased FROM items WHERE OrderId IN (${listIds}) AND isPurchased = True;`
            let totalPurchased = await this.client.query(
                sqlQuery,
                { type: QueryTypes.SELECT }
            );
            
            return totalPurchased;

        } catch (error) {
            return error
        }
    }

    
    async getAllAvailableByProductId(productId){
        return await this.Item.findAll({
            where: {
                ProductId: productId,
                isDeleted: false,
                isPurchased: false
            }, 
            include: [
                {
                    model: this.Order
                }
            ]
        }).catch(function (error) {
            return error;
        });
    }


    async getOneAvailableByProductId(productId){
        return await this.Item.findOne({
            where: {
                ProductId: productId,
                isDeleted: false,
                isPurchased: false
            },
            include: [
                {
                    model: this.Order
                }
            ]
        }).catch(function (error) {
            return error;
        });
    } 

    
}
module.exports = ItemService;