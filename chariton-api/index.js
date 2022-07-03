const express = require('express');
const cors = require('cors');


const mongoService = require('./services/mongoService')
const tonService = require('./services/tonService')
const convert = require('./convert/convert');
const previousRides = require('./models/previousRides');
const WsPay = require('./models/payment');

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
        data.tariff = (data.tariff * exRate).toFixed(2);
        res.json(data);
    })
})

app.post('/api/start', async (req, res) => { //req.body.id

    const currRental = await mongoService.getRentalById(req.body.id);
    const exRate = await convert.convert();
    var amount = (currRental.tariff * exRate).toFixed(2);
    WsPay(amount, 'start');

    res.statusCode = 201;
    res.setHeader('Content-Type', 'text/json');
    res.end();

})

app.post('/api/stop', async (req, res) => { //req.body.id
    console.log("Stoped");
    WsPay(null, 'stop');

    const currRental = await mongoService.getRentalById(req.body.id);
    const exRate = await convert.convert();
    var amount = (currRental.tariff * exRate).toFixed(2);

    var data = new previousRides(null, null, null, null, null);
    // 
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    //
    var tot = Number(amount);
    tot *= (req.body.time / 60);
    data.startDate = today;
    data.time = req.body.time;
    data.totalAmount = tot.toFixed(2);

    data.type = currRental.type;
    data.tariff = currRental.tariff;
    await mongoService.addPreviousRide(data);

    res.statusCode = 201;
    res.setHeader('Content-Type', 'text/json');
    res.end();
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