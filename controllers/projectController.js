const Project = require('../model/project')


const getProjects = async (req,res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const skip = (page - 1) * limit
    try{
        const projects = await Project.find().sort({ _id:-1 }).limit(limit).skip(skip)
        return res.status(200).json({
            message: "Successful",
            projects
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const getSingleProject = async (req,res) => {
    const id = req.params.id
    try{
        await Project.findById(id).exec((error,data) => {
            if(error) return res.status(500).json({
                message: error.message
            })
            res.status(200).json({
                message: "Successful",
                project: data
            })
        })
    } catch(error){
         res.status(500).json({
            message: error.message
        })
    }

}

const postProjects = async (req,res) => {
    try{
        const fileArray = req.files
        const filenamearray = fileArray.map(single => single.filename)

        const newproject = new Project({...req.body, projectfiles: filenamearray})
        newproject.save((error,data) => {
            if(error) return res.send({ message: error.message })
            res.status(201).json({
                message: "Project created succesfully.",
                project: data
            })
        })
    } catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

const updateProjects = async (req,res) => {
    const id = req.params.id
    try{
        const project = await Project.findByIdAndUpdate( id, req.body, { new: true, runValidators: true })
        res.status(201).json({
            message: 'Project Updated Successfully.',
            project 
        })
    } catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

const deleteProjects = async (req,res) => {
    const id = req.params.id
    try{
        const deletedProject = await Project.findByIdAndDelete(id)
        res.json({
            msg: 'Successfully deleted the project.',
            project: deletedProject
        })
    } catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}


module.exports = {
    getProjects,
    getSingleProject,
    postProjects,
    updateProjects,
    deleteProjects
}