const mongodb = require('mongodb');
require('dotenv').config();

function connectMongo() {
    return new Promise((resolve, reject) => {
        // mongodb.connect(process.env.DB_CON_STR).then()
        resolve()
    })
}

function getAllCharities() {
    return new Promise((resolve, reject) => {
        // mongodb.find().then(data => resolve(data)).catch(err => reject(err))d
    })
}

module.exports = {
    connectMongo,
    getAllCharities
}