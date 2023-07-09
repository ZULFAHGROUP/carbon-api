const express = require('express')
const router = express.Router()
const { startWalletFunding, completeWalletFunding,getWalletBalance,walletBalance, sendMoney } = require('../controllers/walletController')


//create user routes
router.post('/start', startWalletFunding)

router.post('/complete', completeWalletFunding)
router.get('/get-balance/:user_id', getWalletBalance)
router.post('/send-money', sendMoney )
router.get('/wallet_balance', walletBalance)





module.exports = router