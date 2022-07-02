import React, { useEffect, useState } from 'react';
import Map from '../components/Map/Map';
import { useJsApiLoader } from '@react-google-maps/api';
import { Box, Typography, Grid, AppBar } from '@mui/material'
import OrderForm from '../components/OrderForm';
import { getRentals } from '../http/rentalAPI.js';

const MapPage = () => {
    const [ rentals, setRentals ] = useState([]);
    const [ selectedRental, setSelectedRental ] = useState({
        _id: '00',
        type: 'none',
        tariff: 0,
        barrery: 0,
        inUse: false,
        location: {
            lat: 0, lng: 0
        }
    });

    useEffect(() => {
        getRentals().then(data => {
            setRentals(data); 
            // console.log(data)
        })
    }, [])

    return (
        <AppBar component="main" position='fixed' style={{marginTop: 10, height: '100%', zIndex: -1, background: '#F9F9F9'}}> 

        <Box sx={{ flexGrow: 1 }} style={{marginTop: 70, marginLeft: 10, marginRight: 10}}>
            <Grid container spacing={2}>
                <Grid item xs={6} md={8}>
                    <Map rentals={rentals} setSelectedRental={setSelectedRental} />
                </Grid>
                <Grid item xs={6} md={4}>
                    <OrderForm selectedRental={selectedRental} />
                </Grid>
            </Grid>
      </Box>
       </AppBar>
    );
};

export default MapPage;
