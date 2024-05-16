var db = require("../../models");
var OrderService = require("../../services/OrderService");
var orderService = new OrderService(db);
var ItemService = require("../../services/ItemService");
var itemService = new ItemService(db);
var ProductService = require("../../services/ProductService");
var productService = new ProductService(db);
var UserService = require("../../services/UserService");
var userService = new UserService(db);
var MembershipService = require("../../services/MembershipService");
var membershipService = new MembershipService(db);
var StatusService = require("../../services/StatusService");
var statusService = new StatusService(db);

module.exports = {
    checkCartExist: async function (cartId, userId) {
        try {
            let userHasCart = await orderService.checkIfCartExist(
                cartId,
                userId
            );
            if (userHasCart) {
                return { result: userHasCart, statusCode: 200 };
            } else {
                return {
                    message: `There is no cart with id ${cartId}`,
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

    checkCartIsEmpty: async function (cartId) {
        try {
            const isEmpty = await orderService.checkIfCartIsEmpty(cartId);
            if (!isEmpty) {
                return {
                    message:
                        "Your cart is Empty. Please add item to check out.",
                    statusCode: 400,
                };
            } else {
                return { result: true, statusCode: 200 };
            }
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },

    checkCountInStock: async function (items) {
        for (const item of items) {
            try {
                if (!item.isDeleted && !item.isPurchased) {
                    const product = await productService.getOneById(
                        item.ProductId
                    );
                    if (!product) {
                        return {
                            message: `Checkout failed. Not found product for item with id ${item.id}`,
                            statusCode: 400,
                        };
                    }

                    if (item.quantity > product?.countInStock) {
                        return {
                            message: `Checkout failed. You want ${item.quantity} items. We have only ${product?.countInStock} for ${product?.name} in our stock.`,
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
        return { result: true, statusCode: 200 };
    },

    purchaseItems: async function (items) {
        let listOfIds = await Promise.all(
            items
                .filter((item) => {
                    if (!item.isDeleted && !item.isPurchased) {
                        return item;
                    }
                })
                .map(async (item) => {
                    return item.id;
                })
        );

        let itemIds = listOfIds.join(", ");

        try {
            const updatedItems = await itemService.purchaseItem(itemIds);
            if (!updatedItems[1]) {
                return {
                    message: "Checkout failed. Could not update cart items",
                    statusCode: 400,
                };
            } else {
                return { result: itemIds, statusCode: 200 };
            }
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },


    stopPurchaseItems:  async function (itemIds) {
        try {
            const updatedItems = await itemService.stopPurchaseItem(itemIds);
            if (!updatedItems[1]) {
                return {
                    message: "Stopping purchasItem failed.",
                    statusCode: 400,
                };
            } else {
                return { result: true, statusCode: 200 };
            }
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },

    updateProductQuantity: async function (items) {
        let updatedProductsList = [];
        for (const item of items) {
            try {
                if (!item.isDeleted && !item.isPurchased) {
                    const product = await productService.getOneById(
                        item.ProductId
                    );
                    if (!product) {
                        // If process fails, set back old quantities for updated products.
                        for (const p of updatedProductsList) {
                            const u_product = await productService.getOneById(
                                p[0]
                            );
                            u_product.countInStock = p[1];
                            await u_product.save();
                        }
                        return {
                            message: `Checkout failed. Not found product for item with id ${item?.id}`,
                            statusCode: 400,
                        };
                    }

                    const newQuantity = product?.countInStock - item.quantity;

                    product.countInStock = newQuantity;
                    await product.save();

                    // push id and old quantity of updated products in a list
                    updatedProductsList.push([
                        product?.id,
                        product?.countInStock + item.quantity,
                    ]);
                }
            } catch (error) {
                return {
                    message: error?.message,
                    statusCode: 500,
                };
            }
        }
        updatedProductsList = null;
        return { result: true, statusCode: 200 };
    },

    checkOut: async function (cartId) {
        try {
            const checkedOut = await orderService.checkOut(cartId);
            if (checkedOut[0] !== 1) {
                return {
                    message: "Can not check out your cart. Try later on",
                    statusCode: 400,
                };
            } else {
                return { result: true, statusCode: 200 };
            }
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },


    stopCheckOut: async function(cartId) {
        try {
            const checkedOut = await orderService.stopCheckOut(cartId);
            if (checkedOut[0] !== 1) {
                return {
                    message: "Stopping process failed.",
                    statusCode: 400,
                };
            } else {
                return { result: true, statusCode: 200 };
            }
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },

    updateMembership: async function (userId) {
        try {
            const user = await userService.getOneById(userId);
            const allOrders = await orderService.getAllUserOrders(user?.id);
            let listOfIds = await Promise.all(
                allOrders.map(async (order) => {
                    return order.id;
                })
            );

            let stringIds = listOfIds.join(", ");
            const numberOfPurchased = await itemService.getTotalPurchase(
                stringIds
            );

            const bronzeStatus = await membershipService.getOneNotDeletedById(
                1
            );
            const silverStatus = await membershipService.getOneNotDeletedById(
                2
            );
            const goldStatus = await membershipService.getOneNotDeletedById(3);

            if (!bronzeStatus || !silverStatus || !goldStatus) {
                return {
                    message:
                        "Could not update user's membership. Not found data for memberships",
                    statusCode: 400,
                };
            }

            if (numberOfPurchased[0].totalPurchased < 15) {
                user.MembershipId = bronzeStatus?.id;
                await user.save();
            } else if (
                numberOfPurchased[0].totalPurchased >= 15 &&
                numberOfPurchased[0].totalPurchased < 30
            ) {
                user.MembershipId = silverStatus?.id;
                await user.save();
            } else if (numberOfPurchased[0].totalPurchased >= 30) {
                user.MembershipId = goldStatus?.id;
                await user.save();
            }
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
        return { result: true, statusCode: 200 };
    },

    getAllUserOrder: async function (userId) {
        try {
            const orders = await orderService.getAllUserOrders(userId);
            const listOfOrders = await Promise.all(
                orders.map(async (order) => {
                    const items = order.Items;
                    const listOfItems = await Promise.all(
                        items.map(async (item) => {
                            if (!item.isDeleted) {
                                const product = await productService.getOneById(
                                    item.ProductId
                                );
                                return {
                                    id: item.id,
                                    name: product.name,
                                    quantity: item.quantity,
                                    unitPrice: item.unitPrice,
                                    isPurchased: item.isPurchased,
                                    isDeleted: item.isDeleted,
                                    createdAt: item.createdAt,
                                    updatedAt: item.updatedAt,
                                };
                            }
                        })
                    );
                    const newItems = listOfItems.filter(
                        (item) => item !== undefined
                    );
                    return {
                        id: order.id,
                        orderNumber: order.orderNumber,
                        status: order.Status.statusName,
                        createdAt: order.updatedAt,
                        updatedAt: order.updatedAt,
                        items: newItems,
                    };
                })
            );

            return { result: listOfOrders, statusCode: 200 };
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },

    getOneUserOrder: async function (orderId, userId) {
        try {
            const order = await orderService.getOneUserOrder(orderId, userId);
            if (order) {
                const items = order.Items;
                const listOfItems = await Promise.all(
                    items.map(async (item) => {
                        if (!item.isDeleted) {
                            const product = await productService.getOneById(
                                item.ProductId
                            );
                            return {
                                id: item.id,
                                name: product.name,
                                quantity: item.quantity,
                                unitPrice: item.unitPrice,
                                isPurchased: item.isPurchased,
                                isDeleted: item.isDeleted,
                                createdAt: item.createdAt,
                                updatedAt: item.updatedAt,
                            };
                        }
                    })
                );
                const newItems = listOfItems.filter(
                    (item) => item !== undefined
                );

                let reformmatedOrder = {
                    id: order.id,
                    orderNumber: order.orderNumber,
                    status: order.Status.statusName,
                    createdAt: order.updatedAt,
                    updatedAt: order.updatedAt,
                    items: newItems,
                };
                return { result: reformmatedOrder, statusCode: 200 };
            } else {
                return {
                    message: `Could not find order with id ${orderId}.`,
                    statusCode: 400,
                };
            }
        } catch (error) {
            return { message: error?.message, statusCode: 500 };
        }
    },

    getAllOrders: async function () {
        try {
            const orders = await orderService.getAllOrders();
            const listOfOrders = await Promise.all(
                orders.map(async (order) => {
                    const items = order.Items;
                    const listOfItems = await Promise.all(
                        items.map(async (item) => {
                            if (!item.isDeleted) {
                                const product = await productService.getOneById(
                                    item.ProductId
                                );
                                return {
                                    id: item.id,
                                    name: product.name,
                                    quantity: item.quantity,
                                    unitPrice: item.unitPrice,
                                    isPurchased: item.isPurchased,
                                    isDeleted: item.isDeleted,
                                    createdAt: item.createdAt,
                                    updatedAt: item.updatedAt,
                                };
                            }
                        })
                    );
                    const newItems = listOfItems.filter(
                        (item) => item !== undefined
                    );
                    return {
                        id: order.id,
                        orderNumber: order.orderNumber,
                        userId: order.UserId,
                        status: order.Status.statusName,
                        isDeleted: order.isDeleted,
                        createdAt: order.updatedAt,
                        updatedAt: order.updatedAt,
                        items: newItems,
                    };
                })
            );

            return { result: listOfOrders, statusCode: 200 };
        } catch (error) {
            return {
                message: error?.message,
                statusCode: 500,
            };
        }
    },

    changeStatus: async function (orderId, statusName) {
        try {
            const order = await orderService.getOneNotDeleted(orderId);
            if (order) {
                const status = await statusService.getOneNotDeletedByName(
                    statusName
                );
                if (!status) {
                    return {
                        message: `Could not find status ${statusName}. Check if it is deleted!!`,
                        statusCode: 400,
                    };
                }
                if (order.StatusId === status.id) {
                    return {
                        message: `Order has already status '${statusName}'`,
                        statusCode: 400,
                    };
                } else {
                    const updatedOrder = await orderService.updateOrderStatus(
                        orderId,
                        status.id
                    );
                    if (updatedOrder[0] === 1) {
                        return {
                            result: "Order status updated successfully",
                            statusCode: 200,
                        };
                    } else {
                        return {
                            message:
                                "An error occured. Could not update order status!!!",
                            statusCode: 400,
                        };
                    }
                }
            } else {
                return {
                    message: `Could not find order with id ${orderId}. Either it does not exist or is deleted.`,
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

    deleteOrder: async function (orderId) {
        try {
            const order = await orderService.getOneNotDeleted(orderId);
            console.log(order)
            // check if exists
            if (order) {
                // check if order is completed
                if (order.StatusId != 4) {
                    return {
                        message:
                            "This order is under process and can not be deleted. Please change its status to 'Completed' first.",
                        statusCode: 400,
                    };
                } else {
                    order.isDeleted = true;
                    await order.save();

                    return {
                        result: "Order deleted successfully",
                        statusCode: 200,
                    };
                }
            } else {
                return {
                    message: `Could not find order with id ${orderId}. Either it does not exist or is deleted.`,
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
};
