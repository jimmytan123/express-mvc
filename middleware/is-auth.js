module.exports = (req, res, next) => {
  // Protected route
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }

  // Continute to next middleware
  next();
};
