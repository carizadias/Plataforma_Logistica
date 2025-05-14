const express = require("express")
const router = express.Router();
const profileController = require('../controllers/profileController');
const upload = require('../services/uploadService');
const {isClientUser} = require('../middlewares/isClientUser');
const {isSystemAdmin} = require('../middlewares//isSystemAdmin');
const {isPostalCompanyAdmin} = require('../middlewares//isPostalCompanyAdmin');
const {isPostalCompanyEmployee} = require('../middlewares/isPostalCompanyEmployee');
const { authenticate } = require("../middlewares/authenticate");
//const { isClientUserSilent, isPostalCompanyEmployeeSilent } = require("../middlewares/roleMiddlewares");

const setUploadFolder = (folderName) => (req, res, next) => {//colocar este middleware no seu devido ficheiro
    req.folder = folderName;
    next();
};
//organizar hierarquia de rotas a partir de ficheiro app

//perfil base
router.get('/me',authenticate, profileController.getProfile);//,  isAuthenticated

//perfil específico
router.get('/me/client',authenticate, isClientUser, profileController.getClientProfile);
router.get('/me/system_admin', authenticate, isSystemAdmin, profileController.getSystemAdminProfile);
router.get('/me/postal_company_admin',authenticate, isPostalCompanyAdmin, profileController.getPostalCompanyAdminProfile);
router.get('/me/postal_company_employee',authenticate, isPostalCompanyEmployee, profileController.getPostalCompanyEmployeeProfile);

//colocar /me/update ?
router.patch('/', authenticate, profileController.updateProfile);//, isAuthenticated
router.put('/password', authenticate, profileController.updatePassword);
router.put('/user/profile_picture',setUploadFolder('profile_pictures'), upload.single('file'), authenticate, profileController.updateUserProfilePicture);//,isUserisPostalCompanyAdmin

router.get('/addresses', authenticate, profileController.getAddresses);//, isUserisPostalCompanyAdmin

router.get('/postOffices/:postOfficeId/addresses', authenticate, isPostalCompanyAdmin, profileController.getPostOfficeAddress);//, isUserisPostalCompanyAdmin

router.post('/addresses', authenticate, isClientUser, profileController.addAddress);//isUserisPostalCompanyAdmin,

router.post('/postOffices/:postOfficeId/addresses', authenticate, profileController.addPostOfficeAddress);//isUserisPostalCompanyAdmin,

router.patch('/addresses/:addressId', authenticate, isClientUser, profileController.updateAddress);//, isUserisPostalCompanyAdmin

router.patch('/postOffices/:postOfficeId/addresses', authenticate, profileController.updatePostOfficeAddress);//, isUserisPostalCompanyAdmin

router.get('/postal_company/post_offices', authenticate, profileController.getAllPostOfficesByPostalCompanyId);

router.delete('/addresses/:addressId',authenticate, profileController.deleteAddress); //, isUserisPostalCompanyAdmin

router.get('/postal_companies/:postalCompanyId/public_profile', profileController.getPostalCompanyPublicProfile);//,isUser

router.get('/postal_companies/:postalCompanyId/private_profile', profileController.getPostalCompanyPrivateProfile);//,isUser

router.patch('/postal_company',authenticate, profileController.updatePostalCompany);//,isPostalcompanyadmin

router.put('/postal_companies/logotype',setUploadFolder('postal_logos'), upload.single('file'),authenticate,  profileController.updatePostalCompanyLogotype);

router.get('/post_offices/:postOfficeId',authenticate, profileController.getPostOfficePrivateProfile); //,isUser

router.get('/postOffices/:postOfficeId/public_profile', profileController.getPostOfficePublicProfile);

router.get('/postOffices/:postOfficeId/working_hours',authenticate, profileController.getPostOfficeHours);

router.post('/postOffices/:postOfficeId/working_hours',authenticate, profileController.addPostOfficeHours);

router.patch('/post_office/:postOfficeId',authenticate, profileController.updatePostOffice);

//router.put('/users/:id/profile_picture',isUser, upload.single('profile_picture'), profileController.updateProfilePicture);

router.put('/post_office/:postOfficeId/photo',setUploadFolder('post_photos'), upload.single('file'),authenticate,  profileController.updatePostOfficePhoto);//,isUserisPostalCompanyAdmin
router.post('/postal_company/add_post_office',authenticate, profileController.addPostOffice);//,isPostalCompanyAdmin

router.delete('/postal_company/:postOfficeId/delete_post_office',authenticate, profileController.deletePostOffice);//,isPostalCompanyAdmin

router.get('/nif/:nif',authenticate, isClientUser, profileController.getUserByNIF);//,isUser

router.get('/user_profile/:nif',authenticate, isClientUser, profileController.getUserProfile);//,isUser

module.exports = router;