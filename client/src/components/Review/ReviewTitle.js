import React from 'react';
import { Typography, TextField } from '@mui/material';

const ReviewTitle = ({ enteredTitle, handleTitleChange }) => {
  return (
    <>
      {/* Review title label */}
      <Typography variant="body1">Enter your review title:</Typography>
      
      {/* Text field for entering the review title */}
      <TextField
        id="review-title"
        variant="outlined"
        fullWidth
        value={enteredTitle}
        onChange={handleTitleChange}
      />
    </>
  );
};

export default ReviewTitle;