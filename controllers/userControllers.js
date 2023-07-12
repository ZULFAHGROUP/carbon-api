const { registerMessage, userExists, loginMessage, invalidOtp } = require('../constants/messages')
const UserModel = require('../models/userModels')
const OtpModel = require('../models/otpModel')
const WalletModel = require('../models/walletModel')
const { validateCreateAccount } = require('../validations/userValidations')
const validateUpdateUser = require('../validations/updateUserValidations')
const { Op } = require("sequelize");
const { hashPassword, generateOtp, comparePassword } = require('../utils/helpers')
const { OtpEnum } = require('../constants/enums')
const { v4: uuidv4 } = require('uuid');
const { sendSms } = require('../services/sms')
const { sendEmail } = require('../services/email')
const { credit } = require('./walletController')
const createUser = async (req, res) => {
    //create user
    const { error } = validateCreateAccount(req.body)
    if (error !== undefined) {
        res.status(400).json({
            status: true,
            message: error.details[0].message || "Bad request"
        })
        return
    }

    try {

        const { surname, othernames, gender, phone,  dob, email, password } = req.body
        const checkIfUserExist = await UserModel.findAll({
                                     attributes: ['email', 'phone'],
                                     where: {
                                         [Op.or]: [
                                             { email: email },
                                             { phone: phone }
                                         ]
                                     }
        });

        if(checkIfUserExist.length > 0) {
            res.status(400).json({
                status: false,
                message: userExists
            })
            return
        }

        const { hash, salt } = await hashPassword(password)
        // delete req.body.password 
        // req.body.password_hash = hash
        // req.body.password_salt = salt
        // req.body.user_id = uuidv4()
        // await UserModel.create(req.body)
        const userID = uuidv4()
        await UserModel.create({
            user_id: userID,
            surname: surname,
            othernames: othernames,
            gender: gender,
            phone: phone,
            dob: dob,
            email: email,
            password_hash: hash,
            password_salt : salt
            

        })
        //create wallet
        await WalletModel.create({
            wallet_id: uuidv4(),
            user_id: userID,
        })

        //give them 1000 on signup
        credit(200, userID, `Wallet funding for signup credits`)

        const _otp = generateOtp(6)
        const dataToInsert = {
            otp_id: uuidv4(),
            email_or_phone: email,
            otp: _otp //our magical otp generator
        }
    
        await OtpModel.create(dataToInsert)

        //send as sms
        //send as email
        sendEmail(email, "OTP", `Hi ${surname}, your otp is ${_otp}`)


        res.status(201).json({
            status: true,
            message: registerMessage
        })

        
    }catch(error) {
        res.status(500).json({
            status: false,
            message:  error.message || "Internal server error"
        })
    }
  



    
}

const verifyUserAccount = async (req, res) => { 

    const { otp, email } = req.params
    if (!otp || !email) { 
        res.status(400).json({
            status: false,
            message: "Bad request"
        })
        return
    }
    try {
        
        const otpData = await OtpModel.findOne({
            where: {
                email_or_phone: email,
                otp: otp,
                otp_type: OtpEnum.REGISTRATION
            }
        })
        if (!otpData) { 
            res.status(400).json({
                status: false,
                message: invalidOtp
            })
            return
        }
    //check if otp has expired
        
        await UserModel.update({
            isOtpVerified: true
        }, {
            where: {
               email: email
            }
        })

        await OtpModel.destroy({
            where: {
                email_or_phone: email,
                otp_type: OtpEnum.REGISTRATION
            }
        })

        res.status(200).json({
            status: true,
            message: "Account verified successfully"
        })
        return 
    }catch(error) {
        res.status(500).json({
            status: false,
            message:  error.message || "Internal server error"
        })
    }


}

const getUserDetails = async(req, res) => {
    const { user_id } = req.params
    if (!user_id) { 
        res.status(400).json({
            status: false,
            message: "Bad request"
        })
        return
    }
   try{
    const user = await UserModel.findOne({
        attributes: ['othernames','surname','email', 'dob', 'marital_status', 'gender', 'phone'],
        where: { 
            user_id: user_id
        }
    })
    if (!user) { 
            res.status(400).json({
            status: false,
            message: "User not found"
            })
            return
    }
    res.status(200).json({
        status: true,
        data: user
    })
    return
   }catch(error){
    res.status(500).json({
        status: false,
        message:  error.message || "Internal server error"
    })
   }
}


const updateUserProfile = async(req, res) => {
    const {user_id} = req.params
    if(!user_id){
        return res.status(400).json({
            status: false,
            message: "bad request"
        })
    }
    ///use joi to validate the request body
    const { error } = validateUpdateUser(req.body)
    if (error !== undefined) {
        res.status(400).json({
            status: false,
            message: error.details[0].message || "Bad request"
        })
        return
    }
    try{
        await UserModel.update(
            req.body, {
                where: {
                    user_id: user_id
                }
            })

            res.status(200).json({
                status: true,
                message: "user profile updated successfully"
            })
            return
    }catch(error){
        res.status(500).json({
            status: false,
            message:  error.message || "Internal server error"
        })
    }
}

const userLogin = async(req, res) => {
    //login user
    const { email, password } = req.body
    try {
   
        if (!email || !password) throw new Error("All fields are required")
        const checkIfUserExists = await UserModel.findOne({ where: { email: email } })
        if (checkIfUserExists == null) throw new Error("Invalid email or password")
        let payload
        let accessToken

        const dataToaddInMyPayload = {
			email: checkIfUserExists.email,
			_id: uuidv4(),
		}

		const compareHash = await bcrypt.compare(password, checkIfUserExists.password_hash)
        if (!compareHash) throw new Error("Invalid email or password")
        if (!checkIfUserExists.isOtpVerified) throw new Error("Account not verified")
        const token = await jwt.sign(dataToaddInMyPayload, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.status(200).json({
        status: true,
        message: loginMessage,
        token: token

    })
    } catch (error) {
        res.status(400).json({
            status: false,
            message:  error.message || "Internal server error"
        })
        
    }
   
	
}


module.exports = {
    createUser,
    userLogin,
    verifyUserAccount,
    getUserDetails,
    updateUserProfile
}