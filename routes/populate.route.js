const express = require('express');

const router = express.Router();

const populateCpntroller = require('../controllers/populate.controller');


router.get('/', populateCpntroller);

module.exports = router;
