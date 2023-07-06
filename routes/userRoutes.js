const express = require('express')
const router = express.Router()
const { createUser, userLogin, verifyUserAccount } = require('../controllers/userControllers')

//create user routes
router.post('/register', createUser)


router.patch('/verify/:otp/:email', verifyUserAccount)

router.post('/login', userLogin)


module.exports = router