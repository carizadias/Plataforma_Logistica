const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const {isCommonUser} = require('../middlewares/isCommonUser');
const {authenticate} = require('../middlewares/authenticate');



router.post('/pay',authenticate, isCommonUser, paymentController.createPaymentIntent);//, isUser
router.get('/calculate_cost',authenticate, paymentController.calculateFee);

module.exports = router;
