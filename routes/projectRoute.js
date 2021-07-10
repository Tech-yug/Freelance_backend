const express = require('express')
const router = express.Router()

const {
    getProjects,
    getSingleProject,
    postProjects,
    updateProjects,
    deleteProjects } = require('../controllers/projectController')

router 
    .route('/')
    .get(getProjects)
    .post(postProjects)

router 
    .route('/:id')
    .get(getSingleProject)
    .put(updateProjects)
    .delete(deleteProjects)