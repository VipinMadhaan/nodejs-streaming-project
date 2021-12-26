const express = require('express');

const router = express.Router();

const searchController = require('../controllers/search.controller');


router.use('/', searchController);

module.exports = router;
