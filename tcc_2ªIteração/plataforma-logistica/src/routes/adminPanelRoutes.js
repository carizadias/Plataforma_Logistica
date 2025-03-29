const express = require('express');
const adminPanelController = require('../controllers/adminPanelController');
const { isAdmin } = require('../middlewares/isAdmin');
const router = express.Router();


router.get("/post_offices/pending",isAdmin, adminPanelController.getPendingPostOffices);

router.put("/post_offices/approve/:id",isAdmin, adminPanelController.approvePostOffice);

router.put("/post_offices/reject/:id",isAdmin, adminPanelController.rejectPostOffice);

router.put("/post_offices/restore/:id",isAdmin, adminPanelController.restorePostOffice);



module.exports = router;
