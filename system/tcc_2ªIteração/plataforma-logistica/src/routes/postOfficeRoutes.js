const express = require("express");
const router = express.Router();
const postOfficeController = require("../controllers/postOfficeController");
const { isPostalCompanyAdmin }  = require('../middlewares/isPostalCompanyAdmin');
const {authenticate} = require('../middlewares/authenticate');
const { isPostalCompanyEmployee }  = require('../middlewares/isPostalCompanyEmployee');

//organizar hierarquia de rotas a partir de ficheiro app

//service
router.post("/services",authenticate, isPostalCompanyAdmin, postOfficeController.addService);//, isPostalCompanyAdmin
router.get('/:postal_company_id/services',authenticate, isPostalCompanyAdmin, postOfficeController.getServicesByPostalCompany);
router.get('/services/:service_id',authenticate, isPostalCompanyAdmin, postOfficeController.getServiceById);
router.patch('/services/:service_id',authenticate, isPostalCompanyAdmin, postOfficeController.updateService);
router.delete('/services/:service_id',authenticate, isPostalCompanyAdmin, postOfficeController.deleteService);

//subservice
router.post("/sub_services",authenticate, isPostalCompanyAdmin, postOfficeController.addSubService);//, isPostalCompanyAdmin
router.get('/:service_id/sub_services',authenticate, isPostalCompanyAdmin, postOfficeController.getSubServicesByService);
router.get('/sub_services/:sub_service_id',authenticate, isPostalCompanyAdmin, postOfficeController.getSubServiceById);
router.patch('/sub_services/:sub_service_id',authenticate, isPostalCompanyAdmin, postOfficeController.updateSubService);
router.delete('/sub_services/:sub_service_id',authenticate, isPostalCompanyAdmin, postOfficeController.deleteSubService);

//special service
router.post("/special_services",authenticate, isPostalCompanyAdmin, postOfficeController.addSpecialService);//, isPostalCompanyAdmin
router.get('/:sub_service_id/special_services',authenticate, isPostalCompanyAdmin, postOfficeController.getSpecialServicesBySubService);
router.get('/special_services/:special_service_id',authenticate, isPostalCompanyAdmin, postOfficeController.getSpecialServiceById);
router.patch('/special_services/:special_service_id',authenticate, isPostalCompanyAdmin, postOfficeController.updateSpecialService);
router.delete('/special_services/:special_service_id',authenticate, isPostalCompanyAdmin, postOfficeController.deleteSpecialService);

//sub special service
router.post("/sub_special_services",authenticate, isPostalCompanyAdmin, postOfficeController.addSubSpecialService);//,isPostalCompanyAdmin
router.get('/:special_service_id/sub_special_services',authenticate, isPostalCompanyAdmin, postOfficeController.getSubSpecialServicesBySpecialService);
router.get('/sub_special_services/:sub_special_service_id',authenticate, isPostalCompanyAdmin, postOfficeController.getSubSpecialServiceById);
router.patch('/sub_special_services/:sub_special_service_id',authenticate, isPostalCompanyAdmin, postOfficeController.updateSubSpecialService);
router.delete('/sub_special_services/:sub_special_service_id',authenticate, isPostalCompanyAdmin, postOfficeController.deleteSubSpecialService);

//transaction
router.get("/transactions",authenticate, postOfficeController.getPostOfficeTransactionHistory);//,isPostalCompanyAdmin
//router.get('/transactions',authenticate, postOfficeController.getPostalCompanyTransactionHistory);

//fee
router.post('/fees',authenticate, isPostalCompanyAdmin, postOfficeController.addOrUpdateFee);//,isPostalCompanyAdmin

router.get("/:post_office_id/orders",authenticate, postOfficeController.getOrdersByPostOffice);//authenticate, isPostalCompanyEmployee
router.get("/postal_company/orders",authenticate, postOfficeController.getOrdersByPostalCompany);//authenticate, isPostalCompanyEmployee

module.exports = router;
