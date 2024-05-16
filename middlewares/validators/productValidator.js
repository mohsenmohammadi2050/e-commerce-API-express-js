module.exports = {
    productCreateValidator: function (req, res, next) {
        const {
            name,
            imgUrl,
            description,
            price,
            countInStock,
            brandName,
            categoryName,
        } = req.body;

        if (!name) {
            return res.status(400).jsend.fail({
                message: "name must be provided",
                statusCode: 400,
            });
        }

        if (typeof name !== "string") {
            return res.status(400).jsend.fail({
                message: "name must be string",
                statusCode: 400,
            });
        }

        if (!imgUrl) {
            return res.status(400).jsend.fail({
                message: "imgUrl must be provided",
                statusCode: 400,
            });
        }

        if (typeof imgUrl !== "string") {
            return res.status(400).jsend.fail({
                message: "imgUrl must be string",
                statusCode: 400,
            });
        }

        if (!description) {
            return res.status(400).jsend.fail({
                message: "description must be provided",
                statusCode: 400,
            });
        }

        if (typeof description !== "string") {
            return res.status(400).jsend.fail({
                message: "description must be string",
                statusCode: 400,
            });
        }

        if (!price && price !== 0) {
            return res.status(400).jsend.fail({
                message: "price must be provided",
                statusCode: 400,
            });
        }
        

        if (typeof price !== "number") {
            return res.status(400).jsend.fail({
                message: "price must be a number",
                statusCode: 400,
            });
        }

        if (!countInStock && countInStock !== 0) {
            return res.status(400).jsend.fail({
                message: "countInStock must be provided",
                statusCode: 400,
            });
        }

        if (!Number.isInteger(countInStock)) {
            return res.status(400).jsend.fail({
                message: "countInStock must be an integer",
                statusCode: 400,
            });
        }

        if (!brandName) {
            return res.status(400).jsend.fail({
                message: "brandName must be provided",
                statusCode: 400,
            });
        }

        if (typeof brandName !== "string") {
            return res.status(400).jsend.fail({
                message: "brandName must be string",
                statusCode: 400,
            });
        }

        if (!categoryName) {
            return res.status(400).jsend.fail({
                message: "categoryName must be provided",
                statusCode: 400,
            });
        }

        if (typeof categoryName !== "string") {
            return res.status(400).jsend.fail({
                message: "categoryName must be string",
                statusCode: 400,
            });
        }

        next();
    },

    productUpdateValidator: function (req, res, next) {
        const {
            newName,
            newImgUrl,
            newDescription,
            newPrice,
            newCountInStock,
            newBrandName,
            newCategoryName,
        } = req.body;

        if (
            !newName &&
            !newImgUrl &&
            !newDescription &&
            !newPrice &&
            newPrice !== 0 &&
            !newCountInStock &&
            newCountInStock !== 0 &&
            !newBrandName &&
            !newCategoryName
        ) {
            return res.status(400).jsend.fail({
                message:
                    "No new property provided. Please at least provide one property to update",
                statusCode: 400,
            });
        }

        if (newName) {
            if (typeof newName != "string") {
                res.status(400).jsend.fail({
                    message: "newName must be string",
                    statusCode: 400,
                });
                return;
            }
        }

        if (newImgUrl) {
            if (typeof newImgUrl != "string") {
                res.status(400).jsend.fail({
                    message: "newImgUrl must be string",
                    statusCode: 400,
                });
                return;
            }
        }

        if (newDescription) {
            if (typeof newDescription != "string") {
                res.status(400).jsend.fail({
                    message: "newDescription must be string",
                    statusCode: 400,
                });
                return;
            }
        }

        if (newPrice || newPrice == 0) {
            if (typeof newPrice !== "number") {
                return res.status(400).jsend.fail({
                    message: "newPrice must be a number",
                    statusCode: 400,
                });
            }
        }

        if (newCountInStock || newCountInStock == 0) {
            if (!Number.isInteger(newCountInStock)) {
                return res.status(400).jsend.fail({
                    message: "newCountInStock must be an integer",
                    statusCode: 400,
                });
            }
        }

        if (newBrandName) {
            if (typeof newBrandName != "string") {
                res.status(400).jsend.fail({
                    message: "newBrandName must be string",
                    statusCode: 400,
                });
                return;
            }
        }

        if (newCategoryName) {
            if (typeof newCategoryName != "string") {
                res.status(400).jsend.fail({
                    message: "newCategoryName must be string",
                    statusCode: 400,
                });
                return;
            }
        }

        next();
    },
};
