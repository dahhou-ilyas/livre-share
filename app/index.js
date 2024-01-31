const express=require("express");
const app=express();
const useRoute=require('./routes/userRoute')
const exchangeRouter =require('./routes/exchangeRouter')
const bodyParser=require('body-parser');
const dotenv = require('dotenv');
dotenv.config();


app.use(bodyParser.json())


app.use('/api/exchangeResponse',exchangeRouter)
app.use('/api/users',useRoute)





module.exports = app