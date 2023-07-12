const express = require('express')
const router = express.Router()
const { createUser, userLogin, verifyUserAccount, getUserDetails, updateUserProfile} = require('../controllers/userControllers')
const { authorization } = require('../middlewares/authorization')
const { authentication } = require('../middlewares/authentication')

//create user routes
router.post('/register', createUser)
router.patch('/verify/:otp/:email', verifyUserAccount)
router.post('/login', userLogin)
router.get('/profile', authentication, authorization, getUserDetails)
router.patch('/profile/update', authentication, authorization,  updateUserProfile)


module.exports = router