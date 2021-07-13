const { isAuth } = require('../middleware/auth')
const Project = require('../model/project')
const { eligibleUser } = require('../middleware/eligibleUser')

const getProjects = async (req,res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const skip = (page - 1) * limit
    try{
        const projects = await Project.find().sort({ _id:-1 }).limit(limit).skip(skip).populate('user','name email')
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Projects fetched successfully!",
            data: projects
        })
    } catch(error){
        return res.status(500).json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}

const getSingleProject = async (req,res) => {
    const id = req.params.id
    try{
        const project = await Project.findById(id).populate('user','name email')
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Project fetched successfully!",
            data: project
        })
    } catch(error){
         res.status(500).json({
            success: false,
            status: 500,
            message: error.message
        })
    }

}

const postProjects = async (req,res) => {
    try{
        const fileArray = req.files
        const filenamearray = fileArray.map(single => single.filename)

        const newproject = new Project({...req.body,user:req.user._id, projectfiles: filenamearray})
        newproject.save((error,data) => {
            if(error) return res.send({ message: error.message })
            res.status(201).json({
                success: true,
                status: 201,
                message: "Project created succesfully.",
                data
            })
        })
    } catch(error){
        res.status(500).json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}

const updateProjects = async (req,res) => {
    const id = req.params.id
    const eligible = await eligibleUser(id,req.user)
    try{
        if(eligible){
            const project = await Project.findByIdAndUpdate( id, req.body, { new: true, runValidators: true })
            res.status(201).json({
                success: true,
                status: 201,
                message: "Project updated succesfully.",
                data: project
            })
        } else {
            throw new Error('Not allowed to update.')
        }
    } catch(error){
        res.status(500).json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}

const deleteProjects = async (req,res) => {
    const id = req.params.id
    const eligible = await eligibleUser(id,req.user)
    try{
        if(eligible){
            const deletedProject = await Project.findByIdAndDelete(id)
            res.json({
                success: true,
                status: 201,
                message: 'Successfully deleted the project.',
                data: deletedProject
            })
        } else {
            throw new Error('Not allowed to delete.')
        }
    } catch(error){
        res.status(500).json({
            success: false,
            status: 500,
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