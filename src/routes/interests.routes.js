const express = require('express');
const router = express.Router();

const interestsController = require('../controllers/interests.controller');
const { requireLogin } = require('../middlewares/auth.middleware');

router.get('/', requireLogin, interestsController.index);

router.post('/images/:imageId', requireLogin, interestsController.create);

router.post('/:interestId/close', requireLogin, interestsController.close);

module.exports = router;