const ServicesUser = require('../services/ServicesUser')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
    let email = req.body.email
    let password = req.body.password
    //check email exist
    //compare password
    //return userInfor
    //access_token: Json Web Token : validate
    //Kiểm tra email và mật khẩu có được điền k
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter'
        })
    }

    try {
        //xử lý logic login
        let userData = await ServicesUser.handleUserLogin(email, password)
        //Đăng nhập thành công
        if (userData.errCode == 0) {
            //Tạo token với thông tin người dùng
            const accessToken = jwt.sign({
                id: userData.user.id,
                email: userData.user.email,
                roleId: userData.user.roleId
            },
                process.env.JWT_SECRET,//Khóa cho jwt
                { expiresIn: '1h' }//token sống trong 1h
            )
            return res.status(200).json({
                errCode: userData.errCode,
                message: userData.errMessage,
                user: userData.user,
                accessToken//trả về token để sử dụng trong các res
            })
        } else {
            // Trường hợp đăng nhập thất bại
            return res.status(401).json({
                errCode: userData.errCode,
                message: userData.errMessage
            });
        }
    } catch (error) {
        // Xử lý các lỗi khác
        return res.status(500).json({
            errCode: 2,
            message: 'Error from server',
            error: error.message
        });
    }


}

module.exports = {
    handleLogin,
}