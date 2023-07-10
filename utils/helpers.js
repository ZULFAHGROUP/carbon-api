const bcrypt = require('bcrypt');
const moment = require('moment'); // require
const saltRounds = 10;

const hashPassword = async (password) => { 
 return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                
                resolve({hash, salt })
            });
        });
    })
    
}

const generateOtp = (num) => {
    if (num < 2) {
        return Math.floor(1000 + Math.random() * 9000)
    }
    const c = Math.pow(10, num - 1)
    
    return Math.floor(c + Math.random() * 9 * c)

}


const phoneValidation = (userPhone) => { 
    if(!userPhone) return false
    const phone = userPhone.trim()
    const firstChar = phone.charAt(0)
    if (firstChar === '+' && phone.length === 14) {
        return phone
    } else if (firstChar === '0' && phone.length === 11) {
        return `+234${phone.slice(1)}`
    } else if (firstChar === '2' && phone.length === 13) { 
        return `+${phone}`
    } else {
        return false
    }
}

// const getTodaysDate = () => {

//     const today = new Date();
//     const yyyy = today.getFullYear(); 
//     let mm = today.getMonth() + 1; 
//     // Months start at 0!
//     let dd = today.getDate(); 
//     if (dd < 10) dd = '0' + dd; 
//     if (mm < 10) mm = '0' + mm; 
//     const formattedToday = dd + '-' + mm + '-' + yyyy;
//     return formattedToday.toString();

// }

const getTodaysDate = () => {
    const formattedToday = moment().format('YYYY-MM-DD')
  return formattedToday;
 }

module.exports = {
    hashPassword,
    generateOtp,
    phoneValidation,
    getTodaysDate
}