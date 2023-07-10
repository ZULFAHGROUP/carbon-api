const express = require('express')
const router = express.Router()
const { utilityPayment, BillLog } = require('../controllers/billControllers')

//create airtime and data routes


router.post('/utilitybill', utilityPayment)

router.post('/billhistory', BillLog)




module.exports = router