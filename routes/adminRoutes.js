// const express = require('express');
// const router = express.Router();

// const adminController = require('../controllers/adminController');
// const { isAdmin } = require('../middleware/auth');

// // AUTH
// router.get('/login', adminController.getLogin);
// router.post('/login', adminController.postLogin);
// router.get('/logout', adminController.logout);

// // DASHBOARD
// router.get('/dashboard', isAdmin, adminController.getDashboard);

// // OFFERS
// router.get('/offers', isAdmin, adminController.getOffers);
// router.post('/offers/add', isAdmin, adminController.addOffer);
// router.post('/offers/edit', isAdmin, adminController.editOffer);
// router.get('/offers/delete/:id', isAdmin, adminController.deleteOffer);

// // PUBLISHERS
// router.get('/publishers', isAdmin, adminController.getPublishers);
// router.post('/publishers/add', isAdmin, adminController.addPublisher);
// router.get('/publishers/delete/:id', isAdmin, adminController.deletePublisher);

// // ASSIGN
// router.get('/assign', isAdmin, adminController.getAssign);
// router.post('/assign', isAdmin, adminController.postAssign);

// // REPORTS
// router.get('/reports', isAdmin, adminController.getReports);

// module.exports = router;
















// const express = require('express');
// const router = express.Router();
// const adminController = require('../controllers/adminController');
// const { isAdmin } = require('../middleware/auth');

// router.get('/login', adminController.getLogin);
// router.post('/login', adminController.postLogin);
// router.get('/logout', adminController.logout);

// router.get('/dashboard', isAdmin, adminController.getDashboard);

// router.get('/offers', isAdmin, adminController.getOffers);
// router.post('/offers/add', isAdmin, adminController.addOffer);
// router.post('/offers/edit', isAdmin, adminController.editOffer);
// router.get('/offers/edit-page/:id', isAdmin, adminController.getEditOffer);
// router.get('/offers/delete/:id', isAdmin, adminController.deleteOffer);

// router.get('/publishers', isAdmin, adminController.getPublishers);
// router.post('/publishers/add', isAdmin, adminController.addPublisher);
// router.get('/publishers/delete/:id', isAdmin, adminController.deletePublisher);

// router.get('/assign', isAdmin, adminController.getAssign);
// router.post('/assign', isAdmin, adminController.postAssign);

// router.get('/reports', isAdmin, adminController.getReports);

// module.exports = router;






















const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

// ================= AUTH =================
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.logout);

// ================= DASHBOARD =================
router.get('/dashboard', isAdmin, adminController.getDashboard);

// ================= OFFERS =================
router.get('/offers', isAdmin, adminController.getOffers);
router.post('/offers/add', isAdmin, adminController.addOffer);

// ✅ FIXED ROUTES
router.get('/offers/edit/:id', isAdmin, adminController.getEditOffer);  // FIXED
router.post('/offers/edit', isAdmin, adminController.editOffer);

router.get('/offers/delete/:id', isAdmin, adminController.deleteOffer);

// ================= PUBLISHERS =================
router.get('/publishers', isAdmin, adminController.getPublishers);
router.post('/publishers/add', isAdmin, adminController.addPublisher);
router.get('/publishers/delete/:id', isAdmin, adminController.deletePublisher);

// ================= ASSIGN =================
router.get('/assign', isAdmin, adminController.getAssign);
router.post('/assign', isAdmin, adminController.postAssign);

// ================= REPORTS =================
router.get('/reports', isAdmin, adminController.getReports);

module.exports = router;