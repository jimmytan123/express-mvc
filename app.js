// Import statement
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const pug = require('pug');

const app = express();

// Set templating engine
app.set('view engine', 'pug');
app.set('views', 'views'); // set views folder as where the views are stored
// Import routes
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Register a middleware, do the body parsing for us
app.use(bodyParser.urlencoded({ extended: true }));
// IMPORTANT: Express from v4.16 has body-parser implemented. And you can use:
// app.use(express.urlencoded({ extended: true }));

// Serviing static files(public folder)
app.use(express.static(path.join(__dirname, 'public')));

// Starting as /admin
app.use('/admin', adminData.routes);
app.use(shopRoutes);

// Catch all route
app.use((req, res, next) => {
  res.status(404).render('404');
});

app.listen(3000);
