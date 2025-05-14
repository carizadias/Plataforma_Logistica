const express = require('express');
const router = express.Router();
const specialServiceController = require('../controllers/specialServiceController');
const authenticate = require('../middlewares/authenticate');
const isPostalCompanyAdmin  = require('../middlewares/isPostalCompanyAdmin');

router.post('/',authenticate, isPostalCompanyAdmin, specialServiceController.addSpecialService);//hasPermission('create:special_service')
router.get('/:id',authenticate, isPostalCompanyAdmin, specialServiceController.getSpecialServiceById);//hasPermission('get:special_service')
router.patch('/:id',authenticate, isPostalCompanyAdmin, specialServiceController.updateSpecialService);//hasPermission('update:special_service')
router.delete('/:id',authenticate, isPostalCompanyAdmin, specialServiceController.deleteSpecialService);//hasPermission('delete:special_service')
router.get('/:id/sub-special-services',authenticate, isPostalCompanyAdmin, specialServiceController.getSubSpecialServicesBySpecialService);//hasPermission('get:sub_special_services')

module.exports = router;
