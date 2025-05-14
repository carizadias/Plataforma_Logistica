const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticate = require('../middlewares/authenticate');
const isClientUser = require('../middlewares/isClientUser');
const isPostalCompanyEmployee = require('../middlewares/isPostalCompanyEmployee')
const hasPermission = require('../middlewares/hasPermission');


router.post('/',authenticate,isClientUser, hasPermission('create:order'), orderController.createOrder);
router.get('/history', authenticate, isClientUser, orderController.getOrderHistory);//hasPermission('get:order_history')
router.get('/received', authenticate, isClientUser, orderController.getReceivedOrderHistory);//hasPermission('get:received_order_history')
router.get('/:id/details',authenticate, isClientUser, orderController.getOrderDetails);//hasPermission('get:order_details')
//melhor patch?
router.patch('/:id/status',authenticate, isPostalCompanyEmployee, orderController.updateOrderStatus);//hasPermission('update:order_status')


module.exports = router;