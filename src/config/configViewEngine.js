const path = require('path')
const express = require('express')

const configViewEngine = (app) => {
    app.set('views', path.join('./src', 'views'))//tạo thư mục views trong views
    app.set('view engine', 'ejs')
    //config static files
    app.use(express.static(path.join('./src', 'public')))
}

module.exports = configViewEngine;