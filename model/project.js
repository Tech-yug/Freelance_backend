const mongoose = require("./index");

const Projects = mongoose.Schema({

    projecttitle:{
        type:String,
        required:true
    }, 
    description:{
        type:String,
        require:true
    },
    skills:{
        type: String,
        required: true
    },
    price:{
        type:Number,
        required:true
    },
    projectfiles: [{
        type: String
    }]


},{timeStamp:true})

const Project= mongoose.model("project",Projects) 
module.exports = Project