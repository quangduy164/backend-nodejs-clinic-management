const db = require('../models/index')
const ServicesCRUD = require('../services/ServicesCRUD')

const getHomePage = async (req, res) => {
    try {
        const data = await db.User.findAll()
        res.render('homePage.ejs', { data: JSON.stringify(data) })
    } catch (e) {
        console.log(e)
    }
}

const getCRUD = async (req, res) => {
    try {
        const data = await db.User.findAll()
        res.render('crud.ejs')
    } catch (e) {
        console.log(e)
    }
}

const postCRUD = async (req, res) => {
    try {
        let message = await ServicesCRUD.createUser(req.body)
        console.log(message)
        res.send('post crud')
    } catch (e) {
        console.log(e)
    }
}

const displayGetCRUD = async (req, res) => {
    try {
        let data = await ServicesCRUD.getAllUser()
        res.render('displayCRUD.ejs', { dataTable: data })
    } catch (e) {
        console.log(e)
    }
}

const getEditCRUD = async (req, res) => {
    let userId = req.query.id // id của email tương ứng
    if (userId) {
        let userData = await ServicesCRUD.getUserInfoById(userId)
        res.render('editCRUD.ejs', { user: userData })
    } else {
        res.send('User not found!')
    }
}

const putCRUD = async (req, res) => {
    try {
        let data = req.body
        let allUsers = await ServicesCRUD.updateUserData(data)
        res.render('displayCRUD.ejs', { dataTable: allUsers })
    } catch (e) {
        console.log(e)
    }
}

const deleteCRUD = async (req, res) => {
    let userId = req.query.id // id của email tương ứng
    if (userId) {
        let allUsers = await ServicesCRUD.deleteUserById(userId)
        res.render('displayCRUD.ejs', { dataTable: allUsers })
    } else {
        res.send('User not found!')
    }
}

const verifyBooking = async (req, res) => {
    let { token, doctorId } = req.query
    try {
        // Gọi API xác minh với `token` và `doctorId`
        let message = await ServicesCRUD.verifyBooking({ token, doctorId });
        // Render verifyEmail.ejs với thông điệp
        res.render('verifyEmail.ejs', { message: message });
    } catch (error) {
        res.render('verifyEmail.ejs', { message: 'An error occurred. Please try again later.' });
    }
}

module.exports = {
    getHomePage,
    getCRUD,
    postCRUD,
    displayGetCRUD,
    getEditCRUD,
    putCRUD,
    deleteCRUD,
    verifyBooking
}