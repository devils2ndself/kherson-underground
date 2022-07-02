const express = require('express');
const cors = require('cors');

const mongoService = require('./services/mongoService')
const tonService = require('./services/tonService')

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
    mongoService.getAllRentals().then((data) => {

        res.json(data);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

// app.get('/api/rentals', (req, res) => {
//     mongoService.getAllRentals().then((data) => {

//         res.json(data);
//     })
// })

mongoService.connectMongo()
    .then(() => {
        app.listen(port, () => {
            console.log('App listening on port:', port)
        })
    })
    .catch(err => {
        console.log(err)
    })