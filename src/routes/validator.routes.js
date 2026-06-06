const express= require('express');
const router = express.Router();

const validatorController= require('../controllers/validator.controller');
const {requireLogin }= require('../middlewares/auth.middleware');
const {requireRole}= require('../middlewares/role.middleware');

router.get('/reports',requireLogin,requireRole('validator'),validatorController.worklist);

router.get('/posts/:postId',requireLogin,requireRole('validator'),validatorController.postDetail);

router.post('/posts/:postId/dismiss',requireLogin,requireRole('validator'),validatorController.dismissReports);


module.exports=router;