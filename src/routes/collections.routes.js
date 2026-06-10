const express = require('express');
const router= express.Router();

const collectionsController = require('../controllers/collections.controller');
const {requireLogin}=require('../middlewares/auth.middleware');

router.get('/',requireLogin,collectionsController.index);


router.get('/new',requireLogin,collectionsController.showNew);
router.post('/new',requireLogin,collectionsController.create);

router.post('/:collectionId/posts/:postId', requireLogin, collectionsController.addPost);
router.post('/:collectionId/images/:imageId', requireLogin, collectionsController.addImage);

router.post('/:collectionId/posts/:postId/remove', requireLogin, collectionsController.removePost);
router.post('/:collectionId/images/:imageId/remove', requireLogin, collectionsController.removeImage);


router.post('/:id/edit', requireLogin, collectionsController.update);
router.post('/:id/delete',requireLogin,collectionsController.deleteCollection);


router.get('/:id', requireLogin, collectionsController.detail);

module.exports = router;
