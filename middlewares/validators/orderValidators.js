module.exports = {
    updateOrderValidator: function(req, res, next) {
        const { statusName } = req.body 
        if (!statusName) {
            return res.status(400).jsend.fail({
                message: "statusName must be provided",
                statusCode: 400,
            });
        }

        if (typeof statusName !== "string"){
            return res.status(400).jsend.fail({
                message: "statusName must be string",
                statusCode: 400,
            });
        }

        if (statusName.toLowerCase() === 'not-checkout') {
            return res.status(400).jsend.fail({
                message: "Can not be changed to 'not-checkout'",
                statusCode: 400,
            });
        }

        next()
    }
}