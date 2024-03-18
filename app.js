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

// Serviing static files(public folder)
app.use(express.static(path.join(__dirname, 'public')));

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
    //console.log(result);
    app.listen(3000);
    console.log('Listening in port 3000...');
  })
  .catch((err) => {
    console.log(err);
  });
