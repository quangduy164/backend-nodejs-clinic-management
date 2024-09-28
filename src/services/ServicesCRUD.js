const db = require('../models/index')
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);//hash password theo library có sẵn

const createUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
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
            resolve('create user success')
        } catch (error) {
            reject(error)
        }
    })
}

const hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync("B4c0/\/", salt);
            resolve(hashPassword)
        } catch (error) {
            reject(error)
        }
    })
}

const getAllUser = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            //findAll = select * from Users
            let users = await db.User.findAll({
                raw: true// chỉ hiện object trong database
            })
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

const getUserInfoById = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            //findOne = select * from Users where id = ?
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true
            })
            if (user) {
                resolve(user)
            } else {
                resolve({})
            }
        } catch (error) {
            reject(error)
        }
    })
}

const updateUserData = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }
            })
            if (user) {
                //update = UPDATE Users SET email = ?, name = ?, city = ? WHERE id = ?
                user.firstName = data.firstName
                user.lastName = data.lastName
                user.address = data.address
                await user.save()
                let allUsers = await db.User.findAll()
                resolve(allUsers)
            } else {
                resolve()
            }
        } catch (error) {
            reject(error)
        }
    })
}

const deleteUserById = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            //findOne = select * from Users where id = ?
            let user = await db.User.findOne({
                where: { id: userId },
            })
            if (user) {
                //destroy = DELETE FROM Users WHERE id=?
                await user.destroy()
                let allUsers = await db.User.findAll()
                resolve(allUsers)
            } else {
                resolve()
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createUser,
    getAllUser,
    getUserInfoById,
    updateUserData,
    deleteUserById
}