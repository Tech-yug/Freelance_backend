require('dotenv').config()
const app = require("express")()




app.get("/",(req,res)=>{
    res.send("<h1>Hello</h1>")
})


const PORT = process.env.PORT || 8000



app.listen(PORT,()=>{
    console.log(`App is running in port: ${PORT}`);
})