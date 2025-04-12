const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const {isCommonUser} = require('../middlewares/isCommonUser');
const {isPostOfficeEmployee} = require('../middlewares/isPostOfficeEmployee')
const {authenticate} = require('../middlewares/authenticate')

router.post("/", authenticate, isCommonUser, orderController.createOrder);//,isUser
//router.get("/", isUser, orderController.getOrderHistory);
// routes/orderRoutes.js
router.get('/:userId/history', authenticate, isCommonUser, orderController.getOrderHistory);
router.get('/:userId/received/history', authenticate, isCommonUser, orderController.getReceivedOrderHistory);

//router.get("/recipient", isUser, orderController.getOrderHistoryForRecipient);
//router.get("/details/:order_id?",isUser, orderController.getOrderHistoryDetails);

// Rota para buscar detalhes completos da ordem
router.get('/:orderId/details',authenticate, isCommonUser, orderController.getOrderDetails);
// routes/orderRoutes.js
//router.get('/:userId/history/details', orderController.getOrderDetailsById);
//router.get("/recipient_order_details/:order_id?",isUser, orderController.getOrderHistoryDetailsForRecipient);
router.put('/:order_id/status',authenticate, isPostOfficeEmployee, orderController.updateOrderStatus);//, isPostOfficeEmployee

router.get("/:userId/recipients", authenticate, isCommonUser, orderController.getRecipientsByUser);

module.exports = router;