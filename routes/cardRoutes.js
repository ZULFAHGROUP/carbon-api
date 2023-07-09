const express = require('express')
const router = express.Router()
const {startAddCard, completeAddCard, findCard, deleteCard} = require('../controllers/cardControllers')


router.post('/addCard/start', startAddCard)
router.post('/addCard/complete', completeAddCard)
router.get('/findCard', findCard)
router.delete('/delete', deleteCard)

module.exports = router