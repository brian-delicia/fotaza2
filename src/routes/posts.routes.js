const express= require ('express');
const router = express.Router();

const postsController= require('../controllers/posts.controller');
const {requireLogin }= require('../middlewares/auth.middleware');


router.get('/',postsController.index);
router.get('/new',requireLogin,postsController.showNew);

router.post('/new',requireLogin,postsController.create);

router.get('/following/feed', requireLogin, postsController.followingFeed);

router.get('/:id',postsController.detail);

router.get('/:id/edit',requireLogin,postsController.showEdit);
router.post('/:id/edit',requireLogin,postsController.update);

router.post('/:id/delete',requireLogin,postsController.deletePost);

module.exports= router; 
