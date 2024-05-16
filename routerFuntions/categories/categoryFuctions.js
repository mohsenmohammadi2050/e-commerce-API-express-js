var db = require("../../models");
var CategoryService = require("../../services/CategoryService");
var categoryService = new CategoryService(db);
var ProductService = require("../../services/ProductService");
var productService = new ProductService(db);

module.exports = {
    getAllCategories: async function () {
        try {
            const categories = await categoryService.getAll();
            return {
                result: categories,
                statusCode: 200,
            };
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },

    getOneCategory: async function (categoryId) {
        try {
            const category = await categoryService.getOneById(categoryId);

            if (category instanceof db.Category) {
                return {
                    result: category,
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

    createCategory: async function (categoryName) {
        try {
            const isExist = await categoryService.getOneByName(categoryName);
            if (isExist instanceof db.Category) {
                return {
                    message: "This category name already exists",
                    statusCode: 400,
                };
            }

            const result = await categoryService.createCategory(categoryName);
            if (result instanceof db.Category) {
                return {
                    result: "You created a category.",
                    statusCode: 200,
                };
            } else {
                return {
                    message:
                        result?.message ||
                        "An error occured! Check if you provided correct data",
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

    updateCategory: async function (categoryId, newName) {
        try {
            const category = await categoryService.getOneById(categoryId);
            if (!(category instanceof db.Category)) {
                return {
                    message: `Not found a category for id ${categoryId}`,
                    statusCode: 400,
                };
            }

            const ifExists = await categoryService.getOneByName(newName);
            if (ifExists instanceof db.Category) {
                return {
                    message: `There is already a category with name ${newName}. Duplicate name is not allowed!`,
                    statusCode: 400,
                };
            }

            const result = await categoryService.updateCategory(
                newName,
                categoryId
            );
            if (result[0] === 1) {
                return {
                    result: "category updated successfully!",
                    statusCode: 200,
                };
            } else {
                return {
                    message:
                        "Could not updated. Check your provided information (New Name should not be the same current name).",
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

    deleteCategory: async function (categoryId) {
        try {
            // check if it is assigned to a product
            const category = await categoryService.getOneById(categoryId);

            if (!(category instanceof db.Category)) {
                return {
                    message: `Not found a category for id ${categoryId}`,
                    statusCode: 400,
                };
            } else {
                const assigendProduct = await productService.getOneByCategoryId(
                    categoryId
                );
                if (!(assigendProduct instanceof db.Product)) {
                    const result = await categoryService.deleteCategory(
                        categoryId
                    );
                    if (result) {
                        return {
                            result: "category deleted successfully!",
                            statusCode: 200,
                        };
                    } else {
                        return {
                            message: "Could not deleted. Check provided id",
                            statusCode: 400,
                        };
                    }
                } else {
                    return {
                        message:
                            "Could not deleted. This category is assigned to a product!!",
                        statusCode: 400,
                    };
                }
            }
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },
};
