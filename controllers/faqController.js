const faqModel = require('../models/faqModel');
const userModel = require('../models/userModels');
const {creatFaqValidations, updateFaqValidations} = require('../validations/faqValidation');
const {v4:uuidv4} = require('uuid');


const getAllFaqs = async (req, res) => {
  try{
    const getAllFaqs = await faqModel.findAll({
      order:[['sn']]
    });

  res.status(200).json({
    status: true,
    message: 'All Faqs fetched successfully',
    data: getAllFaqs
  });
  } catch(error){
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
}

const createFaq = async (req, res)=>{
 try{
  creatFaqValidations(req.body);
  if(error !== undefined){
    res.status(401).json({
      status: false,
      message: error.details[0].message
    });
    return;
  };

  const {userId,faq_title,faq_body} = req.body;
  
  const getUser = await userModel.findOne({
    where: {userId: userId}
  });
  if(getUser === null){
    res.status(404).json({
      status: false,
      message: "This user does not exist"
    });
    return;
  };

  const user_Id = getUser.userId;

  const createdFaq = await faqModel.create({
    faq_id: uuidv4(),
    userId: user_Id,
    faq_title: faq_title,
    faq_body: faq_body
  });

  res.status(200).json({
    status: true,
    message: 'Faq created successfully',
    data: createdFaq
  });
 } catch(error){
  console.log(error)
  res.status(500).json({
    status: false,
    message: error.message
  });
 }
};


const updateFaq = async (req,res)=>{
  try{

    updateFaqValidations(req.body)
  if(error !== undefined){
    res.status(401).json({
      status: false,
      message: error.details[0].message
    });
    return;
  };

  const { faq_id,faq_title,faq_body } = req.body;

  const getFaqId = await faqModel.findOne({
    where:{faq_id: faq_id}
  });
  if(getFaqId === null){
    res.status(404).json({
      status: false,
      message: "This faq id does not exist"
    });
    return;
  };
  const faqId = getFaqId.faq_id
  

  const getFaq = await faqModel.update({
    faq_title: faq_title,
    faq_body: faq_body
  },
  {where:{
    faq_id: faqId
  }
  });

  res.status(200).json({
    status: true,
    message: 'Faq updated successfully',
    data: getFaq
  });

  } catch(error){
    res.status(500).json({
      status: false,
      message: error.message
    });
  };

};

const deleteFaq = async (req, res) => {
  try{
    const {faq_id} = req.params
  if(!faq_id){
    res.status(404).json({
      status: false,
      message: 'Faq id required.'
    });
    return;
  };
  const getFaqId = await faqModel.findOne({
    where:{faq_id: faq_id}
  });
  if(getFaqId === null){
    res.status(404).json({
      status: false,
      message: "This faq id does not exist"
    });
    return;
  };
  const faqId = getFaqId.faq_id

  await faqModel.destroy({
    where: {
      faq_id: faq_id
    }
  });
  res.status(200).json({
    status: true,
    message: "Faq was successfully deleted."
  });
  }catch(error){
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

module.exports = {getAllFaqs, createFaq, updateFaq, deleteFaq};

// await User.destroy({
//   where: {
//     firstName: "Jane"
//   }
// });