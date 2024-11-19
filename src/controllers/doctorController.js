const ServicesDoctor = require('../services/ServicesDoctor')

const getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit
    if (!limit) limit = 10
    try {
        let response = await ServicesDoctor.getTopDoctorHome(+limit)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const getAllDoctors = async (req, res) => {
    try {
        let doctors = await ServicesDoctor.getAllDoctors()
        return res.status(200).json(doctors)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const postInforDoctor = async (req, res) => {
    try {
        let response = await ServicesDoctor.saveDetailInforDoctor(req.body)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const getDetailDoctorById = async (req, res) => {
    try {
        let infor = await ServicesDoctor.getDetailDoctorById(req.query.id)
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await ServicesDoctor.bulkCreateSchedule(req.body)
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const getScheduleByDate = async (req, res) => {
    try {
        let infor = await ServicesDoctor.getScheduleByDate(req.query.doctorId, req.query.date)
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const getExtraInforDoctorById = async (req, res) => {
    try {
        let infor = await ServicesDoctor.getExtraInforDoctorById(req.query.doctorId)
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const getProfileDoctorById = async (req, res) => {
    try {
        let infor = await ServicesDoctor.getProfileDoctorById(req.query.doctorId)
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const getListPatientForDoctor = async (req, res) => {
    try {
        let infor = await ServicesDoctor.getListPatientForDoctor(req.query.doctorId, req.query.date)
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const sendRemedy = async (req, res) => {
    try {
        let infor = await ServicesDoctor.sendRemedy(req.body)
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
    getTopDoctorHome,
    getAllDoctors,
    postInforDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemedy
}