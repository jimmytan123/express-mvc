const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

// Create a transporter object via nodemailer
// Check Mailtrap website for receiving test emails
const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '31ba88bdbfd22b',
    pass: 'c88a892f65d56a',
  },
});

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
    },
    validationErrors: [],
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  // After clicking login btn, set Session in the request, be aware that you will find a new cookie called connect.sid also added in the browser. The cookie is for identify the user's session, but sensetive info is still stored in the session(Server).

  const email = req.body.email;
  const password = req.body.password;

  // Retrieve validation result
  const errors = validationResult(req);

  // Handle validation errors
  if (!errors.isEmpty()) {
    // Return status code 422 indicate validation fail, and render page again
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  // Find user by input email
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [],
        });
      }

      // Compare the hashed version of the input email to the hased password stored in the DB
      bcrypt
        .compare(password, user.password)
        .then((compareResult) => {
          if (compareResult === true) {
            /*
        
             * Store user & isLoggedIn in the session(lives in DB)
             */
            req.session.user = user;
            req.session.isLoggedIn = true;

            // To ensure the session is created before navigate back to /
            return req.session.save((err) => {
              console.log(err);
              res.redirect('/');
            });
          }

          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            oldInput: {
              email: email,
              password: password,
            },
            validationErrors: [],
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  // Retrieve sign up info to create user (TODO: add validation!)
  const email = req.body.email;
  const password = req.body.password;

  // Retrieve validation result
  const errors = validationResult(req);

  // Handle validation errors
  if (!errors.isEmpty()) {
    // Return status code 422 indicate validation fail, and render page again
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  // Generate a hash password for security purpose
  return bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      // Create a user and save in DB
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });

      return user.save();
    })
    .then((result) => {
      // Redirect user once create user success
      res.redirect('/login');

      // Send Email
      return transporter.sendMail({
        to: email,
        from: 'shop@node-complete.com',
        subject: 'Signup Succeeded!',
        html: '<h1>You successfully signed up!</h1>',
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  // Clear session(stored in DB) and redirect to root route afterwards
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Password Reset',
    errorMessage: message,
    validationErrors: [],
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      // console.log(err);
      return res.redirect('/reset');
    }

    // Generate a password reset token
    const token = buffer.toString('hex');

    // Retrieve validation result
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render('auth/reset', {
        path: '/reset',
        pageTitle: 'Password Reset',
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

    // Find the user in DB based on the input email
    User.findOne({ email: req.body.email })
      .then((user) => {
        // Set user token info
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;

        // Save token and date to DB
        return user.save();
      })
      .then((result) => {
        res.redirect('/');

        // Send email to user with the constructed URL to reset password
        transporter.sendMail({
          to: req.body.email,
          from: 'shop@node-complete.com',
          subject: 'Reset Your Password',
          html: `
            <p>You requested a password request</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to reset your password.</p>
          `,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;

  // Find the user with the token only if the token does not expired
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      let message = req.flash('error');

      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }

      // Render the page for update password
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(), // pass userId to the view
        passwordToken: token,
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const userId = req.body.userId;
  const newPassword = req.body.password;
  const passwordToken = req.body.passwordToken;

  // Retrieve validation result
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: errors.array()[0].msg,
      userId: userId,
      passwordToken: passwordToken,
    });
  }

  let resetUser;

  User.findOne({
    _id: userId,
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      // Update user and save to DB
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;

      return resetUser.save();
    })
    .then((result) => {
      res.redirect('/login');
    })
    .catch((err) => console.log(err));
};
