const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

const {
  validationLogin,
  validationSignup,
  validationResetPassword,
} = require('../middleware/forms-validation.middleware');

router.get('/login', authController.getLogin);

router.post('/login', validationLogin, authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', validationSignup, authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', validationResetPassword, authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
