const ServicesUser = require('../services/ServicesUser')

const handleLogin = async (req, res) => {
    let email = req.body.email
    let password = req.body.password
    //check email exist
    //compare password
    //return userInfor
    //access_token: Json Web Token : validate
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter'
        })
    }
    let userData = await ServicesUser.handleUserLogin(email, password)
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

module.exports = {
    handleLogin,
}