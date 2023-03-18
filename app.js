// Import statement
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

app.use(adminRoutes);
app.use(shopRoutes);

app.listen(3000);
