const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Create a transporter object
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
  });
};

exports.postLogin = (req, res, next) => {
  // After clicking login btn, set Session in the request, be aware that you will find a new cookie called connect.sid also added in the browser. The cookie is for identify the user's session, but sensetive info is still stored in the session(Server).

  const email = req.body.email;
  const password = req.body.password;

  // Find user by input email
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        // Notify the user using flash
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
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

          req.flash('error', 'Invalid email or password.');
          res.redirect('/login');
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
  const confirmPassword = req.body.confirmPassword;

  // Find if the user already exists by searching email
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash('error', 'Email exists already, please choose another one.');
        return res.redirect('/signup');
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
        .catch((err) => {
          console.log(err);
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
