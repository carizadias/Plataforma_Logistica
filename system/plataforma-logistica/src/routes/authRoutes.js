const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');
const isPostalCompanyAdmin = require('../middlewares/isPostalCompanyAdmin');
const isSystemAdmin = require('../middlewares/isSystemAdmin');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticate, authController.logout);

router.post('/register/admin',authenticate,isSystemAdmin, authController.registerAdmin)//hasPermission('register:admin')?
router.post('/register/postal-company', authController.registerPostalCompanyWithAdmin);
router.post('/register/postal-company-user', authenticate, isPostalCompanyAdmin, authController.registerPostalCompanyUser);//hasPermission('register:postal_company_user')?

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);


module.exports = router;
