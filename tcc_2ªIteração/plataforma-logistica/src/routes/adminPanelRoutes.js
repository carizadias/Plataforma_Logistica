const express = require('express');
const adminPanelController = require('../controllers/adminPanelController');
const { isAdmin } = require('../middlewares/isAdmin');
const { authenticate } = require('../middlewares/authenticate');
const router = express.Router();


router.get("/post_offices/pending",authenticate, isAdmin, adminPanelController.getPendingPostOffices);

router.put("/post_offices/approve/:id",authenticate, isAdmin, adminPanelController.approvePostOffice);

router.put("/post_offices/reject/:id",authenticate, isAdmin, adminPanelController.rejectPostOffice);

router.put("/post_offices/restore/:id",authenticate, isAdmin, adminPanelController.restorePostOffice);



module.exports = router;
