const mongoose = require("mongoose");

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
    }


},{timeStamp:true})

const Project= mongoose.model("project",Projects) 
module.exports = Project