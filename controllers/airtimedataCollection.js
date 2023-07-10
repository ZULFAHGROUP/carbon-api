
const {walletBalance, transaction} = require('./walletController')
const {rechargeFunc} = require('../services/bills')
const { sendSms } = require('../services/sms')
const { v4: uuidv4 } = require('uuid');
const { phoneValidation } = require('../utils/helpers')
const {AirtimeModel, DataModel} = require('../models/airtimedatamodel')



// Function to credit a buyer airtime

const airtime = async (req, res) => {
    try {
    let { newAmount, phoneNumber, operatorID } = req.body
        const { user_id } = req.params
         phoneNumber = phoneValidation(phoneNumber)  
    if (phoneNumber === false) throw new Error('Invalid phone number', 400)

    if (!user_id || !newAmount  || !operatorID) { 
       throw new Error('All fields are required', 400)
    }

    const checkWallet = await walletBalance.balance
    if (checkWallet < newAmount)throw new Error('Insufficient Funds', 400)
    const userID= await transaction(user_id);
    const newWalletBalance = checkWallet - newAmount;
    const airtimeId = uuidv4()
    await AirtimeModel.create({
        airtime_id: airtimeId,
        airtime_type: operatorID,
        airtime_phoneNumber: phoneNumber,
        user_id:userID,
        amount: 0,
        new_amount: newAmount,
        wallet_balance: newWalletBalance,
        airtime_date: Date.now(),
    
    })

    // To call the reloadly API function for buying airtime
    rechargeFunc(newAmount, phoneNumber, operatorID)
    res.status(200).json({
        status: true,
        message: "Airtime has been successfully topped",
    })

    sendSms(phoneNumber, `${phoneNumber} has been recharged with ${amount}`)

    }catch(err){
        res.status(500).json({
            status: false,
            message: err.message
        })
    }  
}

// Function to credit a buyer data

const data =async(req, res)=>{
try{
    let { newAmount, phoneNumber, operatorID } = req.body
    const { user_id } = req.params

    phoneNumber = phoneValidation(phoneNumber)  
    if ( phoneNumber === false ) throw new Error('Invalid phone number', 400)
    
    if ( !newAmount || !operatorID ) throw new Error('All fields are required', 400)
    
    const checkWallet = await walletBalance.balance
    if(checkWallet < newAmount) throw new Error('Insufficient balance', 400)
       
    
    const userID= await transaction(user_id)
    const dataId = uuidv4()
    await DataModel.create({
        data_id: dataId,
        data_type: operatorID,
        data_phoneNumber: phoneNumber,
        user_id:userID,
        data_amount: newAmount,
        data_date: Date.now(),
    
    })

    // To call the reloadly API function for buying data
    rechargeFunc(newAmount, phoneNumber, operatorID)
    res.status(200).json({
        status: true,
        message: "Data has been sucessfully purchased",
    })

    sendSms(phoneNumber, `${phoneNumber} has ${newAmount} worth of data`)
}catch(err){
    res.status(500).json({
        status: false,
        message: err.message
    })
}  
}


module.exports ={
    airtime,
    data
}

