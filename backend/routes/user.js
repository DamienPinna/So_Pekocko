const express = require('express');
const router = express.Router();

const limiter = require('../middleware/express-rate-limit-config');
const xssAuth = require('../middleware/xss-auth');
const userController = require('../controllers/user')

router.post('/signup', xssAuth, userController.signup);
router.post('/login', limiter, xssAuth, userController.login);

module.exports = router;