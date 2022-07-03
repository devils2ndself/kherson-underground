import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar';
import { Box } from '@mui/material';

const App = () => {
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex' }}>
        <NavBar />
        <AppRouter />
      </Box>
    </BrowserRouter>
  );
};

export default App;
