const { where } = require('sequelize')
const db = require('../models/index')
const ServicesEmail = require('../services/ServicesEmail')
const wifiIPv4Address = require('../config/configWifiIPv4Address')
const { v4: uuidv4 } = require('uuid');

const buildUrlEmail = (doctorId, token) => {
    // Sử dụng hàm để lấy địa chỉ IPv4 của Wi-Fi
    let iPv4Address = wifiIPv4Address.getWifiIPv4Address()

    let result = `http://${iPv4Address}:${process.env.PORT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}

const postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.doctorName
                || !data.date || !data.timeType || !data.schedule
                || !data.name || !data.address || !data.gender
                || !data.phoneNumber
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                //send email
                let token = uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
                await ServicesEmail.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.name,
                    time: `${data.schedule}, ${data.date}`,
                    doctorName: data.doctorName,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                })

                //update and insert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },//nếu không tìm thấy thì vào default
                    defaults: {
                        email: data.email,
                        firstName: data.name,
                        address: data.address,
                        gender: data.gender,
                        phoneNumber: data.phoneNumber,
                        roleId: 'R3'
                    }
                })

                //create bookings record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { timeType: data.timeType },//1 thời điểm chỉ được tạo 1 lịch khám
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor patient susscess'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const postVerifyAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Update appointment success'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exist'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    postBookAppointment,
    postVerifyAppointment
}