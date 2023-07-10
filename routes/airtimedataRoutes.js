const express = require('express')
const router = express.Router()
const { airtime, data } = require('../controllers/airtimedataCollection')

//create airtime and data routes
router.post('/airtime-top-up', airtime)

router.post('/data-top-up', data)

router.get('/operators')


module.exports = router