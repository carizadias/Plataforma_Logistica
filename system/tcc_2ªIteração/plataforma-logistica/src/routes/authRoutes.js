const express = require('express');
const authController = require('../controllers/authController');
const { isPostalCompanyAdmin } = require('../middlewares/isPostalCompanyAdmin');
const { isSystemAdmin } = require('../middlewares/isSystemAdmin');
const { authenticate } = require('../middlewares/authenticate');
const router = express.Router();

//organizar hierarquia de rotas a partir de ficheiro app

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticate, authController.logout);

router.post('/forgot_password', authController.forgotPassword);
router.post('/reset_password', authController.resetPassword);

router.post('/register/admin', authController.registerAdmin)//,authenticate,isSystemAdmin
router.post('/register/post_office', authController.registerPostalCompanyWithAdmin);
router.post('/post_office_user/register', authController.registerPostalCompanyUser);//, authenticate, isPostalCompanyAdmin

module.exports = router;
