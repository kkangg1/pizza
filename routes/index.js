const express = require('express');
const db = require('../db');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.redirect('/users/');
});
module.exports = router;
