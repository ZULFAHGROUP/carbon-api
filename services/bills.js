require('dotenv').config()
const axios = require('axios')


let result;
let utilResult;


try{
  const tokenVariable = await axios.post(`https://auth.reloadly.com/oauth/token`,
    {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'client_credentials',
        audience: 'https://topups-sandbox.reloadly.com'
    });

 result = tokenVariable.data.access_token;

const operatorDetail = await axios.get('https://topups-sandbox.reloadly.com/countries/NG', {
  headers: {
      Authorization: `Bearer ${result}`
    }
})


// Extract the operator list from the response
const operators = operatorDetail.data.content;

res.status(200).json({
  status: true,
  message: "This is the list of the operators",
  operators
}) 
}catch (error) {
  console.error(error);
  res.status(500).json({
    status: false,
    message: "Error occurred while retrieving the operators"
  });
};

try{
                
  const dataOperatorsDetail = await axios.get('https://topups-sandbox.reloadly.com/operators/countries/NG?includeData=true', {
      headers: {
          Authorization: `Bearer ${result}`
        }
  })
  

   // Extract the data operator list from the response
   const dataOperators = dataOperatorsDetail.data;
  
   res.status(200).json({
      status: true,
      message: "This is the list of the operators",
      dataOperators
    }) 
    }catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Error occurred while retrieving the operators"
      });
    }

    // to topup for airtime or data
try{
  const rechargeFunc = await axios.post(`https://topups.reloadly.com/topups`, {
      operatorId: operatorID,
      recipientPhone: phoneNumber,
      amount: newAmount
    }, {
      headers: {
        Authorization: `Bearer ${result}`
      }
    });
  
   }catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Error occurred while processing the purchase of airtime"
      });
    }



// accessing utility bearer token
try{
    const utilAccessToken = await axios.post(`https://auth.reloadly.com/oauth/token`,
      {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: 'client_credentials',
          audience: 'https://utilities-sandbox.reloadly.com'
      });
  
utilResult = utilAccessToken.data.access_token;

const billerDetails = await axios.get('https://utilities-sandbox.reloadly.com/billers', {
    headers: {
        Authorization: `Bearer ${utilResult}`
      }
})

// Extract the billers list from the response
const utilitiesBillers = billerDetails.content;

res.status(200).json({
    status: true,
    message: "This is the list of all the utility billers",
    utilitiesBillers
  }) 

}catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Error occurred while retrieving the billers"
    });
  };

  // to pay for utilities

  try {
    
       const utilityFunc = await axios.post(`https://utilities-sandbox.reloadly.com/pay`, {
        billerId,
        amount,
        subscriberAccountNumber,
        useLocalAmount: false,
      }, {
        headers: {
          Authorization: `Bearer ${utilResult}`
        }
      });
    }catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "An error occurred while processing your bill payment"
      });
    } 

    
  module.exports = {
    tokenVariable,
    operatorDetail,
    dataOperatorsDetail,
    rechargeFunc,
    utilityBillToken,
    billerDetails,
    utilityFunc
  }

