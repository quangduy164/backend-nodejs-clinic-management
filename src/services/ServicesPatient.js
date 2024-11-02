const { where } = require('sequelize')
const db = require('../models/index')

const postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.date || !data.timeType
                || !data.name || !data.address || !data.gender || !data.phoneNumber
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else { //update and insert patient
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

module.exports = {
    postBookAppointment
}