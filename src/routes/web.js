const express = require('express')
const homeController = require('../controllers/homeController')
const path = require('path')
const router = express.Router()

router.get('/', homeController.getHomePage/**controller */)
router.get('/crud', homeController.getCRUD)
router.post('/post-crud', homeController.postCRUD)
router.get('/get-crud', homeController.displayGetCRUD)
router.get('/edit-crud', homeController.getEditCRUD)
router.post('/put-crud', homeController.putCRUD)
router.get('/delete-crud', homeController.deleteCRUD)

router.get('/verify-booking', homeController.verifyBooking)

module.exports = router//export default