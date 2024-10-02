const express = require('express')
const { handleLogin } = require('../controllers/userController')
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

module.exports = router//export default