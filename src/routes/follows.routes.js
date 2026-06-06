const express= require('express');
const router = express.Router();

const followsController = require('../controllers/follows.controller');
const{requireLogin}= require('../middlewares/auth.middleware');

router.post('/:userId',requireLogin,followsController.follow);

router.post('/:userId/unfollow',requireLogin,followsController.unfollow);

module.exports = router; 
