const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authenticate = require('../middlewares/authenticate');
const isPostalCompanyAdmin  = require('../middlewares/isPostalCompanyAdmin');

router.post('/',authenticate, isPostalCompanyAdmin, serviceController.addService);//hasPermission('create:service')
router.get('/:id',authenticate, isPostalCompanyAdmin, serviceController.getServiceById);//hasPermission('get:service')
router.patch('/:id',authenticate, isPostalCompanyAdmin, serviceController.updateService);//hasPermission('update:service')
router.delete('/:id',authenticate, isPostalCompanyAdmin, serviceController.deleteService);//hasPermission('delete:service')
router.get('/:id/sub-services',authenticate, isPostalCompanyAdmin, serviceController.getSubServicesByService);//hasPermission('get:sub_services')

module.exports = router;

