import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, AppBar, Toolbar, Grid, Stepper, StepLabel, Step, Paper, StepContent, IconButton, Avatar, Alert, AlertTitle } from '@mui/material'
import { RouteNames } from '../router';
import toncoinIcon from '../assets/toncoinIcon.png';
import sendIcon from '../assets/sendIcon.png';

const steps = [
    {
        label: '',
        description: `RenTON allows you to rent things by crypto.`,
    },
    {
        label: 'Believe it',
        description: 'Ordinary rent ? But future starts here.',
    },
    {
        label: 'The great stands for the small',
        description: `Opportunities open up with every new step.`,
    },
    {
        label: 'And here it is',
        description: `Simple but smart.`,
    },
    {
        label: 'No more lie',
        description: `Smart-contracts leave no chance for scammers.`,
    },
    {
        label: 'New approach',
        description: `It's not banking. It's a new world.`,
    },
    {
        description: `The run has begun. And we stand at the root.`,
    },
];

const MainPage = () => {
    const router = useNavigate();
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
    
        <Grid container spaceing={2} style={{marginTop: 50}}>
            <Grid item xs={4} style={{marginTop: 40}}>
                <Box sx={{ marginTop: 0, marginLeft: 3, maxWidth: 400 }}>
                        <Alert severity="info" style={{width: 350, marginBottom: 20}}>
                            <AlertTitle>What about idea ?</AlertTitle>
                            Short description — <strong>check it out!</strong>
                        </Alert>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel
                            
                            >
                            {step.label}
                            </StepLabel>
                            <StepContent>
                            <Typography>{step.description}</Typography>
                            <Box sx={{ mb: 2 }}>
                                <div>
                                    {index === steps.length - 1 ? 

                                        <Button
                                            variant="contained"
                                            style={{background: '#0088cc'}}
                                            onClick={handleNext}
                                            sx={{ mt: 1, mr: 1 }}
                                            startIcon={<Avatar src={toncoinIcon} style={{height: 20, width: 20, border: 'solid white'}} />}
                                        >
                                            Got it
                                        </Button>
                                        :
                                        <Button
                                            variant="outlined"
                                            color='primary'
                                            onClick={handleNext}
                                            sx={{ mt: 1, mr: 1 }}
                                            style={{height: 25, width: 80}}
                                        >
                                            Next
                                        </Button>
                                    }
                                    
                                    <Button
                                        disabled={index === 0}
                                        onClick={handleBack}
                                        sx={{ mt: 1, mr: 1 }}
                                        style={{height: 25, width: 80}}
                                        size='small'
                                    >
                                        Back
                                    </Button>
                                </div>
                            </Box>
                            </StepContent>
                        </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length && (
                        <Paper square elevation={0} sx={{ p: 3 }}>
                        <Typography>Let&apos;s try !</Typography>
                        <Button 
                            onClick={() => router(RouteNames.MAP)} 
                            sx={{ mt: 1, mr: 1 }} 
                            variant="outlined"
                            endIcon={<Avatar src={sendIcon} style={{height: 20, width: 20, border: 'solid white', background: 'white'}} />}
                        >
                            Go to map
                        </Button>
                        </Paper>
                    )}
                </Box>
            </Grid>

            <Grid item xs={8} style={{ marginTop: 80 }}>
                <iframe width="900" height="510" src="https://www.youtube.com/embed/YhNCaAd3N3I" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </Grid>
        </Grid>
    
        
    );
};

// const MainPage = () => {
//     const steps = [
//         'Join RenTON',
//         'Open map',
//         'Select vehicle',
//         'Start ride',
//         'Have fun',
//       ];
//     return (
//         <AppBar component="main" position='fixed' style={{marginTop: 0, height: '100%', zIndex: -1}}>
//             <Box sx={{ width: '100%', marginTop: '30%' }}>
//                 <Stepper activeStep={0} alternativeLabel style={{background: 'white', paddingTop: 10, paddingBottom: 10}}>
//                     {steps.map((label) => (
//                     <Step key={label} sx={{borderColor: 'red'}}>
//                         <StepLabel>{label}</StepLabel>
//                     </Step>
//                     ))}
//                 </Stepper>
//             </Box>
//         </AppBar>
//     );
// };

export default MainPage;
