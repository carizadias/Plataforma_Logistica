const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticate = require('../middlewares/authenticate');
const isClientUser = require('../middlewares/isClientUser');


router.post('/',authenticate, isClientUser, paymentController.createPayment);//hasPermission('create:payment')

module.exports = router;
