const jwt = require('jsonwebtoken')

// Middleware để xác thực token
const verifyToken = (req, res, next) => {
    // Lấy token từ header của request
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({
            errCode: 1,
            message: 'No token provided',
        });
    }
    // Giải mã token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                errCode: 2,
                message: 'Failed to authenticate token',
            });
        }
        // Nếu token hợp lệ, lưu thông tin người dùng đã giải mã vào request
        req.email = decoded.email;
        req.userRole = decoded.roleId;
        next();
    });
};

module.exports = verifyToken