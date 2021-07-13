const Project = require('../model/project')

exports.eligibleUser = async (projectid,user) => {
    const project = await Project.findById(projectid)
    if(user._id.equals(project.user)){
        return true
    } else {
        return false
    }
}