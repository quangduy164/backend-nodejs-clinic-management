const express = require('express')
const { handleLogin } = require('../controllers/userController')
const path = require('path')
const router = express.Router()

router.post('/login', handleLogin/**controller */)


module.exports = router//export default