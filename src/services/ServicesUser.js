const { raw } = require('body-parser');
const db = require('../models/index')
const bcrypt = require('bcryptjs');// Thêm gói bcrypt để so sánh mật khẩu
const { where } = require('sequelize');
const salt = bcrypt.genSaltSync(10);//hash password theo library có sẵn

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

const getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = ''
            if (userId == 'ALL') {
                user = db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    },
                })
            }
            if (userId && userId != 'ALL') {
                user = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(user)
        } catch (error) {
            reject(error)
        }
    })
}

const createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //kiểm tra email exist
            let check = await checkUserEmail(data.email)
            if (check == true) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in use'
                })
            } else {
                let hashPasswordFromBcryptjs = await hashUserPassword(data.password)
                //method create = query của mysql INSERT INTO Users(email, name, city,...) VALUES(?, ?, ?, ...)
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcryptjs,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender == '1' ? true : false,
                    roleId: data.roleId,
                })
                resolve({
                    errCode: 0,
                    message: 'create user success'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (error) {
            reject(error)
        }
    })
}

const updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                //update = UPDATE Users SET email = ?, name = ?, city = ? WHERE id = ?
                user.firstName = data.firstName
                user.lastName = data.lastName
                user.address = data.address
                user.roleId = data.roleId
                await user.save()
                resolve({
                    errCode: 0,
                    message: 'update user success'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'user not found'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            })
            if (!user) {
                return resolve({
                    errCode: 2,
                    errMessage: 'The user not exist'
                })
            }
            await db.User.destroy({
                where: { id: userId }
            })
            resolve({
                errCode: 0,
                message: 'The user delete success'
            })
        } catch (error) {
            reject(error)
        }
    })
}

const getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                })
                res.errCode = 0
                res.data = allcode
                resolve(res)
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    handleUserLogin,
    getAllUsers,
    createNewUser,
    updateUserData,
    deleteUser,
    getAllCodeService
}