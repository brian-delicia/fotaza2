const express= require('express');
const router =express.Router();

const imagesController = require('../controllers/image.controller')
const {requireLogin}= require('../middlewares/auth.middleware');

router.get('/:imageId/raw',imagesController.showRaw);

router.get('/:imageId',imagesController.detail);

router.post('/:imageId/close-comments',requireLogin,imagesController.closeComments);
 
module.exports= router;