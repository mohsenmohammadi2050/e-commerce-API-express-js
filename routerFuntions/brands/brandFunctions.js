var db = require("../../models");
var BrandService = require("../../services/BrandService");
var brandService = new BrandService(db);
var ProductService = require("../../services/ProductService");
var productService = new ProductService(db);



module.exports = {
    getAllBrands: async function () {
        try {
            const brands = await brandService.getAll();
            return {
                result: brands,
                statusCode: 200,
            }
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            }
        }
    },



    getOneBrand: async function(brandId) {
        try {
            const brand = await brandService.getOneById(brandId);
    
            if (brand instanceof db.Brand) {
                return {
                    result: brand,
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



    createBrand: async function(brandName) {
        try {
            const isExist = await brandService.getOneByName(brandName);
            if (isExist instanceof db.Brand) {
                return {
                    message: "This brand name already exists",
                    statusCode: 400,
                }
            }

            const result = await brandService.createBrand(brandName);
            if (result instanceof db.Brand) {
                return {
                        result: "You created a brand.",
                        statusCode: 200,
                    }
            } else {
                return {
                    message: result?.message || "An error occured! Check if you provided correct data",
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



    updateBrand: async function(brandId, newName) {
        try {
            const brand = await brandService.getOneById(brandId);
            if (!(brand instanceof db.Brand)) {
                return {
                    message: `Not found a brand for id ${brandId}`,
                    statusCode: 400,
                }
            }

            const ifExists = await brandService.getOneByName(newName);
            if (ifExists instanceof db.Brand) {
                return {
                    message: `There is already a brand with name ${newName}. Duplicate name is not allowed!`,
                    statusCode: 400,
                }
            }
            
            const result = await brandService.updateBrand(newName, brandId);
            
            if (result[0] == 1) {
                return {
                        result: "brand updated successfully!",
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



    deleteBrand: async function(brandId) {
        try {
            // check if it is assigned to a product
            const brand = await brandService.getOneById(brandId);
    
            if (!(brand instanceof db.Brand)) {
                return {
                    message: `Not found a brand for id ${brandId}`,
                    statusCode: 400,
                }
            } else {
                const assigendProduct = await productService.getOneByBrandId(brandId);
                if (!(assigendProduct instanceof db.Product)) {
                    const result = await brandService.deleteBrand(brandId);
                    if (result) {
                        return {
                                result: "brand deleted successfully!",
                                statusCode: 200,
                            }
                    } else {
                        return {
                            message: "Could not deleted. Check provided id",
                            statusCode: 400,
                        }
                    }
                } else {
                    return {
                        message: "Could not deleted. This brand is assigned to a product!!",
                        statusCode: 400,
                    }
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