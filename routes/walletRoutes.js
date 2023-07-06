const express = require('express')
const router = express.Router()
const { startWalletFunding, completeWalletFunding } = require('../controllers/walletController')
const {startAddCard, completeAddCard} = require('../controllers/cardControllers')
//create user routes
router.post('/start', startWalletFunding)

router.post('/complete', completeWalletFunding)

router.post('/addCard/start', startAddCard)
router.post('/addCard/complete', completeAddCard)


module.exports = router