const complaintModel = require('../models/compliantModel');
const userModel = require('../models/userModels');
const complainValidation = require('../validations/compliantValidation');
const { v4:uuidv4 } = require('uuid')


const complianLog = async (req, res)=>{

  complainValidation(req.body);
  if(error !== undefined){
    res.status(404).json({
      status : false,
      message : error.details[0].message || "Bad request"
    });
    return;
  };

  try{
    const {name, email, message} = req.body;

    const getUser = await userModel.findOne({
      where : {
        email : email
      }
    });

    if(getUser === null){
      res.status(404).json({
        status: false,
        message: "User email is not registered, try again."
      });
      return;
    };
    
    const userId = getUser.userId

    await complaintModel.create({
      complaint_id: uuidv4(),
      userId: userId,
      name: name,
      email: email,
      message: message
    });

    res.status(201).json({
      status: false,
      message: "Complain sent Successfully."
    })

  } catch(error){
    res.status(500).json({
      status : false,
      message : error.message
    });
  };


};

module.exports = complianLog;

