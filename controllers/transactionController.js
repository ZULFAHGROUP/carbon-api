const { Op } = require("sequelize");
const moment = require('moment'); // require
const transactionModel = require("../models/transactionModel");
const { TransactionTypeEnum } = require("../constants/enums");
const {getTodaysDate} = require('../utils/helpers')
const {errorFetchingTransactions, dailytransactionLogMessage,
   weeklytransactionLogMessage,monthlytransactionLogMessage} = require("../constants/messages");
const getTransactions = async (req, res) => {
  try {
    const { page } = req.query;
    const limit = 5;
    const pages = page - 1 || 0;
    const offset = pages * limit;

    const getAllTransactions = await transactionModel.findAll({
      order: [["sn"]],
      limit: limit,
      offset: offset,
    });

    res.status(200).json({
      status: true,
      message: "Transaction logged successfully",
      data: getAllTransactions,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};



const filterTransactionsWithDate = async (req, res) => {
  try {
    // const {start_date, end_date} = req.body;

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(404).json({
        status: false,
        message: "Fill or fields",
      });
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);

    const getAllTransactionsViaDate = await transactionModel.findAll(
      {
        where: {
          createdAt: { [Op.between]: [start, end] },
        },
        order: [["sn"]],
      }
      // {limit:5}
    );
    if (getAllTransactionsViaDate.length < 1) {
      res.status(401).json({
        status: false,
        message: "No transactions during this period.",
      });
      return;
    }

    res.status(200).json({
      status: true,
      message: "Transaction logged successfully",
      data: getAllTransactionsViaDate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const filterTransaction = async (req, res) => {
  try {
    const { filter_by } = req.query;
    let amount = filter_by;

    if (filter_by === transactionTypeEnum.CREDIT) {
      const creditTransactions = await transactionModel.findAll({
        where: {
          transaction_type: transactionTypeEnum.CREDIT,
        },
        order: [["sn"]],
      });
      if (creditTransactions.length < 1) {
        res.status(401).json({
          status: false,
          message: "No credit transaction.",
        });
        return;
      }
      res.status(200).json({
        status: true,
        message: "All credit transactions logged successfully",
        data: creditTransactions,
      });
    } else if (filter_by === transactionTypeEnum.DEBIT) {
      const debitTransactions = await transactionModel.findAll({
        where: {
          transaction_type: transactionTypeEnum.DEBIT,
        },
        order: [["sn"]],
      });
      if (debitTransactions.length < 1) {
        res.status(401).json({
          status: false,
          message: "No credit transaction.",
        });
        return;
      }
      res.status(200).json({
        status: true,
        message: "All debit transactions logged successfully",
        data: debitTransactions,
      });
    } else if (filter_by === amount) {
      const transactionAmount = await transactionModel.findAll({
        where: {
          amount: amount,
        },
        order: [["sn"]],
      });
      if (transactionAmount.length < 1) {
        res.status(401).json({
          status: false,
          message: "No transaction.",
        });
        return;
      }
      res.status(200).json({
        status: true,
        message: "All credit transactions logged successfully",
        data: transactionAmount,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const transactionSum = (array)=>{
  const initialValue = 0;
  const sumWithInitial = array.reduce((accumulator, currentValue) => accumulator + currentValue.amount, initialValue )
   return sumWithInitial
}

const getTrasactionAmountFromDB = async (user_id, dateDuration, transaction_type) => {

   const transactions = await transactionModel.findAll({
      attributes: [ "amount" ],
      where: {
        user_id: user_id,
        createdAt: {
          [Op.between]: dateDuration
        },
        transaction_type: transaction_type
      }

    });

    return transactions;
  }

    

const dailyTransaction = async (req, res) => {
   const { user_id } = req.body;

   try{

    const todayDate = [getTodaysDate(), getTodaysDate()];
    console.log(`today's date here: ${todayDate}`);
    
    const userCreditTransactions = await getTrasactionAmountFromDB (user_id, todayDate, TransactionTypeEnum.CREDIT);
    const userDebitTransactions =await getTrasactionAmountFromDB(user_id, todayDate, TransactionTypeEnum.DEBIT);
     
    //[{ amount: 100 }, { amount: 200}, { amount: 300}]

    if (!userCreditTransactions ||!userDebitTransactions ) throw new Error(errorFetchingTransactions, 400);
   
    const creditTransactions = await transactionSum(userCreditTransactions);

    const debitTransactions = await transactionSum(userDebitTransactions);

    const totalTransactions = Number(creditTransactions + debitTransactions);

  res.status(200).json({
    status: true,
    totalDailyCreditAmount: creditTransactions,
    totalDailyDebitAmount: debitTransactions,
    totalDailyTransactionAmount: totalTransactions,
    message: dailytransactionLogMessage,
  });

} catch (error) {
  
    res.status(500).json({
      status: false,
      message: error.message,
    });
   }
  
  };

const weeklyTransaction = async (req, res) => {
  const { user_id } = req.body;

   try{

    const todayDate = getTodaysDate()
    const weeklyDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
    const dateRange = [weeklyDate, todayDate];
    console.log(`weeklydate here: ${weeklyDate}`);
    console.log(`todaydate heree: ${todayDate}`);
    
    const userCreditTransactions = await getTrasactionAmountFromDB (user_id, dateRange, TransactionTypeEnum.CREDIT);
    console.log(`weekly userCredits here:  ${userCreditTransactions}`);

    const userDebitTransactions =await getTrasactionAmountFromDB(user_id, dateRange, TransactionTypeEnum.DEBIT);
    
         //[{ amount: 100 }, { amount: 200}, { amount: 300}]

    if (!userCreditTransactions ||!userDebitTransactions ) throw new Error(errorFetchingTransactions, 400);
   
    const creditTransactions = await transactionSum(userCreditTransactions);

    const debitTransactions = await transactionSum(userDebitTransactions);

    const totalTransactions = Number(creditTransactions + debitTransactions);

  res.status(200).json({
    status: true,
    totalWeeklyCreditAmount: creditTransactions,
    totalWeeklyDebitAmount: debitTransactions,
    totalWeeklyTransactionAmount: totalTransactions,
    message: weeklytransactionLogMessage,
  });

} catch (error) {
  
    res.status(500).json({
      status: false,
      message: error.message,
    });
   }
};

const monthlyTransaction = async (req, res) => {
  const { user_id } = req.body;

   try{

    const todayDate = getTodaysDate()
    const monthlylyDate = moment().subtract(1, 'months').format('YYYY-MM-DD');
    const dateRange = [monthlylyDate, todayDate];
    console.log(`today's date here: ${todayDate}`);
    console.log(`Monthlydate here: ${monthlylyDate}`);
    
    const userCreditTransactions = await getTrasactionAmountFromDB (user_id, dateRange, TransactionTypeEnum.CREDIT);
    console.log(`monthly userCredits here:  ${userCreditTransactions}`);

    const userDebitTransactions =await getTrasactionAmountFromDB(user_id, dateRange, TransactionTypeEnum.DEBIT);
    
         //[{ amount: 100 }, { amount: 200}, { amount: 300}]

    if (!userCreditTransactions ||!userDebitTransactions ) throw new Error(errorFetchingTransactions, 400);
   
    const creditTransactions = await transactionSum(userCreditTransactions);

    const debitTransactions = await transactionSum(userDebitTransactions);

    const totalTransactions = Number(creditTransactions + debitTransactions);

  res.status(200).json({
    status: true,
    totalMonthlyCreditAmount: creditTransactions,
    totalMonthlyDebitAmount: debitTransactions,
    totalMonthlyTransactionAmount: totalTransactions,
    message: monthlytransactionLogMessage
  });

} catch (error) {
  
    res.status(500).json({
      status: false,
      message: error.message,
    });
   }
};




const getUserTransaction = (user_id) => {
  return transactionModel.findAll({
    where: {
      user_id: user_id,
    },
  });
};

module.exports = {
  getTransactions,
  filterTransaction,
  filterTransactionsWithDate,
  dailyTransaction,
  weeklyTransaction,
  monthlyTransaction
};
