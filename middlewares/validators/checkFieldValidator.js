module.exports = function checkFieldValidator(input) {
    return (req, res, next) => {
        const data = req.body;
        if (input in data ){
            if (typeof data[input] !== "string"){
                return res.status(400).jsend.fail({
                    message: `${input} must be string`,
                    statusCode: 400,
                });
            }
            next()
        }else {
            return res.status(400).jsend.fail({
                message: `${input} must be provided`,
                statusCode: 400,
            });
        }
    } 
}