const loggerModel = require("../models/loggerModel");
const validateDetails = require("../validations/loggerValidation");

const logger = async (req, res) => {
  try {
    const { error } = validateDetails(req.body);
    if (error !== undefined) {
      throw new Error(error.details[0].message, 400);
    }
    const { email } = req.body;
    const logsFound = await loggerModel.findAll({
      where: { email },
    });
    if (logsFound.length === 0) {
      throw new Error("Log not found");
    }
    res.status(200).json({
      status: true,
      data: logsFound
    });
    return;
  } catch (e) {
    res.status(500).json({
      status: false,
      data: e.message,
    });
  }
};

module.exports = logger;
