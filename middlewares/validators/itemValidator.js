module.exports = {
    updateItemByUserValidator: function (req, res, next) {
        const { newQuantity } = req.body;
        
        if (!newQuantity){
            return res.status(400).jsend.fail({
                message: "newQuantity must be provided",
                statusCode: 400,
            });
        }

        if (!Number.isInteger(newQuantity)) {
            return res.status(400).jsend.fail({
                message: "newQunatity must be an integer",
                statusCode: 400,
            });
        }

        if (newQuantity <= 0) {
            return res.status(400).jsend.fail({
                message: "newQuantity can not be zero or less than zero",
                statusCode: 400,
            });
        }
        next()
    },


    addItemValidator: function (req, res, next) {
        const { quantity, productId } = req.body;
        if (!quantity){
            return res.status(400).jsend.fail({
                message: "quantity must be provided",
                statusCode: 400,
            });
        }

        if (!Number.isInteger(quantity)) {
            return res.status(400).jsend.fail({
                message: "quantity must be an integer",
                statusCode: 400,
            });
        }

        if (quantity <= 0) {
            return res.status(400).jsend.fail({
                message: "quantity can not be zero or less than zero",
                statusCode: 400,
            });
        }

        if (!productId) {
            return res.status(400).jsend.fail({
                message: "productId must be provided",
                statusCode: 400,
            });
        }

        next();
    },
}