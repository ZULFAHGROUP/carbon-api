
const {walletBalance, transaction} = require('./walletController')
const { v4: uuidv4 } = require('uuid');
const {validateUtility, validateBillHistory}= require('../validations/billsValidation')

const BillModel = require('../models/billModel');
const { validateUtility } = require('../validations/billsValidation');

// Function to purchase a utility bill
// utility billerId for some Nigerian Electricity Disco brands
// order : Eko id=3, Ikeja id= 5, Abuja=6, Ibadan=8
const utilityFunc =async(request, result)=>{

    const { error } = validateUtility(req.body)
    if (error !== undefined) {
        res.status(400).json({
            status: true,
            message: error.details[0].message || "Bad request"
        })
        return
    }
    const { amount, billerName, subscriberAccountNumber } = await request.body
    if (!amount || !billerName || !subscriberAccountNumber || !phoneNumber) { 
        res.status(400).json({
            status: false,
            message: "All fields are required"
        })
        return
    }

    const checkWallet = await walletBalance.balance
    if(checkWallet < amount){
        res.status(400).json({
            status: false,
            message:"Insufficient balance"
        })
    }

    if(phoneNumber.length<11){
        res.status(400).json({
            status: false,
            message:"Incorrect number",
            
        })
    }
    const userID= await transaction(user_id);
    const newWalletBalance = checkWallet - amount;
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
    res.status(200).json({
        status: true,
        message: "The bill data is saved",
    })

    if(result.finalStatusAvailabilityAt){

        res.status(200).json({
            status: true,
            message: "The bill data is saved",
        })
    }



}


const BillLog =async()=>{
    const { error } = validateUtility(req.body)
    if (error !== undefined) {
        res.status(400).json({
            status: true,
            message: error.details[0].message || "Bad request"
        })
        return
    }
    await BillHistory.create({
        biller_id: billerId,
        bill_amount:amount,
        utility_date: Date.now(),
    
    })
   
}
    


module.exports ={
    utilityFunc,
    BillLog

}


