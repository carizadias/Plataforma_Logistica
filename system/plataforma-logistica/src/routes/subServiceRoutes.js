const express = require('express');
const router = express.Router();
const subServiceController = require('../controllers/subServiceController');
const authenticate = require('../middlewares/authenticate');
const isPostalCompanyAdmin  = require('../middlewares/isPostalCompanyAdmin');


//subservice
router.post('/',authenticate, isPostalCompanyAdmin, subServiceController.addSubService);//hasPermission('create:sub_service')
router.get('/:id',authenticate, isPostalCompanyAdmin, subServiceController.getSubServiceById);//hasPermission('get:sub_service')
router.patch('/:id',authenticate, isPostalCompanyAdmin, subServiceController.updateSubService);//hasPermission('update:sub_service')
router.delete('/:id',authenticate, isPostalCompanyAdmin, subServiceController.deleteSubService);//hasPermission('delete:sub_service')
router.get('/:id/special-services',authenticate, isPostalCompanyAdmin, subServiceController.getSpecialServicesBySubService);//hasPermission('get:special_services')

module.exports = router;
