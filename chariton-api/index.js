const express = require('express');
const cors = require('cors');

const mongoService = require('./services/mongoService')
const tonService = require('./services/tonService')

const port = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'API is working properly.'});
})

app.get('/api/charities', (req, res) => {
    mongoService.getAllCharities().then((data) => {
        
        res.json({message: 'In progress'});
    })
})

app.listen(port, () => {
    console.log('App listening on port:', port)
})