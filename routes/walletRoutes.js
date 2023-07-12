const express = require('express')
const router = express.Router()
const { startWalletFunding, completeWalletFunding,getWalletBalance,walletBalance, sendMoney } = require('../controllers/walletController')
const { authentication } = require('../middlewares/authentication')
const { authorization } = require('../middlewares/authorization')


//create user routes
router.post('/start',authentication, authorization, startWalletFunding)
router.post('/complete',authentication, authorization,  completeWalletFunding)
router.get('/balance', authentication, authorization, getWalletBalance)
router.post('/send-money',authentication, authorization,  sendMoney )






module.exports = router