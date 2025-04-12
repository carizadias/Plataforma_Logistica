const express = require("express")
const router = express.Router();
const profileController = require('../controllers/profileController');
//const upload = require('../middlewares/upload');
const {isCommonUser} = require('../middlewares/isCommonUser');
const {isAdmin} = require('../middlewares/isAdmin');
const {isPostOfficeAdmin} = require('../middlewares/isPostOfficeAdmin');
const {isPostOfficeEmployee} = require('../middlewares/isPostOfficeEmployee');
const {authorizeRoles} = require("../middlewares/authorizeRoles")
const { authenticate } = require("../middlewares/authenticate");


//perfil base
router.get('/me', profileController.getProfile);//,  isAuthenticated


//perfil específico
router.get('/me/common_user',authenticate, isCommonUser, profileController.getCommonProfile);
router.get('/me/admin', authenticate, isAdmin,profileController.getAdminProfile);
router.get('/me/post_office_admin',authenticate, isPostOfficeAdmin, profileController.getPostOfficeAdminProfile);
router.get('/me/post_office_employee',authenticate, isPostOfficeEmployee, profileController.getPostOfficeEmployeeProfile);

//colocar /me/update ?
router.put('/', authenticate, profileController.updateProfile);//, isAuthenticated

router.get('/addresses', authenticate, authorizeRoles("admin","postOfficeAdmin"), profileController.getAddresses);//, isUserIsPostOfficeAdmin

router.post('/addresses', authenticate, authorizeRoles("admin","postOfficeAdmin"), profileController.addAddress);//isUserIsPostOfficeAdmin,

router.put('/addresses/:id', authenticate, authorizeRoles("admin","postOfficeAdmin"), profileController.updateAddress);//, isUserIsPostOfficeAdmin

router.delete('/addresses/:id', authenticate, authorizeRoles("admin","postOfficeAdmin"), profileController.deleteAddress); //, isUserIsPostOfficeAdmin

router.get('/post_offices/:id',authenticate, authorizeRoles("common","postOfficeAdmin"), profileController.getPostOfficeProfile); //,isUser

//router.put('/users/:id/profile_picture',isUser, upload.single('profile_picture'), profileController.updateProfilePicture);

router.get('/nif/:nif',authenticate, isCommonUser, profileController.getUserByNIF);//,isUser

router.get('/user_profile/:nif',authenticate, isCommonUser, profileController.getUserProfile);//,isUser

module.exports = router;