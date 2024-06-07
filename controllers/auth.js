const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
  });
};

exports.postLogin = (req, res, next) => {
  // After clicking login btn, set Session in the request, be aware that you will find a new cookie called connect.sid also added in the browser. The cookie is for identify the user's session, but sensetive info is still stored in the session(Server).

  const email = req.body.email;
  const password = req.body.password;

  // Find user by input email
  User.findOne({ email: email })
    .then((user) => {
      if (!user) return res.redirect('/login');

      // Compare the hashed version of the input email to the hased password stored in the DB
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (result === true) {
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
