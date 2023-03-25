// Import statement
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Import routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Register a middleware, do the body parsing for us
app.use(bodyParser.urlencoded({ extended: true }));

// IMPORTANT: Express from v4.16 has body-parser implemented. And you can use:
// app.use(express.urlencoded({ extended: true }));

// Starting as /admin
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Catch all route
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);
