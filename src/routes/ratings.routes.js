const express= require('express');
const router = express.Router();
 
const ratingsController = require('../controllers/ratings.controller');
const {requireLogin}=require('../middlewares/auth.middleware');

router.post('/images/:imageId',requireLogin,ratingsController.rateImage);

module.exports= router;