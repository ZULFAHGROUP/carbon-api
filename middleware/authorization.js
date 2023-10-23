require('dotenv').config()
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || "keep-secret-secure123#"
const UserModel = require('../models/userModels')

const authorization = async(req, res, next) => {
 
    const authorization =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvc2hib25AZ21haWwuY29tIiwiX2lkIjoiMzRhNTBkNGUtMWMwMS00YjAzLTliM2EtYzVjZDc3MGM5NzdjIiwiaWF0IjoxNjk4MDc1NzM1LCJleHAiOjE2OTgxNjIxMzV9.0wdnHf8eN8JOO-Ay5P6kud4fN1QdkL2RF3D2vRO99gE'
    //req.headers

    console.log("authorization", authorization)
    if (!authorization) {
       
        res.status(401).send({
            status: false,
            message: 'Unauthorized Access'
                    
        })
    } else {

        const tokenSplit = authorization.split(" ")
        jwt.verify(tokenSplit[1], jwtSecret, async(err, decoded) => {

            if (err) {
                res.status(401).send({
                    status: false,
                    message: 'Unauthorized Acesss' 
                        
                })
                return 
            }
            const customer =   await UserModel.findOne({ where: { email: decoded.email } })
            if(customer.length === 0 ){
                res.status(401).send({
                    status: false,
                    message: 'Unauthorized Acesss'         
                })
                return 
            }
            req.params.user_id = customer    
            next()   
         
        })
    }


}


module.exports =  authorization