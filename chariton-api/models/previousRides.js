const mongoose = require("mongoose");

const PreviousRidesSchema = new mongoose.Schema({
    startDate: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now
    },
    totalAmount: {
        type: Number
    },
    type: {
        type: String
    },
    tariff: {
        type: Number
    }

});

module.exports = mongoose.model('previousRides', PreviousRidesSchema, "previousRides");