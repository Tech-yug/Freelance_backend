const express = require('express')
const router = express.Router()

const {
    getProjects,
    getSingleProject,
    postProjects,
    updateProjects,
    deleteProjects } = require('../controllers/projectController')
const { isAuth } = require('../middleware/auth')
const upload = require('../utils/fileUpload')

router 
    .route('/')
    .get(getProjects)
    .post(upload.array('projectfiles',5),isAuth,postProjects)

router 
    .route('/:id')
    .get(getSingleProject)
    .put(isAuth,updateProjects)
    .delete(isAuth,deleteProjects)

module.exports = router