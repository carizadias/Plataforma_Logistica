const express = require("express");
const router = express.Router();
const postOfficeController = require("../controllers/postOfficeController");
const { isPostOfficeAdmin }  = require('../middlewares/isPostOfficeAdmin');

router.post("/services", isPostOfficeAdmin, postOfficeController.addService);
router.post("/sub_services", isPostOfficeAdmin,postOfficeController.addSubService);
router.post("/special_services", isPostOfficeAdmin, postOfficeController.addSpecialService);
router.post("/sub_special_services",isPostOfficeAdmin, postOfficeController.addSubSpecialService);
router.get("/:postOfficeId/transactions",isPostOfficeAdmin, postOfficeController.getTransactionHistory);
router.post('/add_or_update_fee',isPostOfficeAdmin, postOfficeController.addOrUpdateFee);

module.exports = router;
