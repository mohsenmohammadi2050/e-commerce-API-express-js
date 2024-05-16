const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");

class ProductService {
    constructor(db) {
        this.client = db.sequelize;
        this.Category = db.Category;
        this.Brand = db.Brand;
        this.Product = db.Product;
    }

    async createProduct(
        name,
        imgUrl,
        description,
        price,
        countInStock,
        brandId,
        categoryId
    ) {
        return this.Product.create({
            name,
            imgUrl,
            description,
            price,
            countInStock,
            BrandId: brandId,
            CategoryId: categoryId,
        }).catch(function (error) {
            return error;
        });
    }

    async getAll() {
        return await this.Product.findAll({
            where: {},
            include: [
                {
                    model: this.Category,
                },
                {
                    model: this.Brand,
                },
            ],
        }).catch(function (error) {
            return error;
        });
    }

    async getAllByName(name) {
        return await this.Product.findAll({
            where: {
                name,
            },
            include: [
                {
                    model: this.Category,
                },
                {
                    model: this.Brand,
                },
            ],
        }).catch(function (error) {
            return error;
        });
    }

    async getOneById(productId) {
        return await this.Product.findOne({
            where: {
                id: productId,
            },
            include: [
                {
                    model: this.Category,
                },
                {
                    model: this.Brand,
                },
            ],
        }).catch(function (error) {
            return error;
        });
    }

    async getOneNotDeleted(productId) {
        return await this.Product.findOne({
            where: {
                id: productId,
                isDeleted: false,
            },
            include: [
                {
                    model: this.Category,
                },
                {
                    model: this.Brand,
                },
            ],
        }).catch(function (error) {
            return error;
        });
    }

    async getBrandCategory(brandId, categoryId) {
        let query = `SELECT brands.brandName, categories.categoryName From brands Join categories On brands.id=${brandId} And categories.id=${categoryId}`;
        
        let result = await this.client.query(query, {
            type: QueryTypes.SELECT,
        });

        return result[0];
    }


    async getOneByBrandId(brandId) {
        return await this.Product.findOne({
            where: {
                BrandId: brandId,
            },
        }).catch(function (error) {
            return error;
        });
    }

    async getOneByCategoryId(categoryId) {
        return await this.Product.findOne({
            where: {
                CategoryId: categoryId,
            },
        }).catch(function (error) {
            return error;
        });
    }

    async checkIfExists(
        name,
    ) {
        return await this.Product.findOne({
            where: {
                name: name,
            },
        }).catch(function (error) {
            return error;
        });
    }

    async checkIfProductDeleted(productId) {
        return await this.Product.findOne({
            where: {
                id: productId,
                isDeleted: true,
            },
        }).catch((error) => {
            return error;
        });
    }

    async updateProduct(
        productId,
        newName,
        newImgUrl,
        newDescription,
        newPrice,
        newCountInStock,
        newBrandId,
        newCategoryId
    ) {

    
    const arrayOfFeilds = [newName, newImgUrl, newDescription, newPrice, newCountInStock, newBrandId, newCategoryId];
    const keys = ["name", "imgUrl", "description", "price", "countInStock", "BrandId", "CategoryId"]
        let objectOfFields = {};
        arrayOfFeilds.forEach((element,index) => {
            if (element || element == 0){
                objectOfFields[keys[index]] = element
            }
        });
        console.log(objectOfFields)

        return this.Product.update(
            objectOfFields,
            {
                where: {
                    id: productId,
                },
            }
        ).catch((error) => {
            return error;
        });
    }

    async deleteProduct(productId) {
        return await this.Product.update(
            {
                isDeleted: true,
            },
            {
                where: {
                    id: productId,
                },
            }
        ).catch((error) => {
            return error;
        });
    }
}
module.exports = ProductService;
