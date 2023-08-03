import React from 'react';
import { Typography, TextField } from '@mui/material';

const ReviewBody = ({ enteredReview, handleBodyChange }) => {
  return (
    <>
      {/* Review body label */}
      <Typography variant="body1">Enter your review:</Typography>
      
      {/* Review body input */}
      <TextField
        id="review-body"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={enteredReview}
        onChange={handleBodyChange}
        inputProps={{
          maxLength: 200,
        }}
      />
      
      {/* Character count and validation */}
      <Typography variant="body2" align="right" color={enteredReview.length > 200 ? 'error' : 'textPrimary'}>
        {enteredReview.length}/200 characters
      </Typography>
    </>
  );
};

export default ReviewBody;