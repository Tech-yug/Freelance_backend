require('dotenv').config()
const mongoose = require('mongoose')

try{
    (async ()=>{
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    })()
}catch(err){
    console.log(err)
}


module.exports = mongoose