import React from 'react';
import Map from '../components/Map/Map';
import { useJsApiLoader } from '@react-google-maps/api';
import { Box, Typography, Grid } from '@mui/material'
import OrderForm from '../components/OrderForm';

const MapPage = () => {

    return (
        <Box sx={{ flexGrow: 1 }} style={{marginTop: 70}}>
            <Grid container spacing={2}>
                <Grid item xs={6} md={8}>
                    <Map />
                </Grid>
                <Grid item xs={6} md={4}>
                    <OrderForm />
                </Grid>
            </Grid>
      </Box>
    );
};

export default MapPage;
