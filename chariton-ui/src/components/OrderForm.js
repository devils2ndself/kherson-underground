import _ from 'lodash';
import React, { useEffect } from 'react';
import { Box, Card, Typography, Button, CardMedia, CardContent, CardActions, Grid } from '@mui/material';
import scooter from '../assets/scooter.jpg';
import bike from '../assets/bike.jpg';

const OrderForm = ({ selectedRental }) => {
    useEffect(() => {
        console.log('Selected rental: ', selectedRental)
    }, [])

    return (
        <Card style={{ height: '100%', width: '100%'}}>

            { selectedRental._id !== '00' ?

                <div>
                    { selectedRental.type === 'scooter' ?
                        <CardMedia
                            component="img"
                            height="300"
                            image={scooter}
                            alt="scooter"
                        />
                        :
                        <CardMedia
                            component="img"
                            height="300"
                            image={bike}
                            alt="bike"
                        />
                    }

                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                            <Typography gutterBottom variant="h5" component="div">
                                    {_.toUpper(selectedRental.type)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom variant="h5" component="div">
                                    {selectedRental.tariff} per min
                                </Typography>
                            </Grid>
                        </Grid>
                        
                        { selectedRental.type === 'scooter' ?
                            <Typography variant="body2" color="text.secondary">
                                Battery: {selectedRental.battery}%
                            </Typography>
                            :
                            <Typography variant="body2" color="text.secondary">
                                  
                            </Typography>
                        }

                        <Typography variant="body2" color="text.secondary">
                            {selectedRental.location.lat} : {selectedRental.location.lng}
                        </Typography>

                    </CardContent>
                    { selectedRental.inUse ? 
                        <CardActions>
                            <Button variant="contained" disabled>Book</Button>
                            <Button variant="contained" color="success" disabled>Start ride</Button>
                            <Button variant="contained" color="error" disabled>End ride</Button>
                        </CardActions>
                        :
                        <CardActions>
                            <Button variant="contained">Book</Button>
                            <Button variant="contained" color="success">Start ride</Button>
                            <Button variant="contained" color="error">End ride</Button>
                        </CardActions>
                    }
                </div>

                :

                <div>
                    <Typography style={{marginTop: '60%', textAlign: 'center'}}>
                        Select vehicle
                    </Typography>
                </div>
            }

        </Card>
    );
};

export default OrderForm;
