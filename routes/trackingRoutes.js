// const express = require('express');
// const router = express.Router();
// const trackingController = require('../controllers/trackingController');

// Click tracking
// router.get('/track', trackingController.trackClick);

// Postback URL — client server calls this!
// router.get('/postback', trackingController.trackPostback);

// module.exports = router;











const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');

router.get('/track', trackingController.trackClick);
router.get('/postback', trackingController.trackPostback);

module.exports = router;