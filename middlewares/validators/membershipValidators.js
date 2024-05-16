module.exports = {
    membershipCreateValidator : function(req, res, next) {
        const { membershipName, discount } = req.body
        if (!membershipName){
            return res.status(400).jsend.fail({
                message: "membershipName must be provided",
                statusCode: 400,
            });
        }

        if (typeof membershipName !== "string"){
            return res.status(400).jsend.fail({
                message: "membershipName must be string",
                statusCode: 400,
            });
        }

        if (!discount){
            return res.status(400).jsend.fail({
                message: "discount must be provided",
                statusCode: 400,
            });
        }

        if (typeof discount !== "number"){
            return res.status(400).jsend.fail({
                message: "discount type must be integer",
                statusCode: 400,
            });
        }
        next()
    },

    membershipUpdateValidator : function(req, res, next) {
        const { newName, newDiscount } = req.body
        if (!newName){
            return res.status(400).jsend.fail({
                message: "New name must be provided",
                statusCode: 400,
            });
        }

        if (typeof newName !== "string"){
            return res.status(400).jsend.fail({
                message: "newName must be string",
                statusCode: 400,
            });
        }

        if (!newDiscount){
            return res.status(400).jsend.fail({
                message: "new discount must be provided",
                statusCode: 400,
            });
        }

        if (typeof newDiscount !== "number"){
            return res.status(400).jsend.fail({
                message: "new discount type must be number",
                statusCode: 400,
            });
        }

        next()
    }

}
