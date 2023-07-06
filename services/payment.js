require('dotenv').config()
const axios = require('axios')

const startPayment = async (amount, email) => {
    const amountInKobo = amount * 100
   return  axios({
                method: "POST",
                //url: `${process.env.PAYSTACK_BASEURL}/transaction/initialize`,
                url:`https://api.paystack.co/transaction/initialize`,
                headers: {
                    //Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                    //Authorization: 'Bearer sk_test_f081c53c1e814aa86580f92e94a11719063ae8af'
                    Authorization: 'Bearer sk_test_0eaaaef83dd922b08575c5b5430386fccb6c72eb'
       },
       data: {
           
           amount: amountInKobo,
           email: email,
            
       },
       channels : ['card']
                
   })
   


}

const completePayment = async (reference) => { 
    return axios({
        method: "GET",
        //url: `${process.env.PAYSTACK_BASEURL}/transaction/verify/${reference}`,
        url:`https://api.paystack.co/transaction/verify/${reference}`,
        headers: {
            //Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            //Authorization: 'Bearer sk_test_f081c53c1e814aa86580f92e94a11719063ae8af'
            Authorization:'Bearer sk_test_0eaaaef83dd922b08575c5b5430386fccb6c72eb'
        }

})

}
module.exports = {
    startPayment,
    completePayment
}