import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Result from './pages/Result';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize the primary color
    },
    secondary: {
      main: '#dc004e', // Customize the secondary color
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline for consistent styling across browsers */}
      <CssBaseline />
      <Router>
        <Routes>
          {/* Route for the Home page (form input) */}
          <Route path="/" element={<Home />} />

          {/* Route for the Result page (prediction result) */}
          <Route path="/result" element={<Result />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
