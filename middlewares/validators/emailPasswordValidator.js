const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                
function emailValidator(req, res, next){
    const { email, password } = req.body

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

    next()
}

module.exports = emailValidator;