// Import statement
const http = require('http');
const express = require('express');

const app = express();

// Middleware functions
app.use((req, res, next) => {
  console.log('In the middleware!');

  next(); // Allows the request to continue to the next middleware in line
});

app.use((req, res, next) => {
  console.log('In another middleware!');
  // ...
});

const server = http.createServer(app);

// Listen to port 3000 --- http://localhost:3000/
server.listen(3000);
