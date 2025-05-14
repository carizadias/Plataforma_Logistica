const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const {isClientUser} = require('../middlewares/isClientUser');
const {authenticate} = require('../middlewares/authenticate');


//organizar hierarquia de rotas a partir de ficheiro app

router.post('/pay',authenticate, isClientUser, paymentController.createPayment);//, isUser//Intent
router.get('/calculate_cost',authenticate, paymentController.calculateFee);

module.exports = router;
