const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const xssSauce = require('../middleware/xss-sauce');
const sauceController = require('../controllers/sauce');
const likeController =require('../controllers/like');

router.post('/:id/like', auth, likeController.manageLikeAndDislike);
router.post('/', auth, multer, xssSauce, sauceController.createSauce);
router.put('/:id', auth, multer, xssSauce, sauceController.modifySauce);
router.delete('/:id', auth, sauceController.deleteSauce);
router.get('/:id', auth, sauceController.getOneSauce);
router.get('/', auth, sauceController.getAllSauces);

module.exports = router;