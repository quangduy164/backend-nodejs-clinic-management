const express = require('express')
const userController = require('../controllers/userController')
const verifyToken = require('../middleware/verifyToken');
const path = require('path')
const router = express.Router()

router.post('/login', userController.handleLogin/**controller */)
router.get('/user/profile', verifyToken, (req, res) => {
    // Sau khi verifyToken thành công có thể truy cập thông tin người dùng từ req.userId
    res.status(200).json({
        message: 'Access granted',
        email: req.email,
        roleId: req.userRole
    });
});

router.get('/get-all-users', userController.handleGetAllUsers)
router.post('/create-new-user', userController.handleCreateNewUser)
router.put('/edit-user', userController.handleEditUser)
router.delete('/delete-user', userController.handleDeleteUser)

router.get('/allcode', userController.getAllCode)

module.exports = router//export default