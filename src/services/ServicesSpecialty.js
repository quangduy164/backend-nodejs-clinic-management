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
            let data = await db.Specialty.findAll({
                attributes: {
                    exclude: ['image', 'description']
                },
            });
            resolve({
                errCode: 0,
                errMessage: 'ok',
                data: data
            })
        } catch (error) {
            reject(error)
        }
    })
}

const getAllDetailSpecialties = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            resolve({
                errCode: 0,
                errMessage: 'ok',
                data: data
            })
        } catch (error) {
            reject(error)
        }
    })
}

const getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let data = {}
                data = await db.Specialty.findOne({
                    where: { id: inputId },
                    attributes: ['name', 'description'],
                })
                if (data) {
                    //lấy danh sách id doctor theo chuyên khoa
                    let doctorSpecialty = []
                    if (location === 'ALL') {//tìm toàn quốc
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    } else {//tìm theo khu vực
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: inputId, provinceId: location },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    }

                    data.doctorSpecialty = doctorSpecialty
                }
                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createSpecialty,
    getAllSpecialties,
    getAllDetailSpecialties,
    getDetailSpecialtyById
}