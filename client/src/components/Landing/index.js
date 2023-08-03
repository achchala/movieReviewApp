// NOTE: CAROUSEL IS FROM MaterialUI documentation (React Stepper Component)
//Credit: https://mui.com/material-ui/react-stepper/

import React from 'react';
import MyAppBar from '../MyAppBar';
import Typography from '@mui/material/Typography';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Carousel from './Carousel';
import Grid from '@mui/material/Grid';

const Landing = () => {
  const location = useLocation();
  const currentPage = location.pathname.substring(1) || 'Landing'; // Extract the current page from the URL
  const theme = useTheme(); // Get the theme object using the useTheme hook

  return (
    <div>
      <MyAppBar currentPage={currentPage} />
      <Typography
        variant="h2"
        align="center"
        pt={4}
        sx={{
          transition: 'transform 0.3s, color 0.3s', // Add transition for transform and color
          '&:hover': {
            transform: 'scale(1.2)', // Expand on hover
            color: theme.palette.primary.hover, // Change color on hover
          },
        }}
      >
        Welcome to the Movie App!
      </Typography>
      <Typography variant="body1" align="center" mt={2} color="text.secondary">
        Discover a wide selection of movies. Start building your watchlist today!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        component={Link} // Use the Link component
        to="/recommendations" // Specify the target route
        sx={{
          display: 'block',
          margin: 'auto',
          mt: 4,
          width: '300px', // Add a specific width to the button
          textAlign: 'center',
          ':hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        What to watch next?
      </Button>
      <Grid container justifyContent="center">
        <Carousel /> {/* Add the image slideshow */}
      </Grid>
    </div>
  );
};

export default Landing;
