const { where } = require('sequelize')
const db = require('../models/index')
const ServicesEmail = require('../services/ServicesEmail')
const lodash = require('lodash')

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

const getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'ASC']],//sắp xếp theo ngày tạo tăng dần
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (error) {
            reject(error)
        }
    })
}

const getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                },
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (error) {
            reject(error)
        }
    })
}

const saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.content
                || !inputData.action || !inputData.selectedPrice
                || !inputData.selectedPayment || !inputData.selectedProvince
                || !inputData.selectedSpecialty || !inputData.selectedClinic
                || !inputData.nameClinic || !inputData.addressClinic
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                //update and insert to Markdown
                if (inputData.action == 'CREATE') {
                    await db.Markdown.create({
                        content: inputData.content,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                } else if (inputData.action == 'UPDATE') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.content = inputData.content;
                        doctorMarkdown.description = inputData.description;

                        await doctorMarkdown.save()
                    }
                }

                //update and insert to Doctor_Infor
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false
                })
                if (doctorInfor) {//tìm thấy thì update
                    doctorInfor.doctorId = inputData.doctorId;
                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.paymentId = inputData.selectedPayment;
                    doctorInfor.provinceId = inputData.selectedProvince;
                    doctorInfor.specialtyId = inputData.selectedSpecialty;
                    doctorInfor.clinicId = inputData.selectedClinic;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note

                    await doctorInfor.save()
                } else {//create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        specialtyId: inputData.selectedSpecialty,
                        clinicId: inputData.selectedClinic,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor success'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['description', 'content'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor, attributes: { exclude: ['id', 'doctorId', 'createdAt', 'updatedAt'] },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Specialty, as: 'specialtyTypeData', attributes: ['name'] },
                                { model: db.Clinic, as: 'clinicTypeData', attributes: ['name', 'address'] },
                            ]
                        },
                    ],
                    raw: true,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                if (data && data.length > 0) {
                    data = data.map(item => ({//duyệt các phần tử của data và thêm trường maxNumber = 10 vào object
                        ...item,
                        maxNumber: MAX_NUMBER_SCHEDULE,
                    }));
                }
                //get all exist data
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data[0]['doctorId'], date: data[0]['date'] },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber']
                })
                //compare different
                let toCreate = lodash.differenceWith(data, existing, (a, b) => {
                    return a.timeType == b.timeType && a.date == b.date
                })
                //create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }

                resolve({
                    errCode: 0,
                    errMessage: 'create bulk schedule success'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    include: [//lấy thêm ở allcode 
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: true,
                    nest: true
                })

                if (!dataSchedule) {
                    dataSchedule = []
                }
                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getExtraInforDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: { doctorId: inputId },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: true,
                    nest: true
                })
                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['description', 'content'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor, attributes: { exclude: ['id', 'doctorId', 'createdAt', 'updatedAt'] },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
                    ],
                    raw: true,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData', attributes: ['email', 'address', 'firstName', 'gender'],
                            include: [
                                {
                                    model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'],
                                }
                            ]
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi'],
                        }
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.email || !data.name
                || !data.image || !data.token) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                //update patient status = Đã xong
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S2'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S3'
                    await appointment.save()
                    //send email remedy
                    await ServicesEmail.sendAttachmentRemedy({
                        receiverEmail: data.email,
                        patientName: data.name,
                        imageBase64: data.image.startsWith("data:image/")
                            ? data.image.split("base64,")[1]
                            : data.image, // Nếu dữ liệu không chứa "base64," thì dùng nguyên dữ liệu,
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'send remedy success',
                        data: data
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Hóa đơn đã được gửi'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    saveDetailInforDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemedy
}