const express = require('express')
const router = express.Router()
const { createUser, userLogin, verifyUserAccount, getUserDetails, updateUserProfile} = require('../controllers/userControllers')

//create user routes
router.post('/register', createUser)


router.patch('/verify/:otp/:email', verifyUserAccount)

router.post('/login', userLogin)
router.get('/userProfile/:user_id', getUserDetails)
router.patch('/updateUser/:user_id', updateUserProfile)


module.exports = router