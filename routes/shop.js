const path = require('path');
const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  //__dirname is an environment variable that tells you the absolute path of the directory containing the currently executing file.
  res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
});

module.exports = router;
