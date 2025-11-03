require('dotenv').config({ debug: false });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');


const routes=require("./routes")
const app = express();


app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); 
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());


const connectDB = require('./config/db');
connectDB(); 


app.use('/api', routes); 

app.use((err, req, res, next) => {
  console.error("error",err);
  res.status(500).json({ message: 'Something went wrong!' });
});
app.get('/',(req,res)=>{
    res.status(200).json({message:"u r running on server now"})
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
