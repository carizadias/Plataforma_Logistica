const express = require("express")
const router = express.Router();
const {isAuthenticated} = require('../middlewares/isAuthenticated');
const profileController = require('../controllers/profileController');
const upload = require('../middlewares/upload');
const {isUser} = require('../middlewares/isUser');
const {isUserIsPostOfficeAdmin} = require("../middlewares/isUserIsPostOfficeAdmin");


router.get('/me',  isAuthenticated, profileController.getUserProfile);

router.put('/', isAuthenticated,  profileController.updateProfile);

router.put('/password', isAuthenticated, profileController.changePassword);

router.get('/addresses', isUserIsPostOfficeAdmin, profileController.getAddresses);

router.post('/addresses', isUserIsPostOfficeAdmin, profileController.addAddress);

router.put('/addresses/:id', isUserIsPostOfficeAdmin, profileController.updateAddress);

router.delete('/addresses/:id', isUserIsPostOfficeAdmin, profileController.deleteAddress);

router.get('/post_offices/:id',isUser, profileController.getPostOffice);

router.put('/users/:id/profile_picture',isUser, upload.single('profile_picture'), profileController.updateProfilePicture);

module.exports = router;