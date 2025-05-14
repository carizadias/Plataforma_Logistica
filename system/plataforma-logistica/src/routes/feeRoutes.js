const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const authenticate = require('../middlewares/authenticate');
const isPostalCompanyAdmin  = require('../middlewares/isPostalCompanyAdmin');


router.post('/fees',authenticate, isPostalCompanyAdmin, feeController.addOrUpdateFee);//hasPermission('create:fee')
router.get('/calculate',authenticate, feeController.calculateFee);

module.exports = router;
