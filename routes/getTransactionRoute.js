const router = require('express').Router();
const {getTransactions, filterTransaction,filterTransactionsWithDate } = require('../controllers/transactionController')

router.get('/transactions-logs', getTransactions );
router.get('/filter-transactions', filterTransaction);
router.get('/filter-transactions-with-date', filterTransactionsWithDate);


module.exports = router;