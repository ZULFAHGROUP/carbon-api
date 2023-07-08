
const loggerModel = require('../models/loggerModel')



    
const logger = async (data)=> {
    try {
const {message, status, user_id, email} = data

    //validation
    if(!message|| !status || (!user_id && !email)){
        console.log("supply all required info")
         throw new Error ("supply all required info")
         //return "supply all required info"
    }
    
    await loggerModel.create(data)
    console.log("logged succesfully")
    return
}catch (error) {
    console.log(error);
}
}


module.exports = logger


