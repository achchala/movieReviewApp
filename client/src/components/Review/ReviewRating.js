import React from 'react';
import { Typography, Radio, RadioGroup, FormControlLabel } from '@mui/material';

const ReviewRating = ({ selectedRating, handleRatingChange }) => {
  return (
    <>
      {/* Rating label */}
      <Typography variant="body1">Rate the movie:</Typography>
      
      {/* Radio buttons for rating selection */}
      <RadioGroup row name="rating" value={selectedRating} onChange={handleRatingChange}>
        <FormControlLabel value="1" control={<Radio />} label="1" />
        <FormControlLabel value="2" control={<Radio />} label="2" />
        <FormControlLabel value="3" control={<Radio />} label="3" />
        <FormControlLabel value="4" control={<Radio />} label="4" />
        <FormControlLabel value="5" control={<Radio />} label="5" />
      </RadioGroup>
    </>
  );
};

export default ReviewRating;