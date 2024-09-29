const db = require('../models/index')
const bcrypt = require('bcryptjs');// Thêm gói bcrypt để so sánh mật khẩu

const handleUserLogin = async (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email)
            if (isExist) {
                //email alreaday exist
                //compare password
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['email', 'roleId', 'password'],// Lấy thêm thuộc tính role 
                    raw: true// Đảm bảo trả về dữ liệu object
                })
                if (user) {
                    //compare password
                    let check = await bcrypt.compare(password, user.password); // So sánh mật khẩu băm
                    if (check) {
                        userData.errCode = 0
                        userData.errMessage = 'Ok'
                        delete user.password //k trả về password
                        userData.user = user//trả về thông tin người dùng
                    } else {
                        userData.errCode = 3
                        userData.errMessage = 'Wrong password'
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found!`
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Your email isn't exist. Please try other email!`
            }
            resolve(userData)
        } catch (error) {
            reject(error)
        }
    })
}

//kiểm tra email có tồn tại k
const checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    handleUserLogin,
}