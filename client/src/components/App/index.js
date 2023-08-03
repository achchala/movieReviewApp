import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Landing from '../Landing';
import Review from '../Review';
import Search from '../Search';
import Recommendations from '../Recommendations';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Create a custom theme
const theme = createTheme({
    palette: {
      primary: {
        main: '#F24A2F',
        // Add hover color for the primary button
        hover: '#EE82B7',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: 16,
    },
  });
  
  

const App = () => {
  React.useEffect(() => {
    document.title = 'Movie App';
  }, []);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/Review" element={<Review />} />
            <Route path="/Search" element={<Search />} />
            <Route path="/Recommendations" element={<Recommendations />} />
          </Routes>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default App;
