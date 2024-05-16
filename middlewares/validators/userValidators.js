const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

module.exports = {
    userUpdateValidator: function(req, res, next) {
        const { newFirstName, newLastName, newEmail, newUserName, newPhoneNumber, newAddress, newPassword } = req.body;
        
        if ( !newFirstName && !newLastName && !newEmail && !newUserName && !newPhoneNumber && !newAddress && !newPassword) {
            return res.status(400).jsend.fail({
                message: "No new property provided. Please at least provide one property to update",
                statusCode: 400,
            });
        }

    if (newFirstName) {
        if (typeof newFirstName != "string"){
            res.status(400).jsend.fail({
                message: "newFirstName must be string",
                statusCode: 400,
            });
            return;
        }
    }

    if (newLastName) {
        if (typeof newLastName != "string"){
            res.status(400).jsend.fail({
                message: "newLastName must be string",
                statusCode: 400,
            });
            return;
        }
    }

    if (newUserName) {
        if (typeof newUserName != "string"){
            res.status(400).jsend.fail({
                message: "newUserName must be string",
                statusCode: 400,
            });
            return;
        }
    }

    if (newPassword) {
        if (typeof newPassword != "string"){
            res.status(400).jsend.fail({
                message: "newPassword must be string",
                statusCode: 400,
            });
            return;
        }
    }

    if (newAddress) {
        if (typeof newAddress != "string"){
            res.status(400).jsend.fail({
                message: "newAddress must be string",
                statusCode: 400,
            });
            return;
        }
    }

    

        
    // email
    if (newEmail ) {
        if (!emailPattern.test(newEmail)){
            res.status(400).jsend.fail({
                message: "newEmail is not valid",
                statusCode: 400,
            });
            return;
        }
    }

    // phoneNumber
    if (newPhoneNumber){
        if (typeof newPhoneNumber != "string"){
            res.status(400).jsend.fail({
                message: "newPhoneNumber must be string",
                statusCode: 400,
            });
            return;
        }
    
        if (newPhoneNumber.length < 3 || newPhoneNumber.length > 8){
            return res.status(400).jsend.fail({
                message: "newPhoneNumber length must be between 3 and 8",
                statusCode: 400,
            });  
        }
    }
    next()

    }
}