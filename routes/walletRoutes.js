const express = require('express')
const router = express.Router()
const { startWalletFunding, completeWalletFunding,getWalletBalance,walletBalance, sendMoney } = require('../controllers/walletController')
const authorization  = require('../middleware/authorization')

//create user routes
router.post('/start', startWalletFunding)

router.post('/complete', completeWalletFunding)
router.get('/get-balance', getWalletBalance)
router.post('/send-money', sendMoney )
router.get('/wallet_balance', walletBalance)





module.exports = router