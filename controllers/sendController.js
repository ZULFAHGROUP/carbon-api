const WalletModel = require('../models/walletModel')
const { credit,  getWalletBalance } = require('./walletController')


//User_id, wallet_id, Amount and bank needed for transaction 

const UserTopUp = async (amount, user_id, bank_id) => {

    // find bank account using bank_id 
    // verify user bank account has enough balance
    //check account status of bank account from paystack 
    //if amount in bank account is less than amount for top up, something went wrong, sorry cannot complete tansaction at this point

// credit (topUp) wallet using wallet_id with amount passed in
   credit(amount, user_id, `Wallet top up from bank`)

// debit bank using bank_id
   //debit(amount, user_id, bank_id, `funds for wallet to up`)


}



module.exports = {sendMoney}



//Get user from bank table  and the wallet table using the user_id 
//Get the wallet+id from wallet table
//Bank_id from selected bank table