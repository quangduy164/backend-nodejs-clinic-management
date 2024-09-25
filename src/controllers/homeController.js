const db = require('../models/index')

const getHomePage = async (req, res) => {
    try {
        const data = await db.User.findAll()
        res.render('homepage.ejs', { data: JSON.stringify(data) })
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    getHomePage
}