import MyAppBar from '../MyAppBar';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { Button, Box, Dialog, DialogTitle, InputLabel, Popover, DialogContent, TextField, FormControl, Select, MenuItem, Chip, Stack, OutlinedInput, Paper} from '@mui/material'; // Import OutlinedInput from the correct package
import CancelIcon from '@mui/icons-material/Cancel';

const Recommendations = () => {
  const location = useLocation();
  const currentPage = location.pathname.substring(1); // Extract the current page from the URL
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [openWatchlist, setOpenWatchlist] = useState(false);
  const [showRecommendationsForm, setShowRecommendationsForm] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [userID, setUserID] = React.useState(1);
  const [watchlistMovies, setWatchlistMovies] = useState([]); 
  const [isAlreadyInWatchlist, setIsAlreadyInWatchlist] = useState(false);
  const [alreadyInWatchlistMovie, setAlreadyInWatchlistMovie] = useState('');



  const handleOpenWatchlist = () => {
    console.log(watchlistMovies);
    setOpenWatchlist(true);
  };

  const handleCloseWatchlist = () => {
    setOpenWatchlist(false);
  };

  const handleGetRecommendations = () => {
    setShowRecommendationsForm(true);
    setAnchorEl(null); // Reset the anchorEl state to null when opening the form
  };

  const handleRecommendationsSubmit = (event) => {
    event.preventDefault();
  
    // Make sure there are selected genres before fetching recommendations
    if (selectedGenres.length === 0) {
      alert('Please select at least one preferred genre.');
      return;
    }
  
    // Prepare the data to be sent to the server
    const requestData = {
      genres: selectedGenres,
    };
  
    // Replace 'yourApiEndpoint' with the actual endpoint to fetch recommended movies
    fetch('/api/getRecommendedMovies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Assuming the response contains an array of recommended movies
        // with movie titles and genres.
        // If your API returns different data, adjust the following code accordingly.
  
        // Create an object to store aggregated movie data (movie titles as keys)
        const aggregatedMovies = {};
  
        // Loop through each movie in the response data
        data.forEach((movie) => {
          // If the movie title is already in the aggregatedMovies object,
          // add the genre to the existing movie entry
          if (aggregatedMovies[movie.movieTitle]) {
            aggregatedMovies[movie.movieTitle].genres.push(movie.genre);
          } else {
            // If the movie title is not yet in the aggregatedMovies object,
            // create a new entry with the movie title and genres array
            aggregatedMovies[movie.movieTitle] = {
              title: movie.movieTitle,
              genres: [movie.genre],
              id: movie.id, // Include the movie id in the object
              averageRating: movie.averageRating
            };
          }
        });
  
        // Convert the aggregatedMovies object back to an array
        const aggregatedMoviesArray = Object.values(aggregatedMovies);
  
        setRecommendedMovies(aggregatedMoviesArray);
        setShowRecommendationsForm(false); // Hide the recommendations form after getting results
      })
      .catch((error) => {
        console.error('Error fetching recommended movies:', error);
      });
  };
  

  const handleAddToWatchlist = async (movie) => {
    console.log(movie);
    console.log(watchlistMovies);
    // Check if the movie is already in the watchlist
    if (watchlistMovies.some((item) => item.movieTitle === movie.title)) {
      // Movie is already in the watchlist, set the state to show the popup
      setIsAlreadyInWatchlist(true);
      setAlreadyInWatchlistMovie(movie.title);
      return;
    }
  
    // If the movie is not in the watchlist, proceed with adding it
    const requestData = {
      userID: userID,
      movieID: movie.id, // Use the movie_id from the 'recommendedMovies' data
    };
  
    try {
      // Make a request to the server to add the movie to the watchlist
      const response = await fetch('/api/addToWatchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
  
      // Check if the movie was added to the watchlist successfully
      if (data.success) {
        // Fetch the updated watchlist after adding the movie
        await fetchUserWatchlist();
        setIsAlreadyInWatchlist(false);
        setAlreadyInWatchlistMovie('');
      } else {
        // Handle error, e.g., show an error message
      }
    } catch (error) {
      console.error('Error adding movie to watchlist:', error);
    }
  };
  

  const handleRemoveFromWatchlist = async (movie) => {
    console.log('Removing movie from watchlist:', movie);
    const requestData = {
      userID: userID,
      movieID: movie.movieID
    };
  
    try {
      // Make a request to the server to remove the movie from the watchlist
      const response = await fetch('/api/removeFromWatchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
  
      // Check if the movie was removed from the watchlist successfully
      if (data.success) {
        // Fetch the updated watchlist after removing the movie
        await fetchUserWatchlist();
      } else {
        // Handle error, e.g., show an error message
      }
    } catch (error) {
      console.error('Error removing movie from watchlist:', error);
    }
  };
  
  
  const fetchUserWatchlist = () => {
    fetch('/api/getUserWatchlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userID }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Watchlist data received:', data);
        // Assuming the response contains an array of movie objects with movie_id and movieTitle
        setWatchlistMovies(data);
      })
      .catch((error) => {
        console.error('Error fetching user watchlist:', error);
      });
  };
  

  React.useEffect(() => {
    fetchUserWatchlist();
  }, []);

  const [genres, setGenres] = React.useState([]);

  React.useEffect(() => {
    fetch('/api/getGenres', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        // Assuming the response contains an array of objects with a 'genre' property
        const genresArray = data.map(item => item.genre);
        setGenres(genresArray); // Assign the received genres list to the 'genres' state
        console.log('Updated genres state:', genresArray);
      })
      .catch(error => {
        console.error('Error fetching genres:', error);
      });
  }, []);

  const handleOpenDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setDropdownOpen(true); // Show the dropdown
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false); // Hide the dropdown when clicking outside
  };

  return (
    <>
      <MyAppBar currentPage="Recommendations" />
      <Typography variant="h4" align="center" pt={4}>
      What to watch next?
      </Typography>
      <Box display="flex" justifyContent="center" mt={3}>
        <Box mx={1}>
          <Button
            variant="contained"
            onClick={handleOpenWatchlist}
            sx={{
              ":hover": {
                bgcolor: "#EE82B7",
                color: "#ffffff"
              }
            }}
          >
            My Watchlist
          </Button>
        </Box>
        <Box mx={1}>
          <Button
            variant="contained"
            onClick={handleGetRecommendations}
            sx={{
              ":hover": {
                bgcolor: "#EE82B7",
                color: "#ffffff"
              }
            }}
          >
            Get New Recommendations
          </Button>
        </Box>
      </Box>

      <Dialog open={openWatchlist} onClose={handleCloseWatchlist}>
  <DialogTitle>My Watchlist</DialogTitle>
  <DialogContent>
  {watchlistMovies.length > 0 ? (
  // Display watchlist movies if there are any
  watchlistMovies.map((movie) => (
    <Box key={movie.movieTitle} pt={1}>
      <Typography variant="subtitle1">{movie.movieTitle}</Typography>
      <Button variant="contained" onClick={() => handleRemoveFromWatchlist(movie)}>
        Remove from Watchlist
      </Button>
    </Box>

      ))
    ) : (
      // Show a message if the watchlist is empty
      <Typography variant="body1">Your watchlist is empty.</Typography>
    )}
  </DialogContent>
</Dialog>

      {showRecommendationsForm && (
        <Box mt={2}>
          <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <Button
              variant="outlined"
              onClick={handleOpenDropdown}
              sx={{
                ":hover": {
                  bgcolor: "#EE82B7",
                  color: "#ffffff"
                }
              }}
            >
              Select Preferred Genres
            </Button>
            <Popover
        open={isDropdownOpen}
        anchorEl={anchorEl}
        onClose={handleCloseDropdown}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <FormControl sx={{ m: 1, width: 500 }}>
          <InputLabel>Select Preferred Genres</InputLabel>
          <Select
            multiple
            value={selectedGenres}
            onChange={(event) => setSelectedGenres(event.target.value)}
            input={<OutlinedInput label="Select Preferred Genres" />} 
            renderValue={(selected) => (
              <Stack gap={1} direction="row" flexWrap="wrap">
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    onDelete={() =>
                      setSelectedGenres(
                        selectedGenres.filter((item) => item !== value)
                      )
                    }
                    deleteIcon={
                      <CancelIcon
                        onMouseDown={(event) => event.stopPropagation()}
                      />
                    }
                  />
                ))}
              </Stack>
            )}
          >
            {genres.map((genre) => (
              <MenuItem
                key={genre}
                value={genre}
                sx={{ justifyContent: "space-between" }}
              >
                {genre}
                {selectedGenres.includes(genre) ? <CancelIcon color="info" /> : null}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, pb: 2}}>
          <Button variant="contained" onClick={handleRecommendationsSubmit}>
          Get Recommendations
          </Button>
        </Box>
      </Popover>
          </Box>
        </Box>
      )}

{recommendedMovies.length > 0 && (
  <Box pt={2} pr={6} pb={2} pl={6}>
    <Typography variant="h5">Recommended Movies</Typography>
    {recommendedMovies.map((movie) => (
      <Box
        key={movie.title}
        pt={1}
        borderRadius={8}
        bgcolor="#EE82B7" // Background color for the rounded box
        p={2}
        mb={2}
        sx={{
          color: 'white', // Font color for the content inside the box
          textAlign: 'center', // Center the text inside the box
        }}
      >
        <Typography variant="subtitle1">Movie Title: {movie.title}</Typography>
        {movie.genres.length > 0 && (
          <Typography variant="body1">Genres: {movie.genres.join(', ')}</Typography>
        )}
        {movie.averageRating ? (
          <Typography variant="body1">Average Rating: {movie.averageRating}</Typography>
        ) : (
          <Typography variant="body1">No Ratings Yet</Typography>
        )}
        <Button variant="contained" onClick={() => { 
          console.log("Movie object:", movie);
          handleAddToWatchlist(movie);
        }}>
          Add to Watchlist
        </Button>
      </Box>
    ))}
  </Box>
)}
    {/* Popup dialog for "already in your watchlist" message */}
    <Dialog open={isAlreadyInWatchlist} onClose={() => setIsAlreadyInWatchlist(false)}>
      <DialogTitle>Already in Your Watchlist</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          {alreadyInWatchlistMovie} is already in your watchlist.
        </Typography>
      </DialogContent>
    </Dialog>
  </>
);
};

export default Recommendations;