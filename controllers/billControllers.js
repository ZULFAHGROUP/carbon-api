
const {walletBalance, transaction} = require('./walletController')
const { v4: uuidv4 } = require('uuid');
const { phoneValidation } = require('../utils/helpers')
const BillModel = require('../models/billModel')
const {utilityFunc} = require('../services/bills')

// Function to purchase a utility bill

const utilityPayment =async(req, res)=>{
try{
    let { amount,phoneNumber, billerId, subscriberAccountNumber } = req.body
    const { user_id } = req.params

    phoneNumber = phoneValidation(phoneNumber)  
    if (phoneNumber === false) throw new Error('Invalid phone number', 400);

    if (!amount || !billerId || !subscriberAccountNumber) throw new Error('All fields are required', 400)

    const getWalletBalance = await walletBalance.balance
    if(getWalletBalance < amount) throw new Error('Insufficient balance', 400)

    const userID= await transaction(user_id);
    const newWalletBalance = getWalletBalance - amount;
    const id = uuidv4
    await BillModel.create({
        bill_id: id,
        biller_id: billerId,
        users_id: us,
        utility_phoneNumber: phoneNumber,
        bill_amount:amount,
        subscriber_account_number: subscriberAccountNumber,
        wallet_balance: newWalletBalance,
        utility_date: Date.now(),
    
    })

     // To call the reloadly API function for the payment of utilities
     utilityFunc(amount, billerId, subscriberAccountNumber)
     res.status(200).json({
         status: true,
         message: "Your utility payment has been received",
     })
 
     sendSms(phoneNumber, `${subscriberAccountNumber} ${amount} has been paid to ${billerId}`)

    } catch(err){

        res.status(500).json({
            status: false,
            message: err.message
        })
}  
}

// if(utilityFunc.data.finalStatusAvailabilityAt){
//     res.status(200).json({
//         status: true,
//         message: "The bill data is saved",
//     })
// }

const BillLog =async ()=>{
    await BillHistory.create({
        biller_id: billerId,
        bill_amount:amount,
        utility_date: Date.now(),
    })
}

module.exports ={
    utilityPayment,
    BillLog
}


