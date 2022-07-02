import React from 'react';
import { Box, Card, Typography, Button, CardMedia, CardContent, CardActions, Grid } from '@mui/material';
import scooterBolt from '../assets/scooter_bolt.jpg';

const OrderForm = () => {
    return (
        <Card 
            style={{ height: '100%', width: '100%'}}
            // sx={{
            //     // backgroundColor: '#1976d2',
            //     border: '2px solid #1976d2',
            //     width: 100,
            //     height: 100,
            // }}
        >
            <CardMedia
                component="img"
                height="300"
                image={scooterBolt}
                alt="green iguana"
            />

            <CardContent>
                
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                    <Typography gutterBottom variant="h5" component="div">
                            Bolt Scooter
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography gutterBottom variant="h5" component="div">
                            1$ per min
                        </Typography>
                    </Grid>
                </Grid>
                    
                <Typography variant="body2" color="text.secondary">
                    Best scooter you ever seen
                </Typography>
            </CardContent>
            <CardActions>
                <Button variant="outline" size="small" color="secondary" disabled>Book</Button>
                <Button variant="contained" color="success">Start ride</Button>
                <Button variant="contained" color="error">End ride</Button>
            </CardActions>
        </Card>
    );
};

export default OrderForm;
