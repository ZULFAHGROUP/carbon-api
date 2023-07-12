require('dotenv').config()
const jwt = require('jsonwebtoken');

const authentication = async(req, res, next) => {

    const { authorization } = req.headers

    if (!authorization) {
        res.status(401).send({
            status: false,
            message: 'Unauthorized Access'
                    
        })
    } else {

        const tokenSplit = authorization.split(" ")
        jwt.verify(tokenSplit[1], process.env.JWT_SECRET, (err, decoded) => {

            if (err) {
                return res.status(401).send({
                    status: false,
                    message: 'Unauthorized Acesss'
                        
                })
            }
            req.params.customerEmail = decoded.email
            next()   
         
        })
    }


}


module.exports = {
    authentication
}

