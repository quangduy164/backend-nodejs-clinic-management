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

module.exports = {
    createClinic,
}