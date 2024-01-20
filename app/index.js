const express=require("express");
const app=express();
const useRoute=require('./routes/userRoute')

const bodyParser=require('body-parser');
app.use(bodyParser.json())

app.use('/api/users',useRoute)



module.exports = app