const express = require('express');
const router = express.Router();
const postOfficeController = require('../controllers/postOfficeController');
const authenticate = require('../middlewares/authenticate');
const isPostalCompanyAdmin = require('../middlewares/isPostalCompanyAdmin');
const isClientUser = require('../middlewares/isClientUser');
const isSystemAdmin = require('../middlewares/isSystemAdmin');
const isPostalCompanyEmployee = require('../middlewares/isPostalCompanyEmployee');
const setUploadFolder = require('../middlewares/setUploadFolder');
const upload = require('../services/uploadService');

//adress pq post office só pode ter um address viola convenção em plural?
router.get('/:id/address', authenticate, isPostalCompanyAdmin, postOfficeController.getPostOfficeAddress);//hasPermission('get:postal_office_address')
router.post('/:id/address', authenticate, isPostalCompanyAdmin, postOfficeController.addPostOfficeAddress);//hasPermission('create:postal_office_address')
router.patch('/:id/address', authenticate, isPostalCompanyAdmin, postOfficeController.updatePostOfficeAddress);//hasPermission('update:postal_office_address')

router.get('/:id/private-profile', authenticate, isPostalCompanyAdmin, postOfficeController.getPostOfficePrivateProfile);//hasPermission('get:postal_office_private_profile')
router.get('/:id/public-profile', isClientUser, postOfficeController.getPostOfficePublicProfile);//hasPermission('get:postal_office_public_profile')

router.get('/:id/working-hours', authenticate, postOfficeController.getPostOfficeHours);//hasPermission('get:postal_office_working_hours')
router.post('/:id/working-hours', authenticate, isPostalCompanyAdmin, postOfficeController.addPostOfficeHours);//hasPermission('create:postal_office_working_hours')

router.post('/', authenticate, isPostalCompanyAdmin, postOfficeController.addPostOffice);//hasPermission('create:postal_office')
router.patch('/:id', authenticate, isPostalCompanyAdmin, postOfficeController.updatePostOffice);//hasPermission('update:postal_office')
router.delete('/:id', authenticate, isPostalCompanyAdmin, postOfficeController.deletePostOffice);//hasPermission('delete:postal_office')

router.put('/:id/photo', setUploadFolder('post-photos'), upload.single('file'), authenticate, isPostalCompanyAdmin, postOfficeController.updatePostOfficePhoto);//hasPermission('update:postal_office_photo')

router.get('/transactions', authenticate, isPostalCompanyAdmin, postOfficeController.getPostOfficeTransactionHistory);//hasPermission('get:postal_office_transactions')

router.get('/:id/orders', authenticate, isPostalCompanyEmployee, postOfficeController.getOrdersByPostOffice);//hasPermission('get:postal_office_orders')

router.get('/pending', authenticate, isSystemAdmin, postOfficeController.getPendingPostOffices);//hasPermission('get:pending_postal_offices')
router.patch('/:id/approve', authenticate, isSystemAdmin, postOfficeController.approvePostOffice);//hasPermission('approve:postal_office')
router.patch('/:id/reject', authenticate, isSystemAdmin, postOfficeController.rejectPostOffice);//hasPermission('reject:postal_office')
router.patch('/:id/restore', authenticate, isSystemAdmin, postOfficeController.restorePostOffice);//hasPermission('restore:postal_office')

module.exports = router;
