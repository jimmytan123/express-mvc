const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  // After clicking login btn, set Session in the request, be aware that you will find a new cookie called connect.sid also added in the browser. The cookie is for identify the user, but sensetive info is still stored in the session(Server).
  User.findById('665e0270cce6d037b03830a6')
    .then((user) => {
      /*
       * Use the user data coming from the DB,
       * and store user in the session(lives in DB)
       */
      req.session.user = user;
      req.session.isLoggedIn = true;

      // To ensure the session is created before navigate back to /
      req.session.save((err) => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {};

exports.postLogout = (req, res, next) => {
  // Clear session(stored in DB) and redirect to root route afterwards
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
