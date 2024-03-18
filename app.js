// Import statement
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
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
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      // Store user field to the request
      req.user = user;

      next();
    })
    .catch((err) => console.log(err));
});

// Starting as /admin
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Catch all route
app.use(errorController.get404);

// Set SQL model relationship
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize
  .sync() // Look at the defined models then create tables for them automatically. If exist, won't create/overwrite them.
  .then((result) => {
    return User.findByPk(1);
    //console.log(result);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Jim', email: 'test@test.com' });
    }

    return user;
  })
  .then((user) => {
    console.log(user);
    app.listen(3000);
    console.log('Listening in port 3000...');
  })
  .catch((err) => {
    console.log(err);
  });
