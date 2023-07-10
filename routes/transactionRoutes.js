const express = require('express')
const router = express.Router()
    const{dailyTransaction, weeklyTransaction, monthlyTransaction} = require('../controllers/transactionController');
    router.post('/daily', dailyTransaction);
    router.post('/weekly', weeklyTransaction)
    router.post('/monthly',monthlyTransaction)

module.exports = router