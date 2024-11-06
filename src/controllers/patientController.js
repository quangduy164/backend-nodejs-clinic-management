const ServicesPatient = require('../services/ServicesPatient')

const postBookAppointment = async (req, res) => {
    try {
        let infor = await ServicesPatient.postBookAppointment(req.body)
        return res.status(200).json(infor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

const postVerifyAppointment = async (req, res) => {
    try {
        let infor = await ServicesPatient.postVerifyAppointment(req.body)
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
    postBookAppointment,
    postVerifyAppointment
}