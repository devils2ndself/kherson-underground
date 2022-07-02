import React from 'react';
import {
  AppBar,
  Container,
  IconButton,
  Toolbar,
  Button,
  Box,
  Paper,
  MenuList,
  MenuItem,
  Stack,
  Typography,
  MenuIcon
} from '@mui/material';

const NavBar = () => {

  return (
      <AppBar component="nav" position='fixed'>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            RenTON
          </Typography>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Button sx={{ color: '#fff' }}>
                About
            </Button>
            <Button sx={{ color: '#fff' }}>
                Map
            </Button>
            <Button sx={{ color: '#fff' }}>
                Profile
            </Button>
          </Box>

        </Toolbar>
      </AppBar>
      
  );
};

export default NavBar;
