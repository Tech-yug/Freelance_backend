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

    password:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required:true
    }


},{timeStamp:true})

module.exports = mongoose.model("Projects",Projects) 