require('dotenv').config()//để dùng được process.env
const nodemailer = require("nodemailer");

let sendSimpleEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
        socketTimeout: 5000, // Thay đổi giá trị nếu cần
    });

    const info = await transporter.sendMail({
        from: '"Duiii gửi👻" <duyy164@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám online trên app của dui </p>
        <p>Thông tin đặt lịch khám:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

        <p>Nếu các thông tin trên là đúng, vui lòng nhấn vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám.</p>
        <div><a href= ${dataSend.redirectLink} target="_blank">Click here</a></div>

        <div>Trân trọng.</div>
        `, // html body
    });

}

module.exports = {
    sendSimpleEmail
}