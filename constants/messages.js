const { walletBalance } = require("../controllers/walletController");

const messages = {
    loginMessage: "User logged-in successfully",
    registerMessage: "Guy, Your account has been created successfully, an otp has been sent to your email",
    userExists: "User with the Phone/Email exists",
    notFoundMessage: "What you seek is beyond this globe",
    invalidOtp :  "Invalid otp",
    walletBalanceMessage : "wallet balance fetched successfully",
    errorBalancemessage: "Error fetching wallet balance",
    errorSendMoneyMessage : "invalid amount or phone",
    errorSendMoneyMessageLimit : "your transfer limit has been exceeded",
    sendMoneyErrorRecipientDetails : "user not found",
    userWalletDetailsError : "insufficient balance. Please top-up your wallet",
    receipientSuccessmessage: "Transaction completed successfully"
 
    
}

module.exports = messages;