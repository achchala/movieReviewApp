import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';

const pages = ['Landing', 'Review', 'Search', 'Recommendations'];

function MyAppBar({ currentPage }) {
  const theme = useTheme();
  const location = useLocation();

  return (
    <AppBar position="static" color="primary"> 
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" noWrap>
          <MovieFilterIcon
            fontSize="large"
            sx={{
              transition: 'transform 0.3s, color 0.3s', // Add transition for transform and color
              '&:hover': {
                transform: 'scale(1.2)', // Expand on hover
                color: theme.palette.primary.hover, // Change color on hover
              },
            }}
          /> 
        </Typography>

        <Box>
          {pages.map((page) => (
            <Link
              key={page}
              to={page === 'Landing' ? '/' : `/${page}`}
              style={{ textDecoration: 'none' }}
            >
              <Button
                sx={{
                  mx: 1,
                  color:
                    (location.pathname === `/${page}` && page !== 'Landing') // Check for other pages
                    || (page === 'Landing' && location.pathname === '/') // Check for the home page and "Landing"
                    ? theme.palette.primary.hover
                    : '#fff',
                  '&:hover': {
                    backgroundColor: currentPage === page ? undefined : theme.palette.primary.hover, // Disable hover effect for current page
                  },
                }}
              >
                {page}
              </Button>
            </Link>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default MyAppBar;
