import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const MovieSelection = ({ selectedMovie, handleMovieChange, movies }) => {
  return (
    <FormControl fullWidth>
      {/* Label for the movie selection */}
      <InputLabel id="movie-select-label">Select a movie</InputLabel>
      
      {/* Select component for choosing a movie */}
      <Select
        labelId="movie-select-label"
        id="movie-select"
        value={selectedMovie ? selectedMovie.id : ""}
        label="Select a movie"
        onChange={handleMovieChange}
        >
        {/* Mapping over the movies array to create menu items */}
        {movies.map((movie) => (
    <MenuItem key={movie.id} value={movie.id}>
      {movie.name}
    </MenuItem>
  ))}
      </Select>
    </FormControl>
  );
};

export default MovieSelection;