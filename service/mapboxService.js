'use strict';
const mongoose=require('mongoose');

const Users=require('../models/user').Users;
const fetch = require('node-fetch');

const accessToken  = 'pk.eyJ1Ijoic2hlc2hhbnRzaW5oYSIsImEiOiJjazhhamFwem4wMzBzM2twaWJpYmtuY290In0.qtDWqF-ubaeAkXLTIcQweA';

// service to get latlong from address
exports.getLatLong = async (address) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${accessToken}`; 
    return fetch(url)
    .then(res => res.json())
    .then((json) => {
        return json.features[0].center;
    }) 

}

 
