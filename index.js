const app = require("express")()




app.get("/",(req,res)=>{
    res.send("<h1>Hello</h1>")
})

app.listen(8000,()=>{
    console.log("App is running");
})