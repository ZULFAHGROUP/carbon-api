const WalletModel = require('../models/walletModel')
const transactionModel = require('../models/transactionModel')
const { TransactionStatusEnum, TransactionTypeEnum } = require('../constants/enums')
const { v4: uuidv4 } = require('uuid');
const { startPayment, completePayment } = require('../services/payment')


const credit = async (amountPassed, user_id, comments) => {
    const amount = Number(amountPassed)
    const userDetails = await getUserWallet(user_id)
    const initialbalance = Number(userDetails.amount_after)
    const newbalance = initialbalance + amount  //amount_after
    await updateWallet(user_id, initialbalance, newbalance)
    transaction(TransactionTypeEnum.CREDIT,comments, amount, userDetails.user_id, TransactionStatusEnum.SUCCESS )
    return
}

const debit = async(amountPassed, user_id, comments) => {
    const amount = Number(amountPassed)
    const userDetails = await getUserWallet(user_id)
    const initialbalance = Number(userDetails.amount_after)
    if(initialbalance < amount) return false
    const newbalance = initialbalance - amount  //amount_after
    await updateWallet(user_id, initialbalance, newbalance)
    transaction(TransactionTypeEnum.DEBIT,comments, amount, userDetails.user_id, TransactionStatusEnum.SUCCESS)
    return true
}

const transaction = (type, description, amount, user_id, transaction_status) => { 
    return transactionModel.create({
        transaction_id: uuidv4(),
        user_id: user_id,
        transaction_type: type,
        amount: amount,
        comments: description,
        transaction_status: transaction_status
    })

}

const getUserWallet = (user_id) => {
    return WalletModel.findOne({
        where: {
            user_id: user_id
        }
    })
}

const updateWallet = (user_id, initial, after) =>{ 
    return  WalletModel.update({
        amount_before: initial,
        amount_after: after
    }, {
        where: {
            user_id: user_id
        }
    })
}

const startWalletFunding = async (req, res) => { 
    const { amount, email } = req.body
    if (!amount || !email) {
        res.status(400).json({
            status: false,
            message: "Amount and email are required"
        })
        return
    }

  const initialiseTransaction  = await startPayment(amount, email)
  
  

    delete initialiseTransaction.data.data.access_code
    res.status(200).json({
        status: true,
        message: "Transaction initialized successfully",
        data: initialiseTransaction.data.data

    }) 
}

const completeWalletFunding = async (req, res) => { 

    const { reference, user_id } = req.body
    if (!reference || !user_id) { 
        res.status(400).json({
            status: false,
            message: "All fields are required"
        })
        return
    }
    const completeTransaction = await completePayment(reference)
    if (completeTransaction.data.data.status !="success") { 
        res.status(400).json({
            status: false,
            message: "Invalid transaction reference"
        })
    }
    const amountInNaira = completeTransaction.data.data.amount / 100
    const comments = `Wallet funding of ${amountInNaira} was successful`
    credit(amountInNaira, user_id, comments) 
    res.status(200).json({
        status: true,
        message: "Your Wallet has been funded successfully",
    })
}

module.exports = {
    credit,
    debit,
    transaction,
    startWalletFunding,
    completeWalletFunding
}

