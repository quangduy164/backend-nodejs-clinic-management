const express = require('express')
const userController = require('../controllers/userController')
const doctorController = require('../controllers/doctorController')
const patientController = require('../controllers/patientController')
const specialtyController = require('../controllers/specialtyController')
const clinicController = require('../controllers/clinicController')
const verifyToken = require('../middleware/verifyToken');
const path = require('path')
const router = express.Router()

router.post('/login', userController.handleLogin/**controller */)
router.get('/user/profile', verifyToken, (req, res) => {
    // Sau khi verifyToken thành công có thể truy cập thông tin người dùng từ req.userId
    res.status(200).json({
        message: 'Access granted',
        id: req.id,
        roleId: req.userRole,
        firstName: req.firstName
    });
});

router.get('/get-all-users', userController.handleGetAllUsers)
router.post('/create-new-user', userController.handleCreateNewUser)
router.put('/edit-user', userController.handleEditUser)
router.delete('/delete-user', userController.handleDeleteUser)

router.get('/allcode', userController.getAllCode)
router.put('/update-user-image', userController.handleUpdateUserImage)
router.get('/get-user', userController.handleGetUser)

router.get('/top-doctor-home', doctorController.getTopDoctorHome)
router.get('/get-all-doctors', doctorController.getAllDoctors)
router.post('/save-infor-doctor', doctorController.postInforDoctor)
router.get('/get-detail-doctor-by-id', doctorController.getDetailDoctorById)
router.post('/bulk-create-schedule', doctorController.bulkCreateSchedule)
router.get('/get-schedule-doctor-by-date', doctorController.getScheduleByDate)
router.get('/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById)
router.get('/get-profile-doctor-by-id', doctorController.getProfileDoctorById)

router.get('/get-list-patient-for-doctor', doctorController.getListPatientForDoctor)
router.post('/send-remedy', doctorController.sendRemedy)

router.post('/patient-book-appointment', patientController.postBookAppointment)
router.post('/verify-book-appointment', patientController.postVerifyAppointment)

router.post('/create-new-specialty', specialtyController.createSpecialty)
router.get('/get-all-specialties', specialtyController.getAllSpecialties)
router.get('/get-all-detail-specialties', specialtyController.getAllDetailSpecialties)
router.get('/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById)

router.post('/create-new-clinic', clinicController.createClinic)
router.get('/get-all-clinics', clinicController.getAllClinics)
router.get('/get-all-detail-clinics', clinicController.getAllDetailClinics)
router.get('/get-detail-clinic-by-id', clinicController.getDetailClinicById)

module.exports = router//export default