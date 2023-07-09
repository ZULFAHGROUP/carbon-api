const WalletModel = require("../models/walletModel");
const UserModel = require("../models/userModels");
const transactionModel = require("../models/transactionModel");
const {
  TransactionStatusEnum,
  TransactionTypeEnum,
} = require("../constants/enums");
const { v4: uuidv4 } = require("uuid");
const { startPayment, completePayment } = require("../services/payment");
const {messages,walletBalanceMessage,
errorBalancemessage,
errorSendMoneyMessage ,
errorSendMoneyMessageLimit,
sendMoneyErrorRecipientDetails,
userWalletDetailsError ,
receipientSuccessmessage} = require("../constants/messages");
const credit = async (amountPassed, user_id, comments) => {
  const amount = Math.abs(Number(amountPassed));
  const userDetails = await getUserWallet(user_id);
  const initialbalance = Number(userDetails.amount_after);
  const newbalance = initialbalance + amount; //amount_after
  await updateWallet(user_id, initialbalance, newbalance);
  transaction(
    TransactionTypeEnum.CREDIT,
    comments,
    amount,
    userDetails.user_id,
    TransactionStatusEnum.SUCCESS
  );
  return;
};

const debit = async (amountPassed, user_id, comments) => {
  const amount = Math.abs(Number(amountPassed));
  const userDetails = await getUserWallet(user_id);
  const initialbalance = Number(userDetails.amount_after);
  if (initialbalance < amount) return false;
  const newbalance = initialbalance - amount; //amount_after
  await updateWallet(user_id, initialbalance, newbalance);
  transaction(
    TransactionTypeEnum.DEBIT,
    comments,
    amount,
    userDetails.user_id,
    TransactionStatusEnum.SUCCESS
  );
  return true;
};

const transaction = (
  type,
  description,
  amount,
  user_id,
  transaction_status
) => {
  return transactionModel.create({
    transaction_id: uuidv4(),
    user_id: user_id,
    transaction_type: type,
    amount: amount,
    comments: description,
    transaction_status: transaction_status,
  });
};

const getUserWallet = (user_id) => {
  return WalletModel.findOne({
    where: {
      user_id: user_id,
    },
  });
};

const updateWallet = (user_id, initial, after) => {
  return WalletModel.update(
    {
      amount_before: initial,
      amount_after: after,
    },
    {
      where: {
        user_id: user_id,
      },
    }
  );
};

const startWalletFunding = async (req, res) => {
  const { amount, email } = req.body;
  if (!amount || !email) {
    res.status(400).json({
      status: false,
      message: "Amount and email are required",
    });
    return;
  }

  const initialiseTransaction = await startPayment(amount, email);
  delete initialiseTransaction.data.data.access_code;
  res.status(200).json({
    status: true,
    message: "Transaction initialized successfully",
    data: initialiseTransaction.data.data,
  });
};

const completeWalletFunding = async (req, res) => {
  const { reference, user_id } = req.body;
  if (!reference || !user_id) {
    res.status(400).json({
      status: false,
      message: "All fields are required",
    });
    return;
  }
  const completeTransaction = await completePayment(reference);
  if (completeTransaction.data.data.status != "success") {
    res.status(400).json({
      status: false,
      message: "Invalid transaction reference",
    });
  }
  const amountInNaira = completeTransaction.data.data.amount / 100;
  const comments = `Wallet funding of ${amountInNaira} was successful`;
  credit(amountInNaira, user_id, comments);
  res.status(200).json({
    status: true,
    message: "Your Wallet has been funded successfully",
  });
};
const getWalletBalance = async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const getWallet = await getUserWallet(user_id);
    const walletBalance = getWallet.amount_after;
    return res.json({
      status: true,
      balance: walletBalance,
      message: walletBalanceMessage,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: errorBalancemessage,
    });
  }
};
const sendMoney = async (req, res) => {
  let { amount, phone, user_id } = req.body;

  try {
    const minimumWithdrawal = 100;
    if (!phone || !amount || isNaN(amount) || amount <= minimumWithdrawal)
      throw new Error(errorSendMoneyMessage, 400);
    amount = Math.abs(Number(amount));
    const maximumWithdrawal = 50000;
    if (amount > maximumWithdrawal)
      throw new Error(errorSendMoneyMessageLimit, 400);

    const userDetails = await getUserDetails(user_id);
    const userWalletDetails = await getUserWallet(user_id);
    const recipientDetails = await getUserWithPhone(phone);
    if (!recipientDetails) throw new Error(sendMoneyErrorRecipientDetails, 400);
    if (userWalletDetails.amount_after < amount)
      throw new Error(userWalletDetailsError, 400);

    const receipientUserID = recipientDetails.user_id;
    const debitComments = `you have successfully tranferred ${amount} to ${recipientDetails.surname} ${recipientDetails.othernames}`;
    await debit(amount, user_id, debitComments);
    const creditComments = `your account has been credited with ${amount} from ${userDetails.surname} ${userDetails.othernames}`;
    await credit(amount, receipientUserID, creditComments);
    return res.json({
      status: true,
      message: receipientSuccessmessage,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: error.message,
    });
  }
};
const getUserDetails = (user_id) => {
  return UserModel.findOne({
    where: {
      user_id: user_id,
    },
  });
};
const getUserWithPhone = async (phone) => {
  return UserModel.findOne({
    where: {
      phone: phone,
    },
  });
};

const walletBalance = async (fullname, balance, date) => {
  const userSurname = await UserModel.surname;
  const userOthernames = await UserModel.othernames;
  fullname = userSurname + userOthernames;
  const userBalance = await updateWallet(user_id, initial, after);
  balance = userBalance.amount_after;
  const presentDate = Date.now();
  date = presentDate;
  return;
};

module.exports = {
  credit,
  debit,
  transaction,
  startWalletFunding,
  completeWalletFunding,
  getWalletBalance,
  sendMoney,
  walletBalance,
};
