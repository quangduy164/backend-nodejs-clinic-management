const { where } = require('sequelize')
const db = require('../models/index')

const createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.image
                || !data.introduce || !data.strengths) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    introduce: data.introduce,
                    strengths: data.strengths,
                    image: Buffer.from(data.image, 'base64'), // Chuyển Base64 thành Buffer để lưu vào BLOB,
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor clinic susscess'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createClinic,
}