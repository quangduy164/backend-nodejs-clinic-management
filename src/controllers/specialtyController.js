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

module.exports = {
    createSpecialty
}