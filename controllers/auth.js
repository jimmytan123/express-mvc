exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  // After clicking login btn, set Session in the request, be aware that you will find a new cookie called connect.sid also added in the browser. The cookie is for identify the user, but sensetive info is still stored in the session(Server).
  req.session.isLoggedIn = true;
  res.redirect('/');
};
