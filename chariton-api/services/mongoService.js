const mongoose = require("mongoose");
const Rentals = require("../models/rentals");
const PreviousRides = require("../models/previousRides");
require('dotenv').config({
    path: `${__dirname}/../.env`
});

const conf = {
    dbUrl: process.env.DB_CON_STR,
    connectOptions: {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
};

async function connectMongo() {
    try {
        await mongoose.connect(conf.dbUrl, conf.connectOptions);
        console.log("DB listening at " + conf.dbUrl);
    } catch (err) {
        console.log(err);
    }
}

async function getAllRentals() {
    return new Promise((resolve, reject) => {
        Rentals.find().then(data => resolve(data)).catch(err => reject(err));
    })
}

function getRentalById(params) {
    return new Promise((resolve, reject) => {
        Rentals.findOne({
            _id: id
        }).then(data => resolve(data)).catch(err => reject(err));
        resolve();
    });

}

function addPreviousRide(params) {
    return new Promise((resolve, reject) => {
        PreviousRides(params).save().then();
        resolve();
    });

}

function getAllPopular(params) {

}

function getAllClose(params) {

}

function getBySearch(params) {

}

function getAllTotalDonated(params) {

}
module.exports = {
    connectMongo,
    getAllRentals
}