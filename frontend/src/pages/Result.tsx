import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PredictionResult from '../components/PredictionResult'; // Adjust the path based on your folder structure
import WeatherData from '../components/WeatherData'; // Adjust if needed
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';

// Define the type for the prediction results
interface PredictionResultsType {
  RT: number;
  CHLoad: number;
  GPM: number;
  DeltaCHW: number;
  CHWS: number;
  CHWR: number;
}

// Define the type for the location state
interface LocationState {
  predictions: PredictionResultsType; // Expect predictions to always be present
  city: string; // Pass city to fetch weather data
}

const Result: React.FC = () => {
  const location = useLocation(); // Get the location object without type parameters

  // Type assertion to ensure we have the expected structure
  const { predictions, city } = location.state as LocationState; // Cast to LocationState type

  // State to manage loading
  const [loading, setLoading] = useState(true);

  // Simulating loading delay
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Simulate a loading delay
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  // Error handling for predictions
  if (!predictions) {
    return (
      <div>
        <Typography variant="h5" color="error">
          No predictions available.
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Prediction and Weather Results
          </Typography>

          {/* Show CircularProgress while loading */}
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {/* Prediction Results */}
              <PredictionResult results={predictions} />

              {/* Weather Data */}
              <WeatherData city={city} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Result;
