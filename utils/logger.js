
const loggerModel = require('../models/loggerModel')


try {
    
const logger = async (data)=> {
    // function expects an object with the following properties: 
    //{message, status, user_id, email}. Only one of user_id or email is required.
    //it can accept both also.
    //  both message and status are required.
const {message, status, user_id, email} = data

    //validation
    if(!message|| !status || (!user_id && !email)){
        console.log("supply all required info")
         throw new Error ("supply all required info")
         //return "supply all required info"
    }


// let message;
//     switch(action) {
//         case "createUser": 
//         message = "user is created"
//         break;   
//         case "verify_User_Account":
//             message = "user verifies account"
//             break
//         case "user_Login":
//             message = "user logs in"
//             break;
//         default: message = "user performs action"
//         break;
//     }

    // delete data.action;
    // data.message = message

   // data.action = message
    
    await loggerModel.create(data)
    console.log("logged succesfully")
    return
}


module.exports = logger

} catch (error) {
    console.log(error);
}


//     const otpData =  model.findOne({
//         attributes: ['modified_at'],
//         where: {
//             email_or_phone: email,
//             otp: otp,
//             otp_type: OtpEnum.REGISTRATION
//         }
//     })

// 