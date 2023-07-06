const bcrypt = require('bcrypt');
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

module.exports = {
    hashPassword,
    generateOtp
}