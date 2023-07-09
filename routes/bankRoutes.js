const express = require('express')
const router = express.Router()
const {getbanksList, resolveAccount, createAccount, userBankAccounts, deleteBank} = require('../controllers/bankController')



router.get('/getBanks', getbanksList)
router.get('/getAccountName', resolveAccount)
router.post('/bankAccount/:user_id', createAccount)
router.get('/getAccounts/:user_id', userBankAccounts)
router.delete('/deletebank/:user_id/:bank_id', deleteBank)




module.exports = router