var db = require("../../models")
var SearchService = require("../../services/SearchService")
var searchService = new SearchService(db)
var ProductService  = require("../../services/ProductService")
var productService = new ProductService(db)


module.exports = {

    searchByProductName: async function(productName) {
        try {
            const products = await searchService.byProductName(productName)
            
                const listOfProducts = await Promise.all(
                    products.map(async (product) => {
                        // this method use raw sql query
                        const { brandName, categoryName } =
                            await productService.getBrandCategory(
                                product.BrandId,
                                product.CategoryId
                            );
                        return {
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            imgUrl: product.imgUrl,
                            price: product.price,
                            countInStock: product.countInStock,
                            isDeleted: product.isDeleted,
                            brandName: brandName,
                            categoryName: categoryName,
                            createdAt: product.createdAt,
                            updatedAt: product.updatedAt,
                        };
                    })
                );
                return {result: listOfProducts, statusCode: 200, number: products.length}
            
        } catch (error) {
            return {message: error?.message, statusCode: 500}
        }
    },


    searchByCategoryName: async function(categoryName) {
        try {
            const products = await searchService.byCategoryName(categoryName)
            
                const listOfProducts = await Promise.all(
                    products.map(async (product) => {
                        // this method use raw sql query
                        const { brandName, categoryName } =
                            await productService.getBrandCategory(
                                product.BrandId,
                                product.CategoryId
                            );
                        return {
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            imgUrl: product.imgUrl,
                            price: product.price,
                            countInStock: product.countInStock,
                            isDeleted: product.isDeleted,
                            brandName: brandName,
                            categoryName: categoryName,
                            createdAt: product.createdAt,
                            updatedAt: product.updatedAt,
                        };
                    })
                );
                return {result: listOfProducts, statusCode: 200, number: products.length}
            
        } catch (error) {
            return {message: error?.message, statusCode: 500}
        }
    },


    searchByBrandName: async function(brandName) {
        try {
            const products = await searchService.byBrandName(brandName)
            
                const listOfProducts = await Promise.all(
                    products.map(async (product) => {
                        // this method use raw sql query
                        const { brandName, categoryName } =
                            await productService.getBrandCategory(
                                product.BrandId,
                                product.CategoryId
                            );
                        return {
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            imgUrl: product.imgUrl,
                            price: product.price,
                            countInStock: product.countInStock,
                            isDeleted: product.isDeleted,
                            brandName: brandName,
                            categoryName: categoryName,
                            createdAt: product.createdAt,
                            updatedAt: product.updatedAt,
                        };
                    })
                );
                return {result: listOfProducts, statusCode: 200, number: products.length}
            
        } catch (error) {
            return {message: error?.message, statusCode: 500}
        }
    },


    reset: async function() {
        try {
            const products = await searchService.reset()
            
                const listOfProducts = await Promise.all(
                    products.map(async (product) => {
                        // this method use raw sql query
                        const { brandName, categoryName } =
                            await productService.getBrandCategory(
                                product.BrandId,
                                product.CategoryId
                            );
                        return {
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            imgUrl: product.imgUrl,
                            price: product.price,
                            countInStock: product.countInStock,
                            isDeleted: product.isDeleted,
                            brandName: brandName,
                            categoryName: categoryName,
                            createdAt: product.createdAt,
                            updatedAt: product.updatedAt,
                        };
                    })
                );
                return {result: listOfProducts, statusCode: 200, number: products.length}
            
        } catch (error) {
            return {message: error?.message, statusCode: 500}
        }
    }

}