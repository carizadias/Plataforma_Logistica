const express = require('express');
const router = express.Router();
const subSpecialController = require('../controllers/subSpecialController');
const authenticate = require('../middlewares/authenticate');
const isPostalCompanyAdmin  = require('../middlewares/isPostalCompanyAdmin');


router.post('/',authenticate, isPostalCompanyAdmin, subSpecialController.addSubSpecialService);//hasPermission('create:sub_special_service')
router.get('/:id',authenticate, isPostalCompanyAdmin, subSpecialController.getSubSpecialServiceById);//hasPermission('get:sub_special_service')
router.patch('/:id',authenticate, isPostalCompanyAdmin, subSpecialController.updateSubSpecialService);//hasPermission('update:sub_special_service')
router.delete('/:id',authenticate, isPostalCompanyAdmin, subSpecialController.deleteSubSpecialService);//hasPermission('delete:sub_special_service')

module.exports = router;
