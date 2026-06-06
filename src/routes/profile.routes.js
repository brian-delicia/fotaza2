const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profile.controller');

router.get('/:userId', profileController.detail);

router.get('/:userId/followers', profileController.followers);

router.get('/:userId/following', profileController.following);

module.exports = router;