require('dotenv').config()
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const UserModel = require('../models/userModels')
const { isEmpty } = require('../utils/helpers')

const authorization = async(req, res, next) => {

    const userEmail =  req.params.customerEmail
    if (!userEmail) {
        res.status(401).send({
            status: false,
            message: 'Unauthorized Access'
                    
        })
    } else {

        const userData = await UserModel.findOne({ where: { email: userEmail } })

            if (userData == null) { 
                 res.status(401).send({
                    status: false,
                    message: 'Unauthorized Access'
                            
                 })
                return
            }
        
            req.params.user = userData.user_id
         next()   
    }


}


module.exports = {
    authorization
}

