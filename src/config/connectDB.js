const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('test', 'root', null, {
    host: 'localhost',
    port: 3307,
    dialect: 'mysql',
    logging: false
})

const connectDB = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successcefully')
    } catch (error) {
        console.log('Unable to connect to the database: ', error)
    }
}

module.exports = connectDB