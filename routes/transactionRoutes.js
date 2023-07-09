const express = require('express')
const router = express.Router()
 const{dailyTransaction, weeklyTransaction, monthlyTransaction} = require('../controllers/transactionController');
 router.get('/daily', dailyTransaction);
router.get('/weekly', weeklyTransaction)
router.get('/monthly',monthlyTransaction)

module.exports = router