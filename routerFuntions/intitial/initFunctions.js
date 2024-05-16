var crypto = require("crypto");
const axios = require("axios");
var db = require("../../models");
var RoleService = require("../../services/RoleService");
var roleService = new RoleService(db);
var MembershipService = require("../../services/MembershipService");
var membershipService = new MembershipService(db);
var UserService = require("../../services/UserService");
var userService = new UserService(db);
var BrandService = require("../../services/BrandService");
var brandService = new BrandService(db);
var db = require("../../models");
var CategoryService = require("../../services/CategoryService");
var categoryService = new CategoryService(db);
var ProductService = require("../../services/ProductService");
var productService = new ProductService(db);
var StatusService = require("../../services/StatusService");
var statusService = new StatusService(db);

module.exports = {
    getProducts: async function () {
        try {
            const response = await axios.get(
                "http://143.42.108.232:8888/items/products"
            );
            let products = response.data.data;

            const brandsArray = products.reduce((brands, product) => {
                if (!brands.includes(product.brand)) {
                    brands.push(product.brand);
                }
                return brands;
            }, []);

            const categoriesArray = products.reduce((categories, product) => {
                if (!categories.includes(product.category)) {
                    categories.push(product.category);
                }
                return categories;
            }, []);

            return {
                response: { brandsArray, categoriesArray, products },
                statusCode: 200,
            };
        } catch (error) {
            return { message: error?.message, statusCode: 500 };
        }
    },

    createBrands: async function (brandsArray) {
        for (brand of brandsArray) {
            try {
                const isExist = await brandService.getOneByName(brand);
                if (!(isExist instanceof db.Brand)) {
                    const result = await brandService.createBrand(brand);
                    if (!(result instanceof db.Brand)) {
                        return {
                            message: result?.errors[0].message,
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
        }
        return { message: "ok", statusCode: 200 };
    },

    createCategories: async function (categoriesArray) {
        for (category of categoriesArray) {
            try {
                const isExist = await categoryService.getOneByName(category);
                if (!(isExist instanceof db.Category)) {
                    const result = await categoryService.createCategory(
                        category
                    );
                    if (!(result instanceof db.Category)) {
                        return {
                            message: result?.errors[0].message,
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
        }
        return { message: "ok", statusCode: 200 };
    },

    createProducts: async function (products) {
        let category;
        let brand;

        for (const product of products) {
            let temp = {
                name: product.name,
                imgUrl: product.imgurl,
                description: product.description,
                price: product.price,
                countInStock: product.quantity,
                brandName: product.brand,
                categoryName: product.category,
            };

            try {
                category = await categoryService.getOneByName(
                    temp.categoryName
                );
                if (category === null) {
                    return {
                        message: `There is no ${product.category} category`,
                        statusCode: 400,
                    };
                }

                brand = await brandService.getOneByName(temp.brandName);

                if (brand === null) {
                    return {
                        message: `There is no ${temp.brandName} brand`,
                        statusCode: 400,
                    };
                }
            } catch (error) {
                return { message: error.message, statusCode: 500 };
            }

            try {
                const isExist = await productService.checkIfExists(
                    temp.name,
                );
                if (!(isExist instanceof db.Product)) {
                    const result = await productService.createProduct(
                        temp.name,
                        temp.imgUrl,
                        temp.description,
                        temp.price,
                        temp.countInStock,
                        brand.id,
                        category.id
                    );
                    if (!(result instanceof db.Product)) {
                        return {
                            message: result?.errors[0].message,
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
        }
        return { message: "ok", statusCode: 200 };
    },

    createRoles: async function () {
        const roles = ["Admin", "User"];

        for (const role of roles) {
            try {
                const isRoleExist = await roleService.getOneByName(role);
                if (isRoleExist instanceof db.Role) {
                    if (isRoleExist.isDeleted){
                        isRoleExist.isDeleted = false;
                        await isRoleExist.save()      
                    }
                }else {
                    const result = await roleService.createRole(role);
                    if (!(result instanceof db.Role)) {
                        return {
                            message: `role ${role} could not be created. Error from server`,
                            statusCode: 500,
                        };
                    }
                }
            } catch (error) {
                return {
                    message: error?.message,
                    statusCode: 500,
                };
            }
        }
        return { message: "ok", statusCode: 200 };
    },

    createStatuses: async function () {
        const statuses = [
            "Not-checkout",
            "In-progress",
            "Ordered",
            "Completed",
        ];

        for (const status of statuses) {
            try {
                const existStatus = await statusService.getOneByName(status);
                if (existStatus instanceof db.Status) {
                    if (existStatus.isDeleted){
                        existStatus.isDeleted = false;
                        await existStatus.save()      
                    }
                }else {
                    const result = await statusService.createStatus(status);
                    if (!(result instanceof db.Status)) {
                        return {
                            message: `Status ${status} could not be created. Error from server`,
                            statusCode: 500,
                        };
                    }
                }
            } catch (error) {
                return {
                    message: error?.message,
                    statusCode: 500,
                };
            }
        }
        return { message: "ok", statusCode: 200 };
    },

    createMemberships: async function () {
        const memeberships = [
            ["Bronze", 0],
            ["Silver", 15],
            ["Gold", 30],
        ];

        for (const membership of memeberships) {
            try {
                const isMembershipExist = await membershipService.getOneByName(
                    membership[0]
                );
                if (isMembershipExist instanceof db.Membership) {
                    if (isMembershipExist.isDeleted){
                        isMembershipExist.isDeleted = false;
                        await isMembershipExist.save()      
                    }
                }else {
                    const result = await membershipService.createMembership(
                        membership[0],
                        membership[1]
                    );
                    if (!(result instanceof db.Membership)) {
                        return {
                            message: `${membership[0]} membership could not be created. Error from server`,
                            statusCode: 500,
                        };
                    }
                }
            } catch (error) {
                return {
                    message: error?.message,
                    statusCode: 500,
                };
            }
        }
        return { message: "ok", statusCode: 200 };
    },

    createUserAdmin: async function () {
        const adminObject = {
            firstName: process.env.ADMIN_FIRSTNAME_INIT,
            lastName: process.env.ADMIN_LASTNAME_INIT,
            username: process.env.ADMIN_USERNAME_INIT,
            email: process.env.ADMIN_EMAIL_INIT,
            password: process.env.ADMIN_PASSWORD_INIT,
            address: process.env.ADMIN_ADDRESS_INIT,
            phoneNumber: process.env.ADMIN_PHONENUMBER_INIT,
        };

        try {
            const adminRole = await roleService.getOneNotDeletedById(1);
            const membershipBronze = await membershipService.getOneNotDeletedById(1);
            if (
                adminRole instanceof db.Role &&
                membershipBronze instanceof db.Membership
            ) {
                adminObject.roleId = adminRole.id;
                adminObject.membershipId = membershipBronze.id;

                try {
                    const emailIsUsed = await userService.getOneByEmail(
                        adminObject.email
                    );
                    if (emailIsUsed != null) {
                        return {
                            message:
                                "Provided email is already in use. Admin could not be created!",
                            statusCode: 400,
                        };
                    }

                    const usernameIsUsed = await userService.getOneByUsername(
                        adminObject.username
                    );
                    if (usernameIsUsed != null) {
                        return {
                            message:
                                "Provided username is already in use. Admin could not be created!",
                            statusCode: 400,
                        };
                    }

                    const salt = crypto.randomBytes(16);
                    crypto.pbkdf2(
                        adminObject.password,
                        salt,
                        310000,
                        32,
                        "sha256",
                        async (err, hashedPassword) => {
                            if (err) {
                                return {
                                    message: err?.message,
                                    statusCode: 500,
                                };
                            }
                            const result = await userService.createUser(
                                adminObject.firstName,
                                adminObject.lastName,
                                adminObject.username,
                                adminObject.email,
                                hashedPassword,
                                salt,
                                adminObject.address,
                                adminObject.phoneNumber,
                                adminObject.membershipId,
                                adminObject.roleId
                            );

                            if (!(result instanceof db.User)) {
                                return {
                                    message: result?.errors[0].message,
                                    statusCode: 400,
                                };
                            }
                        }
                    );
                } catch (error) {
                    return {
                        message: error?.message,
                        statusCode: 500,
                    };
                }
            }
            return { message: "ok", statusCode: 200 };
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },
};
