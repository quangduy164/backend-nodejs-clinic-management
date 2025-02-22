const ServicesClinic = require('../services/ServicesClinic')

const createClinic = async (req, res) => {
    try {
        let infor = await ServicesClinic.createClinic(req.body)
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const getAllClinics = async (req, res) => {
    try {
        let infor = await ServicesClinic.getAllClinics()
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const getAllDetailClinics = async (req, res) => {
    try {
        let infor = await ServicesClinic.getAllDetailClinics()
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const getDetailClinicById = async (req, res) => {
    try {
        let infor = await ServicesClinic.getDetailClinicById(req.query.id)
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
    createClinic,
    getAllClinics,
    getAllDetailClinics,
    getDetailClinicById,
}