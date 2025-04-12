const express = require("express");
const router = express.Router();
const postOfficeController = require("../controllers/postOfficeController");
const { isPostOfficeAdmin }  = require('../middlewares/isPostOfficeAdmin');
const {authenticate} = require('../middlewares/authenticate');
const { isPostOfficeEmployee }  = require('../middlewares/isPostOfficeEmployee');

//service
router.post("/services",authenticate, isPostOfficeAdmin, postOfficeController.addService);//, isPostOfficeAdmin
router.get('/:post_office_id/services',authenticate, isPostOfficeAdmin, postOfficeController.getServicesByPostOffice);
router.get('/services/:service_id',authenticate, isPostOfficeAdmin, postOfficeController.getServiceById);
router.put('/services/:service_id',authenticate, isPostOfficeAdmin, postOfficeController.updateService);
router.delete('/services/:service_id',authenticate, isPostOfficeAdmin, postOfficeController.deleteService);

//subservice
router.post("/sub_services",authenticate, isPostOfficeAdmin, postOfficeController.addSubService);//, isPostOfficeAdmin
router.get('/:service_id/sub_services',authenticate, isPostOfficeAdmin, postOfficeController.getSubServicesByService);
router.get('/sub_services/:sub_service_id',authenticate, isPostOfficeAdmin, postOfficeController.getSubServiceById);
router.put('/sub_services/:sub_service_id',authenticate, isPostOfficeAdmin, postOfficeController.updateSubService);
router.delete('/sub_services/:sub_service_id',authenticate, isPostOfficeAdmin, postOfficeController.deleteSubService);

//special service
router.post("/special_services",authenticate, isPostOfficeAdmin, postOfficeController.addSpecialService);//, isPostOfficeAdmin
router.get('/:sub_service_id/special_services',authenticate, isPostOfficeAdmin, postOfficeController.getSpecialServicesBySubService);
router.get('/special_services/:special_service_id',authenticate, isPostOfficeAdmin, postOfficeController.getSpecialServiceById);
router.put('/special_services/:special_service_id',authenticate, isPostOfficeAdmin, postOfficeController.updateSpecialService);
router.delete('/special_services/:special_service_id',authenticate, isPostOfficeAdmin, postOfficeController.deleteSpecialService);

//sub special service
router.post("/sub_special_services",authenticate, isPostOfficeAdmin, postOfficeController.addSubSpecialService);//,isPostOfficeAdmin
router.get('/:special_service_id/sub_special_services',authenticate, isPostOfficeAdmin, postOfficeController.getSubSpecialServicesBySpecialService);
router.get('/sub_special_services/:sub_special_service_id',authenticate, isPostOfficeAdmin, postOfficeController.getSubSpecialServiceById);
router.put('/sub_special_services/:sub_special_service_id',authenticate, isPostOfficeAdmin, postOfficeController.updateSubSpecialService);
router.delete('/sub_special_services/:sub_special_service_id',authenticate, isPostOfficeAdmin, postOfficeController.deleteSubSpecialService);

//transaction
router.get("/:postOfficeId/transactions",authenticate, isPostOfficeAdmin, postOfficeController.getTransactionHistory);//,isPostOfficeAdmin

//fee
router.post('/fees',authenticate, isPostOfficeAdmin, postOfficeController.addOrUpdateFee);//,isPostOfficeAdmin

router.get("/:post_office_id/orders",authenticate, isPostOfficeEmployee, postOfficeController.getOrdersByPostOffice);

module.exports = router;
