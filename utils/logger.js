
const loggerModel = require('../models/loggerModel')

// const logger = async (data)=> {
//     try {
// const {message, status, user_id, email} = data

//     //validation
//     if(!message|| !status || (!user_id && !email)){
//          throw new Error ("supply all required info")
         
//     }
    
//     await loggerModel.create(data)
    
//     return
// }catch (error) {
//    }
// }


const logger = async (email, status, message)=> {
    try {

    //validation
    if(!message|| !status || !email){
         throw new Error ("supply all required info")
         
    }
    
    await loggerModel.create({
        email,
        message,
        status
    })
    
    return
}catch (error) {
   }
}

module.exports = logger


