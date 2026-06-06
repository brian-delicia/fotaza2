const express=require('express');
const router = express.Router();

const notificationsController=require('../controllers/notifications.controller');
const {requireLogin}= require('../middlewares/auth.middleware');

router.get('/',requireLogin,notificationsController.index);

router.post('/read-all',requireLogin,notificationsController.markAllAsRead);

router.post('/:id/read',requireLogin,notificationsController.markAsRead);

module.exports= router;