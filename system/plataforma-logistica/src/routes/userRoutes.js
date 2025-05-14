const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const isClientUser = require('../middlewares/isClientUser');

//por ex: :addressId ou :id? qual melhor prática?

router.get('/:nif',authenticate, isClientUser, userController.getUserByNIF);//hasPermission('get:user')
router.get('/addresses', authenticate,isClientUser, userController.getAddresses);//hasPermission('get:addresses')
router.post('/addresses', authenticate, isClientUser, userController.addAddress);//hasPermission('create:address')
router.patch('/addresses/:id', authenticate, isClientUser, userController.updateAddress);//hasPermission('update:address')
router.delete('/addresses/:id',authenticate,isClientUser, userController.deleteAddress);//hasPermission('create:address')
router.get('/recipients',authenticate,isClientUser, userController.getRecipientsByUser);//hasPermission('get:recipients')

module.exports = router;


//seria melhor controlador apenas para cliente?🤔