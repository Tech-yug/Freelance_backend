require('dotenv').config()
const express = require('express')
const app = express()

const projectRoute = require('./routes/projectRoute')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/projects',projectRoute)


const PORT = process.env.PORT || 8000



app.listen(PORT,()=>{
    console.log(`App is running in port: ${PORT}`);
})