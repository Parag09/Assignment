'use strict';
const mongoose=require('mongoose');

const Users=require('../models/user').Users;
const user1=require('../models/user').Users;

const City = require('../models/city').City;
const crypto = require('crypto')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const NodeGeocoder = require('node-geocoder');
var ObjectID = require("mongodb").ObjectID;
const latservice = require('../service/mapboxService');
const filterservice = require('../service/filterService');

const { db } = require('../config/db');
// register the User
exports.register= (req,res) => {
    console.log(req.body);

    Users.find({email: req.body.email}, (err,data) => {
        if(data.length>=1){
            return res.status(400).json({
                success:false,
                message: 'user already exists'
            });
        }else{
            bcrypt.hash(req.body.password, 10, async (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'sorry! something happened, please try again'
                    });
                } else {

                    let city = await City.findOne({name : req.body.city});
                    let latlong = await latservice.getLatLong(req.body.address);

                    var user = new Users({
                        email: req.body.email,
                        password: hash,
                        city : city._id,
                        address : req.body.address,
                        location : {
                            type: "Point",
                            coordinates : latlong.reverse()
                        },
                        connections : []
                    });
                    user.save((err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({
                                success: false,
                                message: 'sorry! something happened,'
                            });
                        }else{
                            res.status(200).json({
                                success: true,
                                message: 'sucessfully registered'
                            });
                        }
                    });
                }
            });
        }
    });

};

// delete the User
exports.deleteuser= (req,res) => {
    var email=req.body.email;
    Users.remove({email:email}, (err,result) => {
        if(err){
            res.status(500).json({
                sucess:false,
                message: 'invalid user'
            });
        }else{
            res.status(200).json({
                success:true,
                message: 'user deleted'
            });

        }
    });
};

// login the User

exports.login= (req,res) => {
    console.log(req.body);
    Users.find({email: req.body.email}, (err,data) => {
       if(data.length<1 || err){
           return res.status(401).json({
               success: false,
               message: 'invalid user3'
           });
       }else{
           bcrypt.compare(req.body.password, data[0].password, (err,result)=> {
               if(err){
                   return res.status(401).json({
                       success: false,
                       message: 'invalid user1'
                   });
               }
               if(result){
                   var token= jwt.sign({
                       email: data[0].email,
                       userId: data[0]._id,
                       coordinates : data[0].location.coordinates,
                       city : data[0].city,
                   },
                       'secret',
                       {expiresIn:"1h"}
                       );
                   return res.status(200).json({
                       success: 'successfully logged in',
                       token: token
                   });
               }else {
                   return res.status(401).json({
                       success: false,
                       message: 'invalid user2'
                   });
               }
           });
       }
    });
};

// create connection with another person
exports.createConnection = ( async (req, res) => {
    const addconnectionId = await Users.findOne({ email : req.body.email});
    await Users.update({_id : req.userData.userId}, { $push : {connections : addconnectionId._id}});
    res.status(200).send("connection created");

})

// remove connection with another person
exports.removeConnection = ( async (req , res)=> {
    const removeconnectionId = await Users.findOne({ email : req.body.email});
    await Users.update({_id  : req.userData.userId} , { $pull :  { connections : removeconnectionId._id }});
    res.status(200).send("connection removed");

})

// show connection based on depth and city
exports.showConnection = ( async (req, res)=> {
    const cityarray = req.query.city;
    const cityIdArray  = await City.distinct( "_id" , { "uuid" : { $in  :  cityarray} } );
    cityIdArray.push(ObjectID(req.userData.city));
    const currentUserLatLong = req.userData.coordinates;
    const depth = req.query.depth;
    let aggregateResult = await Users.aggregate([
        {  
            $geoNear : {
                           near: { 
                             type: "Point",
                             coordinates 
                               : currentUserLatLong
                           },
                           key: "location",
                           maxdistance : 20000,
                           includeLocs: "location",
                           distanceField: "dist",
                           spherical: true
            }
        },
        { $graphLookup: {
                from: "users",
                startWith: "$connections",
                connectFromField: "connections",
                connectToField: "_id",
                maxDepth: Number(depth),
                depthField: "depth", 
                as: "connectFriends",
    
                }
        },
        { $match: { city: {$in : cityIdArray}}}

     ])

    let result = await filterservice.getFilterdata(aggregateResult , req.userData.email);
    res.send(result);

})
