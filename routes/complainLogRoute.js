const routes = require('express').Router();
const compliantLog = require('../controllers/compliantController');

routes.post('/complains', compliantLog );

module.exports = routes;