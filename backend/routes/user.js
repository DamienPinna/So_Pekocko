const express = require('express');
const router = express.Router();

const xssAuth = require('../middleware/xss-auth');
const userController = require('../controllers/user')

router.post('/signup', xssAuth, userController.signup);
router.post('/login', xssAuth, userController.login);

module.exports = router;