const { check, body } = require('express-validator');
const { User } = require('../models/user');

const validationLogin = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .normalizeEmail(),
];

const validationSignup = [
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
      // if (value === 'test@test.com') {
      //   throw new Error('This email address is forbidden.');
      // }

      // return true;

      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          // Return rejected Promise
          return Promise.reject(
            'Email exists already, please choose another one.'
          );
        }
      });
    })
    .normalizeEmail(),
  body(
    'password',
    'Please enter a password with only numbers and text and at least 5 characters'
  )
    .trim()
    .isLength({ min: 5 })
    .isAlphanumeric(),
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords must to match!');
      }

      return true;
    }),
];

const validationProducts = [
  body('title')
    .trim()
    .isString()
    .isLength({ min: 5, max: 50 })
    .withMessage('Title must be at least 5 characters and max 50 characters'),
  body('imageUrl').isURL().withMessage('Please enter a valid URL'),
  body('price')
    .trim()
    .isFloat()
    .withMessage('Please enter a valid price value'),
  body('description')
    .trim()
    .isLength({ min: 5, max: 150 })
    .withMessage(
      'Description must be at least 5 characters and max 150 characters'
    ),
];

module.exports = {
  validationLogin,
  validationSignup,
  validationProducts,
};
