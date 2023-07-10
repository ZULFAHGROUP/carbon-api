const { Op } = require("sequelize");
const transactionModel = require("../models/transactionModel");
const { TransactionTypeEnum } = require("../constants/enums");
const {getTodaysDate} = require('../utils/helpers')
const {errorFetchingTransactions, transactionLogMessage} = require("../constants/messages");
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

const dailyTransaction = async (req, res) => {
   const { user_id } = req.body;

   try{
   
    const todayDate = getTodaysDate();
    const userCreditTransactionsFromDB = await transactionModel.findAll({
      attributes: [ "amount" ],
      where: {
        user_id: user_id,
        createdAt: todayDate,
        transaction_type: TransactionTypeEnum.CREDIT
      }
      
    });

    const userDebitTransactionsFromDB = await transactionModel.findAll({
          attributes: [ "amount" ],
          where: {
            user_id: user_id,
            createdAt: todayDate,
            transaction_type: TransactionTypeEnum.DEBIT
          }
          
        });
         //[{ amount: 100 }, { amount: 200}, { amount: 300}]

    if (!userCreditTransactionsFromDB ||!userDebitTransactionsFromDB ) throw new Error(errorFetchingTransactions, 400);
   
    const creditTransactions = await transactionSum(userCreditTransactionsFromDB);

    const debitTransactions = await transactionSum(userDebitTransactionsFromDB);

    const totalTransactions = creditTransactions + debitTransactions;

  res.status(200).json({
    status: true,
    totalCreditAmount: creditTransactions,
    totalDebitAmount: debitTransactions,
    totalTransactionAmount: totalTransactions,
    message: transactionLogMessage,
  });

} catch (error) {
  
    res.status(500).json({
      status: false,
      message: error.message,
    });
   }
  
  };

const weeklyTransaction = (req, res) => {
  const { transactionType } = req.query;
  const { user_id } = req.body;

  res.json({
    status: true,
    credit: creditTransactions,
    debit: debitTransactions,
    message: "daily transaction logged successfully",
  });
};
const monthlyTransaction = async (req, res) => {
  const { transactionType } = req.query;
  const { user_id } = req.body;

  res.json({
    status: true,
    credit: creditTransactions,
    debit: debitTransactions,
    message: "daily transaction logged successfully",
  });
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
  monthlyTransaction,
};
