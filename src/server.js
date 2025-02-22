require('dotenv').config()//để dùng được process.env
const express = require('express') //commonjs
const bodyParser = require('body-parser')//lấy param ở url khi gọi api
const configViewEngine = require('./config/configViewEngine')
const connectDB = require('./config/connectDB')
const webRoutes = require('./routes/web')
const apiRoutes = require('./routes/api')

const app = express()//tạo app express
const port = process.env.PORT || 8888//init port
const hostname = process.env.HOSTNAME

//config req.body
// app.use(express.json()) // for json
// app.use(express.urlencoded({ extended: true })) // for form data
app.use(bodyParser.json({ limit: '50mb' })) //tăng dung lượng upload file
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })) // tăng dung lượng upload file

//config template engine
configViewEngine(app)

//Khai báo routes
app.use('/', webRoutes)

//Khai báo routes api
app.use('/api/', apiRoutes)

connectDB()

//run server trên port đã khởi tạo và nạp các thông tin khai báo ở trên rồi chạy(nạp routes)
app.listen(port, hostname, () => {
    console.log(`Backend Nodejs is running on the port: ${port}`)
})