const express = require('express');
const router = express.Router();
const publisherController = require('../controllers/publisherController');
const { isPublisher } = require('../middleware/auth');

router.get('/login', publisherController.getLogin);
router.post('/login', publisherController.postLogin);
router.get('/logout', publisherController.logout);

router.get('/dashboard', isPublisher, publisherController.getDashboard);

module.exports = router;