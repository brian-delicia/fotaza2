const express = require('express');
const router = express.Router();

const reportsController= require('../controllers/reports.controller')
const {requireLogin} =require('../middlewares/auth.middleware');

router.post('/images/:imageId',requireLogin,reportsController.reportImage);

router.post('/comments/:commentId',requireLogin,reportsController.reportComments);

module.exports= router;
