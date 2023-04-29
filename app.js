// Import statement
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const errorController = require('./controllers/error');

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

app.listen(3000);
console.log('Listening in port 3000...');
