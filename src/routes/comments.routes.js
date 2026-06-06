const express = require('express');
const router =express.Router();

const commentsController=require('../controllers/comments.controller');
const {requireLogin}=require('../middlewares/auth.middleware');

router.post('/images/:imageId',requireLogin,commentsController.create);
 
router.get('/reported',requireLogin,commentsController.reportedComments);

router.post('/:commentId/delete',requireLogin,commentsController.deleteComment);

module.exports= router;