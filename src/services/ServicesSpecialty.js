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
                    image: data.image,
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

module.exports = {
    createSpecialty
}