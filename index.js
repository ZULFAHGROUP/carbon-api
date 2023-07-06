require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT
const displayRoutes = require('express-routemap');
const userRoutes = require('./routes/userRoutes')
const  walletRoutes  = require('./routes/walletRoutes')
const { notFoundMessage } = require('./constants/messages')
const sequelize = require('./config/db')


app.use(bodyParser.json())
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/wallet', walletRoutes)


  sequelize.authenticate()
  .then(() => {
   console.log('Connection has been established successfully.');
    app.listen(port, () => {
      displayRoutes(app);
    })
  })
  .catch(err => console.log('Error: ' + err))
  
// const dbCon = async()=> { 
//   try {
//     await sequelize.authenticate()
//     app.listen(port, () => { 
//       displayRoutes(app);
//     })
//   } catch (error) {
//     console.log('Error: ' + error)
//    }
// }
// dbCon()


app.use((req, res) => { 
    res.status(404).json({
        status: false,
        message: notFoundMessage
    })
})