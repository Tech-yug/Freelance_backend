const express = require('express')
const router = express.Router()

const {
    getProjects,
    getSingleProject,
    postProjects,
    updateProjects,
    deleteProjects } = require('../controllers/projectController')
const upload = require('../util.js/fileUpload')

router 
    .route('/')
    .get(getProjects)
    .post(upload.array('projectfiles',5),postProjects)

router 
    .route('/:id')
    .get(getSingleProject)
    .put(updateProjects)
    .delete(deleteProjects)

module.exports = router