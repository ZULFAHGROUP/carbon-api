const { credit } = require("./walletController");
const { v4: uuidv4 } = require("uuid");
const { startPayment, completePayment } = require("../services/payment");
const cardModel = require("../models/cardModel");
const userModel = require("../models/userModels");
const {validateAddCard,validateFindCard,validateDeleteCard,} = require("../validations/CardValidations");
const { Op } = require("sequelize");
const logger = require("../utils/logger");

const startAddCard = async (req, res) => {
  try {
    const { error } = validateAddCard(req.body);
    if (error !== undefined) {
      throw new Error(error.details[0].message, 400);
    }
    const { amount, email } = req.body;

    const CheckIfUserIsRegistered = await userModel.findOne({
      where: { email: email },
    });
    if (!CheckIfUserIsRegistered) {
      throw new Error("User not registered", 400);
    }

    const initializeCardTransaction = await startPayment(amount, email);
    if (!initializeCardTransaction.data.status) {
      throw new Error("Invalid transaction", 500);
    }
    delete initializeCardTransaction.data.data.access_code;
    logger(email, true, "User initiated transaction").then(() => {
      res.status(200).json(initializeCardTransaction.data);
    });
  } catch (err) {
    res.json({
      status: false,
      message: err.message,
    });
  }
};

const completeAddCard = async (req, res) => {
  try {
    const ref = req.body.reference;
    const completeCardTransaction = await completePayment(ref);
    if (!completeCardTransaction.data.status) {
      throw new Error("Transaction incomplete");
    }

    const { status, authorization, customer, amount } =
      completeCardTransaction.data.data;
    if (status !== "success") {
      throw new Error("Unable to complete card transaction");
    }

    const checkIfCardExist = await cardModel.findOne({
      where: {
        authorization_code: authorization.authorization_code,
      },
    });
    if (checkIfCardExist) {
      throw new Error("Card already exists");
    }
    const findUserId = await userModel.findOne({
      attributes: ["user_id"],
      where: {
        email: customer.email,
      },
    });
    if (!findUserId.dataValues.user_id) {
      throw new Error("User not found");
    }
    const amountInNaira = amount / 100;
    const comments = `Wallet funding of ${amountInNaira} was successful`;
    //await credit(amountInNaira,findUserId.dataValues.user_id,comments)

    await cardModel.create({
      card_id: uuidv4(),
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone: customer.phone,
      account_name: authorization.account,
      last4: authorization.last4,
      exp_month: authorization.exp_month,
      exp_year: authorization.exp_year,
      card_type: authorization.card_type,
      brand: authorization.brand,
      bank: authorization.bank,
      authorization_code: authorization.authorization_code,
    });
    res.status(200).json({
      status: true,
      message: "Card added successfully",
    });
    return;
  } catch (err) {
    res.json({
      status: false,
      message: err.message,
    });
  }
};

const findCard = async (req, res) => {
  try {
    const { email } = req.body;
    const { error } = validateFindCard(req.body);
    if (error !== undefined) {
      throw new Error(error.details[0].message, 400);
    }
    const cardsFound = await cardModel.findAll({
      where: {
        email: email,
      },
    });
    if (cardsFound.length === 0) {
      throw new Error("Card not found");
    }
    res.status(200).json({
      status: true,
      data: cardsFound,
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      message: e.message,
    });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { error } = validateDeleteCard(req.body);
    if (error !== undefined) {
      throw new Error(error.details[0].message, 400);
    }
    const { email, authorization_code } = req.body;
    const cardsFound = await cardModel.findAll({
      where: {
        [Op.and]: [{ email }, { authorization_code }],
      },
    });
    if (cardsFound.length === 0) {
      throw new Error("Card not found");
    }

    await cardModel.destroy({
      where: {
        [Op.and]: [{ email }, { authorization_code }],
      },
    });
    res.status(200).json({
      status: true,
      message: "card deleted",
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      message: e.message,
    });
  }
};

module.exports = { startAddCard, completeAddCard, findCard, deleteCard };
