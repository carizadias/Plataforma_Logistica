const express = require('express');
const authController = require('../controllers/authController');
const { isPostOfficeAdmin } = require('../middlewares/isPostOfficeAdmin');
const { isAdmin } = require('../middlewares/isAdmin');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.post('/forgot_password', authController.forgotPassword);
router.post('/reset_password', authController.resetPassword);

router.post('/register/admin',isAdmin, authController.registerAdmin)
router.post('/register/post_office', authController.registerPostOfficeWithAdmin);
router.post('/post_office_user/register',isPostOfficeAdmin, authController.registerPostOfficeUser);
router.post('/post_office/login', authController.loginPostOffice);

module.exports = router;
