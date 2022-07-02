const express = require('express');
const cors = require('cors');


const mongoService = require('./services/mongoService')
const tonService = require('./services/tonService')
const convert = require('./convert/convert')
const port = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'API is working properly.'
    });
})

app.get('/api/rentals', (req, res) => {
    mongoService.getAllRentals().then(async (data) => {
        const exRate = await convert.convert();
        data.forEach(element => {
            element.tariff = (element.tariff * exRate).toFixed(2);
        });
        res.json(data);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

app.get('/api/previousRides', (req, res) => {
    mongoService.getAllPreviousRides().then((data) => {

        res.json(data);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

// пусть будет
// app.get('/api/exchangeRate', (req, res) => {
//     convert.convert().then((data) => {
//         res.json(data);
//     }).catch(err => {
//         console.log(err);
//         res.status.json(err);
//     })
// })

app.get('/api/rentals/:id', async (req, res) => {
    const exRate = await convert.convert();
    mongoService.getRentalById(req.params.id).then(async (data) => {
        data.tariff = (element.tariff * exRate).toFixed(2);
        res.json(data);
    })
})

mongoService.connectMongo()
    .then(() => {
        app.listen(port, () => {
            console.log('App listening on port:', port)
        })
    })
    .catch(err => {
        console.log(err)
    })