const express = require('express');
const router = express.Router();
const city = require('../controllers/city')


router.get('/getCities', city.getCities);
router.post('/addCities' , city.addCities);


module.exports = router;
