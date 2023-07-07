
const loggerModel = require('../models/loggerModel')

    // function expects an object with the following properties: 
    //{message, status, user_id, email}. Only one of user_id or email is required.
    //it can accept both also.
    //  both message and status are required.

const logger = async (data) => {

    const { message, status, user_id, email } = data
    try {
        //validation
        if (!message || !status || (!user_id && !email)) {
            throw new Error("supply all required info")
            //return "supply all required info"
        }
  
        await loggerModel.create(data)
        return

    } catch (error) {
        console.log(error);
    }

}
module.exports = logger




//     const otpData =  model.findOne({
//         attributes: ['modified_at'],
//         where: {
//             email_or_phone: email,
//             otp: otp,
//             otp_type: OtpEnum.REGISTRATION
//         }
//     })

// 