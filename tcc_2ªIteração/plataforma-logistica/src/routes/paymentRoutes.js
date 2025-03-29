const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const {isUser} = require('../middlewares/isUser');



router.post('/pay', isUser, paymentController.createPaymentIntent);
router.get('/calculate_cost', paymentController.calculateFee);

module.exports = router;
