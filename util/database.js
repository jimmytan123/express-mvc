const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-udemy', 'root', 'jimmytan', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
