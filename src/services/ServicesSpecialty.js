const { where } = require('sequelize')
const db = require('../models/index')

const createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.image || !data.description) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: Buffer.from(data.image, 'base64'), // Chuyển Base64 thành Buffer để lưu vào BLOB,
                    description: data.description
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor specialty susscess'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getAllSpecialties = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            resolve({
                errCode: 0,
                data: data
            })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createSpecialty,
    getAllSpecialties
}