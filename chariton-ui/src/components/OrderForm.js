import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Card, Typography, Button, CardMedia, CardContent, CardActions, Grid } from '@mui/material';
import scooter from '../assets/scooter.jpg';
import bike from '../assets/bike.jpg';
import { updateStart, updateStop } from '../http/rentalAPI';

const RentalStatuses = {
    BOOKED: 'booked',
    STARTED: 'started',
    ENDED: 'ended',
    NONE: 'none'
}

const OrderForm = ({ selectedRental, setSelectedRental, setIsSelectedMap, setSelectedMap }) => {
    const [ rentalStatus, setRentalStatus ] = useState(RentalStatuses.NONE);
    const [ time, setTime ] = useState(0);
    const [ isActive, setIsActive ] = useState(false);
    const [ isStarted, setIsStarted ] = useState(false);
    let totalSeconds = 0;
    let timer = useRef(null);
    
    const defaultRentObject = {
        _id: '00',
        type: 'none',
        tariff: 0,
        barrery: 0,
        inUse: false,
        location: {
            lat: 0, lng: 0
        }
    }

    useEffect(() => {
    }, []);

    const plusSecond = () => {
        setTime(prev => prev + 1);
    }

    /**
     * Function to start timer for tracking down rental time
     */
    const startTimer = () => {
        if(timer) {
            clearInterval(timer)
        }
        setTime(0);
        totalSeconds = 0;
        const callback = plusSecond;
        timer = setInterval(callback, 1000);
    }

    /**
     * Function to post http request for start rent 
     * @param {number} id rental object id
     * @returns {object}
     */
    const updateStartApi = (id) => {
        if (isStarted) {
            return;
        }
        setIsStarted(true);
        return updateStart(id);
    }

    /**
     * Function to post http request for stop rent
     * @param {number} id rental object id
     * @param {number} totalSeconds rental time
     * @returns {object}
     */
    const updateStopApi = (id, totalSeconds) => {
        if (!isStarted) {
            return;
        }
        setIsStarted(false);
        return updateStop(id, totalSeconds);
    }

    /**
     * Function to change rental status
     * Buttons (Hold, Start, Stop) access (enabled/disabled) depends on status
     * @param {string} status none/booked/started/ended 
     */
    const changeRentalStatus = (status) => {
        setRentalStatus(status);

        switch (status) {
            case RentalStatuses.BOOKED:
                setIsSelectedMap(true)
                setSelectedMap({
                    center: selectedRental.location,
                    zoom: 18,
                    type: selectedRental.type
                })
                break;
            case RentalStatuses.STARTED:
                setIsSelectedMap(true)
                setSelectedMap({
                    center: selectedRental.location,
                    zoom: 18,
                    type: selectedRental.type
                })
                break;
            case RentalStatuses.ENDED:
                setIsSelectedMap(false)
                setSelectedMap({
                    center: [50.450001, 30.523333],
                    zoom: 15,
                    type: selectedRental.type
                })
                setSelectedRental(defaultRentObject)
                break;
            case RentalStatuses.NONE:
                break;   
            default:
        }
    }

    const handleUndefinedActive = () => {
        setIsActive(false);
    }

    return (
        <div style={{height: '100%'}} >

            <Card style={{ height: 'calc(100% - 60px)', width: '100%', marginBottom: '8px'}}>

                { !isActive ?
                    selectedRental._id !== '00' ?
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
                                            {selectedRental.tariff} TON per min
                                        </Typography>
                                    </Grid>
                                </Grid>
                                
                                { selectedRental.type === 'scooter' &&
                                    <Typography variant="body2" color="text.secondary">
                                        Battery: {selectedRental.battery}%
                                    </Typography>
                                }

                                <Typography variant="body2" color="text.secondary">
                                    Locale: {selectedRental.location.lat} : {selectedRental.location.lng}
                                </Typography>

                                {(rentalStatus === RentalStatuses.BOOKED || rentalStatus === RentalStatuses.STARTED) &&
                                    <Typography variant="body2" color="text.secondary">
                                        Time: { time }
                                    </Typography>
                                }
                            </CardContent>
                        </div>
                        :
                        <div>
                            <Typography style={{marginTop: '60%', textAlign: 'center'}}>
                                Select vehicle
                            </Typography>
                        </div>
                    :
                    <div>
                        <Typography style={{marginTop: '60%', textAlign: 'center'}}>
                            You have an active session
                        </Typography>
                    </div>
                }
            </Card>

            <Card style={{ height: '52px', width: '100%'}}>

                {!isActive ? 
                    selectedRental.inUse || selectedRental._id === '00' ? 
                        <CardActions>
                            <Button style={{width: '33%'}} variant="contained" disabled>Hold</Button>
                            <Button style={{width: '33%'}} variant="contained" color="success" disabled>Start ride</Button>
                            <Button style={{width: '33%'}} variant="contained" color="error" disabled>End ride</Button>
                        </CardActions>
                        :
                        rentalStatus === RentalStatuses.NONE ?
                            <CardActions>
                                <Button style={{width: '33%'}} variant="contained" onClick={() => { updateStartApi(selectedRental._id); changeRentalStatus(RentalStatuses.BOOKED); startTimer(); }}>Hold</Button>
                                <Button style={{width: '33%'}} variant="contained" color="success" onClick={() => { updateStartApi(selectedRental._id); changeRentalStatus(RentalStatuses.STARTED); startTimer(); }} >Start ride</Button>
                                <Button style={{width: '33%'}} variant="contained" color="error" disabled >End ride</Button>
                            </CardActions>
                            :
                            rentalStatus === RentalStatuses.BOOKED ?
                                <CardActions>
                                    <Button style={{width: '33%'}} variant="contained" disabled >Hold</Button>
                                    <Button style={{width: '33%'}} variant="contained" color="success" onClick={() => changeRentalStatus(RentalStatuses.STARTED)} >Start ride</Button> {/* не нужно перезапускать таймер */}
                                    <Button style={{width: '33%'}} variant="contained" color="error" onClick={() => { totalSeconds = time; updateStopApi(selectedRental._id, totalSeconds); changeRentalStatus(RentalStatuses.ENDED); }} >End ride</Button>
                                </CardActions>
                                :
                                rentalStatus === RentalStatuses.STARTED ?
                                    <CardActions>   
                                        <Button style={{width: '33%'}} variant="contained" disabled >Hold</Button>
                                        <Button style={{width: '33%'}} variant="contained" color="success" disabled >Start ride</Button>
                                        <Button style={{width: '33%'}} variant="contained" color="error" onClick={() => { totalSeconds = time; updateStopApi(selectedRental._id, totalSeconds); changeRentalStatus(RentalStatuses.ENDED); }}>End ride</Button>
                                    </CardActions>
                                    :
                                    rentalStatus === RentalStatuses.ENDED &&
                                        <CardActions>   
                                            <Button style={{width: '33%'}} variant="contained" onClick={() => { updateStartApi(selectedRental._id); changeRentalStatus(RentalStatuses.BOOKED); startTimer(); }} >Hold</Button>
                                            <Button style={{width: '33%'}} variant="contained" color="success" onClick={() => { updateStartApi(selectedRental._id); changeRentalStatus(RentalStatuses.STARTED); startTimer();}} >Start ride</Button>
                                            <Button style={{width: '33%'}} variant="contained" color="error" disabled >End ride</Button>
                                        </CardActions>
                    :
                    <CardActions>   
                        <Button style={{width: '33%'}} variant="contained" disabled >Hold</Button>
                        <Button style={{width: '33%'}} variant="contained" color="success" disabled >Start ride</Button>
                        <Button style={{width: '33%'}} variant="contained" color="error" onClick={() => handleUndefinedActive()} >End ride</Button>
                    </CardActions>
                }
            </Card>
        </div>
    );
};

export default OrderForm;
