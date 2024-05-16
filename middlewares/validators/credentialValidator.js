const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


function credentialValidator(req, res, next){
    const { firstName, lastName, username, email, password, address, phoneNumber } = req.body
    

    // Name
    if (!firstName){
        res.status(400).jsend.fail({
            message: "firstName must be provided",
            statusCode: 400,
        });
        return;
    }

    if (typeof firstName != "string"){
        res.status(400).jsend.fail({
            message: "firstName must be string",
            statusCode: 400,
        });
        return;
    }


    if (!lastName){
        res.status(400).jsend.fail({
            message: "lastName must be provided",
            statusCode: 400,
        });
        return;
    }

    if (typeof lastName != "string"){
        res.status(400).jsend.fail({
            message: "lastName must be string",
            statusCode: 400,
        });
        return;
    }


    // email
    if (!email ) {
        res.status(400).jsend.fail({
            message: "email must be provided",
            statusCode: 400,
        });
        return;
    }

    if (!emailPattern.test(email)){
        res.status(400).jsend.fail({
            message: "email is not valid",
            statusCode: 400,
        });
        return;
    }

    // username
    if (!username){
        res.status(400).jsend.fail({
            message: "username must be provided",
            statusCode: 400,
        });
        return;
    }

    if (typeof username != "string"){
        res.status(400).jsend.fail({
            message: "username must be string",
            statusCode: 400,
        });
        return;
    }

    // password
    if (!password){
        res.status(400).jsend.fail({
            message: "password must be provided",
            statusCode: 400,
        });
        return;
    }

    if (typeof password != "string"){
        res.status(400).jsend.fail({
            message: "password must be string",
            statusCode: 400,
        });
        return;
    }

    // phoneNumber
    if (!phoneNumber){
        res.status(400).jsend.fail({
            message: "phoneNumber must be provided",
            statusCode: 400,
        });
        return;
    }

    if (typeof phoneNumber != "string"){
        res.status(400).jsend.fail({
            message: "phoneNumber must be string",
            statusCode: 400,
        });
        return;
    }

    if (phoneNumber.length < 3 || phoneNumber.length > 8){
        return res.status(400).jsend.fail({
            message: "phoneNumber length must be between 3 and 8",
            statusCode: 400,
        });  
    }


    // address
    if (!address){
        res.status(400).jsend.fail({
            message: "address must be provided",
            statusCode: 400,
        });
        return;
    }

    if (typeof address != "string"){
        res.status(400).jsend.fail({
            message: "address must be string",
            statusCode: 400,
        });
        return;
    }
    next()
}


module.exports = credentialValidator;