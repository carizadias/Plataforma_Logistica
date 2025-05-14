const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const {isClientUser} = require('../middlewares/isClientUser');
const {isPostalCompanyEmployee} = require('../middlewares/isPostalCompanyEmployee')
const {authenticate} = require('../middlewares/authenticate');
const hasPermission = require('../middlewares/hasPermission');

//organizar hierarquia de rotas a partir de ficheiro app

router.post("/",authenticate,isClientUser, hasPermission('create:order'), orderController.createOrder);//authenticate, isClientUser,//,isUser
//router.get("/", isUser, orderController.getOrderHistory);
// routes/orderRoutes.js
router.get('/history', authenticate, isClientUser, orderController.getOrderHistory);//user/history? controller apenas para users🤔 organização de endpoints
router.get('/received/history', authenticate, isClientUser, orderController.getReceivedOrderHistory);

//router.get("/recipient", isUser, orderController.getOrderHistoryForRecipient);
//router.get("/details/:order_id?",isUser, orderController.getOrderHistoryDetails);

// Rota para buscar detalhes completos da ordem
router.get('/:orderId/details',authenticate, isClientUser, orderController.getOrderDetails);
// routes/orderRoutes.js
//router.get('/:userId/history/details', orderController.getOrderDetailsById);
//router.get("/recipient_order_details/:order_id?",isUser, orderController.getOrderHistoryDetailsForRecipient);
router.put('/:order_id/status',authenticate, isPostalCompanyEmployee, orderController.updateOrderStatus);//, isPostOfficeEmployee

router.get("/recipients",authenticate,  orderController.getRecipientsByUser);//authenticate, isClientUser,

module.exports = router;