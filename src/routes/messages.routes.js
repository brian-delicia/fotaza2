const express = require('express');
const router = express.Router();

const messagesController = require('../controllers/messages.controller');
const { requireLogin } = require('../middlewares/auth.middleware');

router.get('/', requireLogin, messagesController.index);

router.get('/interests/:interestId', requireLogin, messagesController.conversation);

router.post('/interests/:interestId', requireLogin, messagesController.sendMessage);

module.exports = router;