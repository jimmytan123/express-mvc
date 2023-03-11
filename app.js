// Import statement
const http = require('http');
const express = require('express');

const app = express();

const server = http.createServer(app);

// Listen to port 3000 --- http://localhost:3000/
server.listen(3000);
