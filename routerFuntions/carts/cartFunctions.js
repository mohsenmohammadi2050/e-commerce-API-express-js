var db = require("../../models");
var CartService = require("../../services/CartService");
var cartService = new CartService(db);
var ItemService = require("../../services/ItemService");
var itemService = new ItemService(db);
var ProductService = require("../../services/ProductService");
var productService = new ProductService(db);
var UserService = require("../../services/UserService");
var userService = new UserService(db);
var generateOrderNumber = require("../../utils/generateOrderNumber");

module.exports = {
    getCartItems: async function (userId) {
        try {
            const hasCart = await cartService.checkIfUserHasCart(userId);
            if (hasCart instanceof db.Order) {
                const items = await cartService.getAllCartItems(hasCart.id);
                const listOfItems = await Promise.all(
                    items.map(async (item) => {
                        return {
                            id: item.id,
                            name: item.Product.name,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            isDeleted: item.isDeleted,
                            isPurchased: item.isPurchased,
                            createdAt: item.createdAt,
                            updatedAt: item.updatedAt,
                        };
                    })
                );
                return { result: listOfItems, statusCode: 200 };
            } else {
                return {
                    message:
                        "You dont have a cart yet. Please add item to create a cart.",
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

    getCartItemsDeleted: async function (userId) {
        try {
            const hasCart = await cartService.checkIfUserHasCart(userId);
            if (hasCart instanceof db.Order) {
                const items = await cartService.getAllDeletedCartItems(
                    hasCart.id
                );
                const listOfItems = await Promise.all(
                    items.map(async (item) => {
                        return {
                            id: item.id,
                            name: item.Product.name,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            isDeleted: item.isDeleted,
                            isPurchased: item.isPurchased,
                            createdAt: item.createdAt,
                            updatedAt: item.updatedAt,
                        };
                    })
                );
                return { result: listOfItems, statusCode: 200 };
            } else {
                return {
                    message:
                        "You dont have a cart yet. Please add item to create a cart.",
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

    createCart: async function (userId, productId, quantity) {
        let cart;
        try {
            const hasCart = await cartService.checkIfUserHasCart(userId);
            if (hasCart instanceof db.Order) {
                cart = hasCart;
                // check count in stock
                const product = await productService.getOneNotDeleted(
                    productId
                );
                if (product instanceof db.Product) {
                    if (product.countInStock == 0) {
                        return {
                            message: "Product is out of stock",
                            statusCode: 400,
                        };
                    }
                }
                // check if cart has already this item
                const itemExists = await cartService.getCartItemByProductId(
                    cart.id,
                    productId
                );

                if (itemExists instanceof db.Item) {
                    itemExists.quantity += quantity;
                    await itemExists.save();
                    return {
                        result: "Item already exists in your cart. We added new quantity to the current quantity of item",
                        statusCode: 201,
                    };
                } else {
                    return {
                        result: cart,
                        statusCode: 200,
                    };
                }
            } else {
                let isUnique = false;
                let orderNumber;
                do {
                    orderNumber = generateOrderNumber();
                    const isOrderExist = await cartService.getOneByOrderNumber(
                        orderNumber
                    );

                    if (!isOrderExist) {
                        isUnique = true;
                    }
                } while (!isUnique);
                if (orderNumber.length != 8) {
                    return {
                        message:
                            "Something went wrong with creating orderNumber. Please try again to generate a correct orderNumber",
                        statusCode: 400,
                    };
                }
                const createdCart = await cartService.createCart(
                    orderNumber,
                    userId
                );
                if (createdCart instanceof db.Order) {
                    cart = createdCart;
                    return {
                        result: cart,
                        statusCode: 200,
                    };
                } else {
                    return {
                        message: createdCart?.message || "An error occured!",
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

    addItemtoCart: async function (userId, productId, cart, quantity) {
        try {
            // check countInStock of the product
            const product = await productService.getOneNotDeleted(productId);
            if (product instanceof db.Product) {
                if (product.countInStock == 0) {
                    return {
                        message: "Product is out of stock",
                        statusCode: 400,
                    };
                } else {
                    // check the membership of the user to calculate the unit price item
                    const currentUser = await userService.getOneById(userId);

                    const membershipDiscount = currentUser.Membership.discount;
                    const unitPrice = Math.round(
                        product.price -
                            product.price * (membershipDiscount / 100)
                    );

                    // add item to the cart
                    const result = await itemService.addItem(
                        quantity,
                        unitPrice,
                        cart.id,
                        product.id
                    );
                    if (result instanceof db.Item) {
                        return {
                            result: "Item added to your cart.",
                            statusCode: 200,
                        };
                    } else {
                        return {
                            message: result?.message || "An error occured!!",
                            statusCode: 400,
                        };
                    }
                }
            } else {
                return {
                    message: `Found no product for product id ${productId}.`,
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

    updateItemQuantity: async function (userId, itemId, newQuantity) {
        try {
            // check if user has a cart
            const hasCart = await cartService.checkIfUserHasCart(userId);

            if (hasCart instanceof db.Order) {
                const itemExists = await cartService.getCartItemByItemId(
                    hasCart.id,
                    itemId
                );

                if (itemExists instanceof db.Item) {
                    // check if deleted or purchased
                    if (itemExists.isDeleted || itemExists.isPurchased) {
                        return {
                            message:
                                "The item can not be updated. Either it is deleted or purchased!",
                            statusCode: 400,
                        };
                    }

                    itemExists.quantity = newQuantity;
                    await itemExists.save();
                    return {
                        result: "Quantity of your item updated",
                        statusCode: 200,
                    };
                } else {
                    return {
                        message: "Item does not exist",
                        statusCode: 400,
                    };
                }
            } else {
                return {
                    message:
                        "You dont have a cart yet. Please create a cart first",
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

    deleteItemFromCart: async function (userId, itemId) {
        try {
            // check if user has a cart
            const hasCart = await cartService.checkIfUserHasCart(userId);
            if (hasCart instanceof db.Order) {
                const itemExists = await cartService.getCartItemByItemId(
                    hasCart.id,
                    itemId
                );

                if (itemExists instanceof db.Item) {
                    if (itemExists.isDeleted) {
                        return {
                            message: "Item has already been deleted",
                            statusCode: 400,
                        };
                    }

                    itemExists.isDeleted = true;
                    await itemExists.save();
                    return {
                        result: "Item deleted successfully!",
                        statusCode: 200,
                    };
                } else {
                    return {
                        message: "Item does not exist",
                        statusCode: 400,
                    };
                }
            } else {
                return {
                    message:
                        "You dont have a cart yet. Please create a cart first",
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

    // only admin
    getAllPurchasedItems: async function () {
        try {
            const items = await itemService.getAllPurchased();
            const listOfItems = await Promise.all(
                items.map(async (item) => {
                    return {
                        id: item.id,
                        orderId: item.OrderId,
                        userId: item.Order.UserId,
                        name: item.Product.name,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        isPurchased: item.isPurchased,
                        isDeleted: item.isDeleted,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt,
                    };
                })
            );
            return { result: listOfItems, statusCode: 200 };
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },

    getAllDeletedItems: async function () {
        try {
            const items = await itemService.getAllDeleted();
            const listOfItems = await Promise.all(
                items.map(async (item) => {
                    return {
                        id: item.id,
                        orderId: item.OrderId,
                        userId: item.Order.UserId,
                        name: item.Product.name,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        isPurchased: item.isPurchased,
                        isDeleted: item.isDeleted,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt,
                    };
                })
            );
            return { result: listOfItems, statusCode: 200 };
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },
};
