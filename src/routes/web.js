const express = require('express')
const { getHomePage } = require('../controllers/homeController')
const path = require('path')
const router = express.Router()

router.get('/', getHomePage/**controller */)

module.exports = router//export default