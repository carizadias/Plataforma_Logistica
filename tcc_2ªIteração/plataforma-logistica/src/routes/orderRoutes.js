const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const {isUser} = require('../middlewares/isUser');
const {isPostOfficeEmployee} = require('../middlewares/isPostOfficeEmployee')

router.post("/",isUser, orderController.createOrder);
router.get("/", isUser, orderController.getOrderHistory);
router.get("/recipient", isUser, orderController.getOrderHistoryForRecipient);
router.get("/details/:order_id?",isUser, orderController.getOrderHistoryDetails);
router.get("/recipient_order_details/:order_id?",isUser, orderController.getOrderHistoryDetailsForRecipient);
router.put('/:order_id/status', isPostOfficeEmployee, orderController.updateOrderStatus);
router.get("/post_office_orders/:post_office_id",isPostOfficeEmployee, orderController.getOrdersByPostOffice);

module.exports = router;