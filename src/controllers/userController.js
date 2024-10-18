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

const handleGetAllUsers = async (req, res) => {
    let id = req.query.id;//lấy ALL hoặc 1 id
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing require parameters',
            user: []
        })
    }
    let user = await ServicesUser.getAllUsers(id)
    return res.status(200).json({
        errCode: 0,
        message: 'ok',
        user
    })
}

const handleCreateNewUser = async (req, res) => {
    let message = await ServicesUser.createNewUser(req.body)
    return res.status(200).json(message)
}

const handleEditUser = async (req, res) => {
    try {
        let data = req.body
        let message = await ServicesUser.updateUserData(data)
        return res.status(200).json(message)
    } catch (e) {
        console.log(e)
    }
}

const handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters'
        })
    }

    let message = await ServicesUser.deleteUser(req.body.id)
    return res.status(200).json(message)
}

const getAllCode = async (req, res) => {
    try {
        let data = await ServicesUser.getAllCodeService(req.query.type);
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    handleLogin,
    handleGetAllUsers,
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser,
    getAllCode
}