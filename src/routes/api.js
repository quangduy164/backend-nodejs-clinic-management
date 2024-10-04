const express = require('express')
const { handleLogin, handleGetAllUsers, handleCreateNewUser, handleEditUser, handleDeleteUser } = require('../controllers/userController')
const verifyToken = require('../middleware/verifyToken');
const path = require('path')
const router = express.Router()

router.post('/login', handleLogin/**controller */)
router.get('/user/profile', verifyToken, (req, res) => {
    // Sau khi verifyToken thành công có thể truy cập thông tin người dùng từ req.userId
    res.status(200).json({
        message: 'Access granted',
        email: req.email,
        roleId: req.userRole
    });
});

router.get('/get-all-users', handleGetAllUsers)
router.post('/create-new-user', handleCreateNewUser)
router.put('/edit-user', handleEditUser)
router.delete('/delete-user', handleDeleteUser)

module.exports = router//export default