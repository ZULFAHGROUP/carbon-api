const {credit} = require('./walletController');
const { v4: uuidv4 } = require('uuid');
const {startPayment, completePayment} = require('../services/payment');
const cardModel = require('../models/cardModel')

//const addCard = async(req, res)=> {
    //const {amount, email }= req.body

    // validate amount, email


const startAddCard = async (req, res) => {
    const { amount, email } = req.body
    try {
        const CheckIfUserIsRegistered = await userModel.findOne({
            where: {
                email: email
            }
        });
        if (!CheckIfUserIsRegistered) {
            res.status(404).json({
                status: false,
                message: "User is not registered"
            })
            return
        }
    
        const initializeCardTransaction = await startPayment(amount, email);
        if (!initializeCardTransaction.data.status) {
            //throw new Error ('Invalid transaction')
            res.status(400).json({
                status: false,
                message: 'Invalid transaction'
            })
        }

        res.status(200).json(initializeCardTransaction.data)
        
    } catch (error) {

    }
}

const completeAddCard = async (req,res) =>{
    const ref= req.body.reference
    //const ref = initializeCardTransaction.data.data.reference
    const completeCardTransaction= await completePayment(ref)
    if (!completeCardTransaction.data.status){
    throw new Error ('Unable to complete transaction')
}

    const {status,authorization,customer,amount} = completeCardTransaction.data.data
    if (status !== "success"){
    throw new Error ('Unable to complete transaction')
        }


    const checkIfCardExist = await cardModel.findOne({
    where: {
        authorization_code: authorization.authorization_code
    }
    });
    if (checkIfCardExist){
    res.status(400).json({
        status: false,
        message: 'Card already exists'
    })
    return
}
    const findUserId= await userModel.findOne({
                attributes: ['user_id'],
                 where: {
                     email: customer.email
                     
                 }
             })
             if(!findUserId){
                res.status(400).json({
                    status: false,
                    message: 'User not found'
                })
                return
             }
             const amountInNaira = amount/ 100
             const comments = `Wallet funding of ${amountInNaira} was successful`
await credit(amountInNaira,findUserId.user_id,comments)
    
await cardModel.create({
    card_id: uuidv4(),
    first_name : customer.first_name,
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
    authorization_code: authorization.authorization_code

}).then(()=>{
    res.status(200).json({
        status: 'success',
        message: "Card added successfully"
    
                })
})
return 
}

const findCard = async(req,res) => {
const {email} = req.body
const cardsFound = await cardModel.findAll({
    
     where: {
         email: email
         
     }
 })
 res.status(200).json({
    status : true,
    data: cardsFound
 })
}

const deleteCard = async (req, res) => {
    const {email,authorization_code} = req.body
    await cardModel.destroy({
        where: {
          [Op.and]: [
            { email},
            { authorization_code}
          ]
        }
      })
      res.status(200).json({
        status : true,
        message: "card deleted"
     })
   }


module.exports = {startAddCard, completeAddCard, findCard,deleteCard}
