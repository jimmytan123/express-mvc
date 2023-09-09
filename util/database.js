const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // The default value
  database: 'node-udemy', //Schemas in MySQL
  password: 'jimmytan',
});

module.exports = pool.promise();
