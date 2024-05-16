var db = require("../../models");
var ProductService = require("../../services/ProductService");
var productService = new ProductService(db);
var CategoryService = require("../../services/CategoryService");
var categoryService = new CategoryService(db);
var BrandSerivce = require("../../services/BrandService");
var brandSerivce = new BrandSerivce(db);
var ItemService = require("../../services/ItemService");
var itemService = new ItemService(db);
var MembershipService = require("../../services/MembershipService");
var membershipService = new MembershipService(db);
var UserService = require("../../services/UserService");
var userService = new UserService(db);

module.exports = {
    getAllProducts: async function () {
        try {
            const products = await productService.getAll();
            const listOfProducts = await Promise.all(
                products.map(async (product) => {
                    // this method use raw sql query
                    let response =
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
                        brandName: response?.brandName || "Not found",
                        categoryName: response?.categoryName || "Not found",
                        createdAt: product.createdAt,
                        updatedAt: product.updatedAt,
                    };
                })
            );

            return {
                result: listOfProducts,
                statusCode: 200,
            };
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },

    getOneProduct: async function (productId) {
        try {
            const product = await productService.getOneById(productId);
            if (product instanceof db.Product) {
                const formmatedProduct = {
                    name: product.name,
                    imgUrl: product.imgUrl,
                    description: product.description,
                    price: product.price,
                    countInStock: product.countInStock,
                    isDeleted: product.isDeleted,
                    brandName: product.Brand.brandName,
                    categoryName: product.Category.categoryName,
                };
                return {
                    result: formmatedProduct,
                    statusCode: 200,
                };
            } else {
                return {
                    message: "Does not exist!!",
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

    createProduct: async function (
        name,
        imgUrl,
        description,
        price,
        countInStock,
        brandName,
        categoryName
    ) {
        let category;
        let brand;
        try {
            category = await categoryService.getOneByName(categoryName);
            if (category === null) {
                return {
                    message: `There is no ${categoryName} category`,
                    statusCode: 400,
                };
            }
            brand = await brandSerivce.getOneByName(brandName);
            if (brand === null) {
                return {
                    message: `There is no ${brandName} brand`,
                    statusCode: 400,
                };
            }
        } catch (error) {
            return { message: error.message, statusCode: 500 };
        }

        try {
            const isExist = await productService.checkIfExists(
                name
            );
            if (isExist) {
                return {
                    message: "There is a porduct with the same name. Duplicate names are not allowed.",
                    statusCode: 400,
                };
            }

            const result = await productService.createProduct(
                name,
                imgUrl,
                description,
                price,
                countInStock,
                brand.id,
                category.id
            );
            
            if (result instanceof db.Product) {
                return {
                    result: "You created a product.",
                    statusCode: 200,
                };
            } else {
                return {
                    message: result?.message || "An error occured! Check your provided data!",
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

     

    updateProduct: async (
        newName,
        newImgUrl,
        newDescription,
        newPrice,
        newCountInStock,
        newBrandName,
        newCategoryName,
        productId
    ) => {
        let brand;
        let category;
        let product;

        try {
            // check if product exists for productId
            product = await productService.getOneById(productId);
            if (!(product instanceof db.Product)) {
                return {
                    message: `Could not find a product for id ${productId}`,
                    statusCode: 400,
                };
            }

            // check if a brand exists for new brand name
            if(newBrandName){
                brand = await brandSerivce.getOneByName(newBrandName);
                if (!(brand instanceof db.Brand)) {
                    return {
                        message: `There is no brand called ${newBrandName}`,
                        statusCode: 400,
                    };
                }
            }

            // check if there is a category for new category name
            if (newCategoryName){
                category = await categoryService.getOneByName(newCategoryName);
                if (!(category instanceof db.Category)) {
                    return {
                        message: `There is no category called ${newCategoryName}`,
                        statusCode: 400,
                    };
                }
            }
        } catch (error) {
            return { message: error?.message, statusCode: 500 };
        }

        try {
            if (newName) {
                if (product.name?.toLowerCase() !== newName?.toLowerCase()){
                    const isExist = await productService.checkIfExists(
                        newName
                    );
                    if (isExist) {
                        return {
                            message: "There is another product with the same name. Duplicate names are not allowed",
                            statusCode: 400,
                        };
                    }
                }
            }
            const result = await productService.updateProduct(
                productId,
                newName,
                newImgUrl,
                newDescription,
                newPrice,
                newCountInStock,
                brand?.id,
                category?.id
            );
            

            if (result[0] == 1) {
                return {
                    result: "Product updated successfully",
                    statusCode: 200,
                };
            } else {
                return {
                    message:
                        "Could not update product. Check your provided information (New values should not be the same current field's value).",
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

    updateItemsPrice: async (productId, newPrice) => {
        
        try {
            const allAvailableItems =
                await itemService.getAllAvailableByProductId(productId);

            for (const item of allAvailableItems) {
                const userId = item.Order.UserId;
                const user = await userService.getOneById(userId);
                const userMembership =
                    await membershipService.getOneNotDeletedById(
                        user.MembershipId
                    );
                const membershipDiscount = userMembership.discount;
                const unitPrice = Math.round(
                    newPrice - newPrice * (membershipDiscount / 100)
                );
                item.unitPrice = unitPrice;
                await item.save();
            }

            return { result: true, statusCode: 200 };
        } catch (error) {
            return { message: error?.message, statusCode: 500 };
        }
    },



    restoreProduct: async function (productId) {
        try {
            const product = await productService.getOneById(productId);
            if (!(product instanceof db.Product)) {
                return {
                    message: `Could not find product with id ${productId}.`,
                    statusCode: 400,
                };
            }


            if (product.isDeleted) {
                product.isDeleted = false;
                await product.save()
                return {
                    result: "Product is restored now!",
                    statusCode: 200
                }
            }else {
                return {
                    message: "Product already exists",
                    statusCode: 400
                }
            }
        } catch (error) {
            return { message: error?.message, statusCode: 500 };
        }
    },
    

    deleteProduct: async function (productId) {
        try {
            const product = await productService.getOneById(productId);
            if (!(product instanceof db.Product)) {
                return {
                    message: `Could not find product with id ${productId}.`,
                    statusCode: 400,
                };
            }

            if (product.isDeleted) {
                return {
                    message: `Product already is deleted!`,
                    statusCode: 400,
                };
            }

            const itemExis = await itemService.getOneAvailableByProductId(
                productId
            );
            if (itemExis) {
                return {
                    message:
                        "This product is assigned to a cart. Can not be deleted.",
                    statusCode: 400,
                };
            }

            product.isDeleted = true;
            await product.save();

            return {
                result: "Product deleted successfully",
                statusCode: 200,
            };
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },
};
