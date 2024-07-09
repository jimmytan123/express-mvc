// Import statement
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session); // session storage
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');

const errorController = require('./controllers/error');
const User = require('./models/user');

require('dotenv').config();
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.rueh8it.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images'); // construct file upload destination
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname); // construct unloaded image file name
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Set templating engine - EJS
app.set('view engine', 'ejs');
app.set('views', 'views'); // set views folder as where the views are stored

// Import routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// Use Helmet that helps secure Express apps by setting HTTP response headers
app.use(helmet());
// Compression middleware - compress responses
app.use(compression());

// Register a middleware, do the body parsing for us
app.use(bodyParser.urlencoded({ extended: true }));
// IMPORTANT: Express from v4.16 has body-parser implemented. And you can use:
// app.use(express.urlencoded({ extended: true }));

// Use multer to handle file uploads(single file named image in the edit-product.ejs) - and stores it in the image folder
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

// Serving static files(public + images folder)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Register middleware for Session
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store, // Store session to the DB instead of memory by default
  })
);

// Register CSRF Protection
app.use(csrfProtection);

// Initialize flash
app.use(flash());

// Middleware to set local variables that pass into views
app.use((req, res, next) => {
  // isAuthenticated and csrfToken will be set for every request that renders views
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Register middleware for setting user in requests
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  // Retrive the user doc from DB by using the session user id
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) return next();

      req.user = user; // store user in the request
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

// Routes
// Starting as /admin
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

// Catch all route
app.use(errorController.get404);

// Error handling middleware(from passing next(error))
app.use((error, req, res, next) => {
  // res.redirect('/500');

  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT || 3000);
    console.log(`Server is running on port ${process.env.PORT || 3000}...`);
  })
  .catch((err) => {
    console.log(err);
  });
