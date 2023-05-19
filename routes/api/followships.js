const express = require('express');
const router = express.Router();
const followshipController = require('../../controllers/followshipController');

router.route('/').post(followshipController.makeFollow);
router.route('/:following_id').delete(followshipController.unFollow);

module.exports = router;
