// Import statement
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();

// Set templating engine - EJS
app.set('view engine', 'ejs');
app.set('views', 'views'); // set views folder as where the views are stored

// Import routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Register a middleware, do the body parsing for us
app.use(bodyParser.urlencoded({ extended: true }));
// IMPORTANT: Express from v4.16 has body-parser implemented. And you can use:
// app.use(express.urlencoded({ extended: true }));

// Serving static files(public folder)
app.use(express.static(path.join(__dirname, 'public')));

// Register middleware for setting user to the request
// app.use((req, res, next) => {
//   User.findById('6658c6c9d2390b42df2c8af7')
//     .then((user) => {
//       /*
//        * Use the user data coming from the DB, create a User Object instance with that user data from db,
//        * and store User Object in the Request
//        */
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next();
//     })
//     .catch((err) => console.log(err));
// });

// Routes
// Starting as /admin
app.use('/admin', adminRoutes);
app.use(shopRoutes);
// Catch all route
app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://jimmy:T1G2DA4RfHxeKzn0@cluster0.rueh8it.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then((result) => {
    app.listen(3000);
    console.log('App listening in localhost:3000...');
  })
  .catch((err) => {
    console.log(err);
  });
