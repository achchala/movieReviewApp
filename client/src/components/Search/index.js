import MyAppBar from '../MyAppBar';
import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { Typography, TextField, Button, Grid, Container, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


const Search = () => {
  const location = useLocation();
  const currentPage = location.pathname.substring(1); // Extract the current page from the URL
  const [movieTitle, setMovieTitle] = useState('');
  const [actorName, setActorName] = useState('');
  const [directorName, setDirectorName] = useState('');
  const [searchResults, setSearchResults] = useState([]);


  const handleMovieTitleChange = (event) => {
    setMovieTitle(event.target.value);
  };

  const handleActorNameChange = (event) => {
    setActorName(event.target.value);
  };

  const handleDirectorNameChange = (event) => {
    setDirectorName(event.target.value);
  };

  
  const handleSearch = () => {
    // Create the search criteria object
    const searchCriteria = {
      title: movieTitle.trim(),
      actor: actorName.trim(),
      director: directorName.trim(),
    };

    // Send the search criteria to the server
    fetch('/api/searchMovies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchCriteria),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Search results:', data);
        // Update the searchResults state with the retrieved data
        setSearchResults(data);
      })
      .catch((error) => {
        console.error('Error searching movies:', error);
      });
  };

  return (
    <>
      <MyAppBar currentPage={currentPage} />
      <div>
      <Typography variant="h4" align="center" pt={4}>Search By</Typography>
        <Container>
          <Box pt={2} pr={4} pb={2} pl={4}>
            <Grid container alignItems="center" spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Movie Title"
                  value={movieTitle}
                  onChange={handleMovieTitleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Actor Name"
                  value={actorName}
                  onChange={handleActorNameChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Director Name"
                  value={directorName}
                  onChange={handleDirectorNameChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  fullWidth
                  style={{ height: '56px' }} // Set the height of the button here (adjust as needed)
                  sx={{
                    ":hover": {
                      bgcolor: "#EE82B7",
                      color: "#ffffff"
                    }
                    }}
                >
                  <SearchIcon />
                </Button>
              </Grid>
            </Grid>
          </Box>


          {/* Display search results */}
          {searchResults.length > 0 && (
            <Box pt={2} pr={4} pb={2} pl={4}>
              <Typography variant="h6">Search Results</Typography>
              {searchResults.map((result, index) => (
                  <Box
                    key={index}
                    pt={1}
                    borderRadius={8}
                    bgcolor="#EE82B7" // Background color for the rounded box
                    p={2}
                    mb={2}
                    sx={{
                      color: 'white', // Font color for the content inside the box
                    }}
                >
                <Typography variant="subtitle1">Movie Title: {result.movieTitle}</Typography>
                  <Typography variant="subtitle2">Director: {result.directorName}</Typography>
                  {result.reviews && result.reviews.length > 0 && (
                    <>
                      <Typography variant="body1">Reviews:</Typography>
                      {result.reviews.map((review, reviewIndex) => (
                        <Typography key={reviewIndex} variant="body2">
                          - {review}
                        </Typography>
                      ))}
                    </>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Container>
      </div>
    </>
  );
};

export default Search;