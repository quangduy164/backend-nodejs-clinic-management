const ServicesSpeciaty = require('../services/ServicesSpecialty')

const createSpecialty = async (req, res) => {
    try {
        let infor = await ServicesSpeciaty.createSpecialty(req.body)
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const getAllSpecialties = async (req, res) => {
    try {
        let infor = await ServicesSpeciaty.getAllSpecialties()
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const getAllDetailSpecialties = async (req, res) => {
    try {
        let infor = await ServicesSpeciaty.getAllDetailSpecialties()
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const getDetailSpecialtyById = async (req, res) => {
    try {
        let infor = await ServicesSpeciaty.getDetailSpecialtyById(req.query.id, req.query.location)
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

module.exports = {
    createSpecialty,
    getAllSpecialties,
    getAllDetailSpecialties,
    getDetailSpecialtyById
}