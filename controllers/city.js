const mongoose=require('mongoose');
const crypto = require('crypto')
const City=require('../models/city').City;


exports.getCities = async (req, res) => {
   let city =  await City.distinct("name");
   console.log(city);
   res.status(200).send(city);
}
exports.addCities = async (req, res) => {
 let cityname = req.body.name;
 let randomUUId = crypto.randomBytes(8).toString('hex');
 let city = new City({
     name : cityname,
     uuid : randomUUId,
 })

 await city.save();
 res.status(200).send('city added')
}



