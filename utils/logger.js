const loggerModel = require("../models/loggerModel");

const logger = async (email, status, message) => {
  try {
    //validation
    if (!message || !status || !email) {
      throw new Error("supply all required info");
    }

    await loggerModel.create({
      email,
      message,
      status,
    });

    return;
  } catch (error) {}
};

module.exports = logger;
