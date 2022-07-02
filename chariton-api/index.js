const express = require('express');
const cors = require('cors');

const mongoService = require('./services/mongoService')
const TonService = require('./services/tonService')

const port = process.env.PORT || 8080;

const app = express();

const tonService = new TonService();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'API is working properly.'});
})

app.get('/api/balance', (req, res) => {
    tonService.getBalance()
        .then(balance => {
            res.json(balance)
        })
        .catch(err => {
            res.status(500).json({message: err})
        })
})

mongoService.connectMongo()
    .then(()=> {
        // tonService.initWallets()
        //     .then(() => {
        //         app.listen(port, () => {
        //             console.log('App listening on port:', port)
        //         })
        //     })
        //     .catch(err => console.log('Error initializing wallets!'))
    })
    .catch(err => {
        console.log('Error connecting to the DB!')
    })