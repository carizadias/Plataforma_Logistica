const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {isUser} = require('../middlewares/isUser')

router.get('/nif/:nif',isUser, userController.getUserByNIF);

router.get('/profile/:nif',isUser, userController.getProfile);

module.exports = router;

