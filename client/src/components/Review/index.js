import MyAppBar from '../MyAppBar';
import React, { useState } from 'react';
import { Typography, Button, Grid, Container, Box } from '@mui/material';
import ReviewTitle from './ReviewTitle';
import ReviewBody from './ReviewBody';
import ReviewRating from './ReviewRating';
import MovieSelection from './MovieSelection';
import { useLocation } from 'react-router-dom';

const Review = () => {
  const location = useLocation();
  const currentPage = location.pathname.substring(1); // Extract the current page from the URL
  // State variables to store form data and UI states
  const [selectedMovie, setSelectedMovie] = useState('');
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredReview, setEnteredReview] = useState('');
  const [selectedRating, setSelectedRating] = useState(null);
  const [errors, setErrors] = useState({
    movieError: '',
    titleError: '',
    reviewError: '',
    ratingError: '',
  });
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [submittedData, setSubmittedData] = useState({});
  /*const [movies, setMovies] = useState([
    "How to Lose a Guy in 10 Days",
    "Legally Blonde",
    "Crazy, Stupid, Love",
    "Love, Rosie",
    "He's Just Not That Into You",
  ]);*/
  const [movies, setMovies] = React.useState([]);
  const [userID, setUserID] = React.useState(1);

  // Event handlers for form inputs
  const handleMovieChange = (event) => {
    const movieId = parseInt(event.target.value);
    console.log('Selected movie ID:', movieId);
    console.log('Movies:', movies);
    
    const selectedMovieObj = movies.find((movie) => movie.id === movieId);
    console.log('Selected movie object:', selectedMovieObj);
    
    setSelectedMovie(selectedMovieObj);
  };
  

  const handleTitleChange = (event) => {
    setEnteredTitle(event.target.value);
  };

  const handleReviewChange = (event) => {
    setEnteredReview(event.target.value);
  };

  const handleRatingChange = (event) => {
    setSelectedRating(event.target.value);
  };

  // Clear form fields (to be called upon successful submission)
  const clearFields = () => {
    setSelectedMovie('');
    setEnteredTitle('');
    setEnteredReview('');
    setSelectedRating(null);
  };

// Form submission handler
const handleSubmit = (event) => {
  event.preventDefault();

  // Validation checks
  let hasErrors = false;
  //newErrors is an object to hold error messages, if they need to be displayed
  const newErrors = {
    movieError: '',
    titleError: '',
    reviewError: '',
    ratingError: '',
  };

  // Check if the required form fields are filled out
  if (!selectedMovie) {
    newErrors.movieError = 'Select your movie';
    hasErrors = true;
  }

  if (!enteredTitle) {
    newErrors.titleError = 'Enter your review title';
    hasErrors = true;
  }

  if (!enteredReview) {
    newErrors.reviewError = 'Enter your review';
    hasErrors = true;
  }

  if (!selectedRating) {
    newErrors.ratingError = 'Select the rating';
    hasErrors = true;
  }

  // Update the errors state with the validation results
  setErrors(newErrors);

  if (hasErrors) {
    setConfirmationMessage('');
    return;
  }

  // Prepare the review data to be submitted
  const newSubmittedData = {
    selectedMovie: selectedMovie.name,
    movieId: selectedMovie.id,
    userId: userID,
    reviewTitle: enteredTitle,
    reviewContent: enteredReview,
    reviewScore: selectedRating,
  };

  // Call the addReview API endpoint
  fetch('/api/addReview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newSubmittedData),
  })
    .then(response => response.json())
    .then(data => {
      console.log('API response:', data); // Log the API response
      setConfirmationMessage('Your review has been received');
      setSubmittedData(newSubmittedData);
      setErrors({
        movieError: '',
        titleError: '',
        reviewError: '',
        ratingError: '',
      });
      clearFields();
    })
    .catch(error => {
      console.error('Error submitting review:', error);
    });
};

  React.useEffect(() => {
    fetch('/api/getMovies', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        setMovies(data); // Assign the received movies list to the 'movies' state
        console.log('Updated movies state:', movies);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      });
  }, []);
  

  return (
    <div>
      <MyAppBar currentPage={currentPage} />
      <Typography variant="h4" align="center" pt={4}>Add a Review</Typography>
      <Container>
        {/* Form section */}
        <Box pt={2} pr={4} pb={2} pl={4}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {/* Component for movie selection */}
                <MovieSelection
                  selectedMovie={selectedMovie}
                  handleMovieChange={handleMovieChange}
                  movies={movies}
                />
                {/* Display error message if movie selection is not made */}
                {errors.movieError && <Typography variant="body2" color="error">{errors.movieError}</Typography>}
              </Grid>
              <Grid item xs={12}>
                {/* Component for review title input */}
                <ReviewTitle enteredTitle={enteredTitle} handleTitleChange={handleTitleChange} />
                {/* Display error message if review title is not entered */}
                {errors.titleError && <Typography variant="body2" color="error">{errors.titleError}</Typography>}
              </Grid>
              <Grid item xs={12}>
                {/* Component for review body input */}
                <ReviewBody enteredReview={enteredReview} handleBodyChange={handleReviewChange} />
                {/* Display error message if review body is not entered */}
                {errors.reviewError && <Typography variant="body2" color="error">{errors.reviewError}</Typography>}
              </Grid>
              <Grid item xs={12}>
                {/* Component for review rating selection */}
                <ReviewRating selectedRating={selectedRating} handleRatingChange={handleRatingChange} />
                {/* Display error message if rating is not selected */}
                {errors.ratingError && <Typography variant="body2" color="error">{errors.ratingError}</Typography>}
              </Grid>
              <Grid item xs={12}>
                {/* Submit button */}
                <Button type="submit"
                variant="contained" 
                sx={{
                  ":hover": {
                    bgcolor: "#EE82B7",
                    color: "#ffffff"
                  }
                  }}
                >
                Submit</Button>
              </Grid>
            </Grid>
          </form>
        </Box>

        {/* Confirmation section */}
        <Box pt={0} pr={4} pb={2} pl={4}>
          {/* Display confirmation message if review is submitted */}
          {confirmationMessage && (
            <Typography variant="body2" color="primary">{confirmationMessage}</Typography>
          )}
        </Box>

        {/* Submitted data section */}
        <Box pt={0} pr={4} pb={2} pl={4}>
          {/* Display submitted data if review is submitted */}
          {/* Display submitted data if review is submitted */}
              {confirmationMessage && (
      <Grid container spacing={2} justify="center">
        <Grid item xs={12}>
          <Grid item xs={12}>
          <Typography variant="body1">Movie: {submittedData.selectedMovie}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Review Title: {submittedData.reviewTitle}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Review: {submittedData.reviewContent}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Rating: {submittedData.reviewScore}</Typography>
          </Grid>
        </Grid>
      </Grid>
    )}

        </Box>
      </Container>
    </div>
  );
};

export default Review;