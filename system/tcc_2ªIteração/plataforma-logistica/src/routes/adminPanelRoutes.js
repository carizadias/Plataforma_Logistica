const express = require('express');
const adminPanelController = require('../controllers/adminPanelController');
const { isSystemAdmin } = require('../middlewares/isSystemAdmin');
const { authenticate } = require('../middlewares/authenticate');
const router = express.Router();

//organizar hierarquia de rotas a partir de ficheiro app
router.get("/post_offices/pending",authenticate, isSystemAdmin, adminPanelController.getPendingPostOffices);

router.put("/post_offices/approve/:id",authenticate, isSystemAdmin, adminPanelController.approvePostOffice);

router.put("/post_offices/reject/:id",authenticate, isSystemAdmin, adminPanelController.rejectPostOffice);

router.put("/post_offices/restore/:id",authenticate, isSystemAdmin, adminPanelController.restorePostOffice);



module.exports = router;
