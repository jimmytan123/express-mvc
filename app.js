// Import statement
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Register a middleware, do the body parsing for us
app.use(bodyParser.urlencoded({ extended: true }));

// IMPORTANT: Express from v4.16 has body-parser implemented. And you can use:
// app.use(express.urlencoded({ extended: true }));

app.use('/add-product', (req, res, next) => {
  res.send(
    '<form action="/product" method="POST"><input type="text" name="title"/><button type="submit">Add Product</button></form>'
  );
});

app.use('/product', (req, res) => {
  console.log(req.body);
  res.redirect('/');
});

app.use('/', (req, res, next) => {
  res.send('<h1>Hello from express!</h1>');
});

app.listen(3000);
