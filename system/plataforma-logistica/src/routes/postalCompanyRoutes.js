const express = require('express')
const router = express.Router();
const postalCompanyController = require('../controllers/postalCompanyController');
const authenticate = require('../middlewares/authenticate');
const isClientUser = require('../middlewares/isClientUser');
const isPostalCompanyAdmin = require('../middlewares/isPostalCompanyAdmin');
const isPostalCompanyEmployee = require('../middlewares/isPostalCompanyEmployee');
const setUploadFolder = require('../middlewares/setUploadFolder');
const upload = require('../services/uploadService');


router.get('/:id/public-profile', authenticate, isClientUser, postalCompanyController.getPostalCompanyPublicProfile);//hasPermission('get:postal_company_public_profile')

router.get('/:id/private-profile',authenticate, isPostalCompanyAdmin, postalCompanyController.getPostalCompanyPrivateProfile);//hasPermission('get:postal_company_private_profile')

router.get('/post-offices', authenticate, isPostalCompanyAdmin, postalCompanyController.getAllPostOfficesByPostalCompanyId);//hasPermission('get:postal_company_post_offices')

router.patch('/', authenticate,isPostalCompanyAdmin, postalCompanyController.updatePostalCompany);//hasPermission('update:postal_company')

router.put('/logotype', setUploadFolder('postal-logos'), upload.single('file'), authenticate,isPostalCompanyAdmin, postalCompanyController.updatePostalCompanyLogotype);//hasPermission('update:postal_company_logotype')

router.get('/:id/services', authenticate, isPostalCompanyAdmin,authenticate, isPostalCompanyAdmin, postalCompanyController.getServicesByPostalCompany);//hasPermission('get:postal_company_services')

router.get('/orders', authenticate, isPostalCompanyAdmin, postalCompanyController.getOrdersByPostalCompany);//ou employee? ou ambos?🤔//hasPermission('get:postal_company_orders')

router.get('/transactions', authenticate,isPostalCompanyAdmin, postalCompanyController.getPostalCompanyTransactionHistory);//hasPermission('get:postal_company_transactions')

module.exports = router;
