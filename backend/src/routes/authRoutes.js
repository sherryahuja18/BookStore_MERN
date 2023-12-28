//similar to controller java classes ( FYI)
const express = require('express');
const passport = require('../middlewares/passport-config');
const authRouter = express.Router();
const authController = require('../controllers/authController');

authRouter.post('/signup', authController.signup);
authRouter.get('/verify-email/:token', authController.verifyEmail);
authRouter.post('/login', authController.login);
authRouter.get('/google', authController.googleAuth);
authRouter.get('/google/callback', authController.googleAuthCallback);

module.exports = authRouter;