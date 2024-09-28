const express = require('express')
const { getHomePage, getCRUD, postCRUD, displayGetCRUD, getEditCRUD, putCRUD, deleteCRUD } = require('../controllers/homeController')
const path = require('path')
const router = express.Router()

router.get('/', getHomePage/**controller */)
router.get('/crud', getCRUD)
router.post('/post-crud', postCRUD)
router.get('/get-crud', displayGetCRUD)
router.get('/edit-crud', getEditCRUD)
router.post('/put-crud', putCRUD)
router.get('/delete-crud', deleteCRUD)

module.exports = router//export default