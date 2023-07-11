const express = require('express')
const router = express.Router()
const logger = require('../controllers/loggerControllers')



router.get('/logs', logger)


module.exports = router