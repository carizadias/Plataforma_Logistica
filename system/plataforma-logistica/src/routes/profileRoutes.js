const express = require("express")
const router = express.Router();
const profileController = require('../controllers/profileController');
const authenticate = require('../middlewares/authenticate');
const isClientUser = require('../middlewares/isClientUser');
const isSystemAdmin = require('../middlewares//isSystemAdmin');
const isPostalCompanyAdmin = require('../middlewares//isPostalCompanyAdmin');
const isPostalCompanyEmployee = require('../middlewares/isPostalCompanyEmployee');
const setUploadFolder = require('../middlewares/setUploadFolder');
const upload = require('../services/uploadService');

//perfil base
router.get('/me',authenticate, profileController.getProfile);//utilizado por todos os users

//perfil específico
router.get('/client',authenticate, isClientUser, profileController.getClientProfile);//hasPermission('get:client_profile')
router.get('/system-admin', authenticate, isSystemAdmin, profileController.getSystemAdminProfile);//hasPermission('get:system_admin_profile')
router.get('/postal-company-admin',authenticate, isPostalCompanyAdmin, profileController.getPostalCompanyAdminProfile);//hasPermission('get:postal_company_admin_profile')
router.get('/postal-company-employee',authenticate, isPostalCompanyEmployee, profileController.getPostalCompanyEmployeeProfile);//hasPermission('get:postal_company_employee_profile')

router.patch('/', authenticate, profileController.updateProfile);//utilizado por todos os users
router.put('/password', authenticate, profileController.updatePassword);//utilizado por todos os users
router.put('/picture',setUploadFolder('profile-pictures'), upload.single('file'), authenticate, profileController.updateUserProfilePicture);//todos os users podem usar

//atualizar para buscar por user_id ao em vez de nif(client)
router.get('/:id',authenticate, isClientUser, profileController.getClientPublicProfile);//hasPermission('get:client_user_profile')

module.exports = router;