import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';

// Define the type for weather data
interface WeatherDataProps {
  city: string;
}

interface WeatherInfo {
  temperature: number;
  humidity: number;
  wetBulbTemp: number;
}

const WeatherData: React.FC<WeatherDataProps> = ({ city }) => {
  const [weatherData, setWeatherData] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch weather data from the API
  const fetchWeatherData = async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://api.weatherstack.com/current?access_key=5460889761385624e130f4ee0e0ad810&query=${city}&units=m`);
      const data = await response.json();

      if (response.ok && data.current) {
        const { temperature, humidity } = data.current;
        const wetBulbTemp = temperature - (humidity / 100) * 5; // Calculate wet bulb temperature

        setWeatherData({ temperature, humidity, wetBulbTemp });
      } else {
        setError('Unable to fetch weather data.');
      }
    } catch (error) {
      setError('Error fetching weather data.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch the weather data when the component is mounted or when the city changes
  useEffect(() => {
    if (city) {
      fetchWeatherData(city);
    }
  }, [city]);

  // Render loading, error, or weather data
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Weather Data for {city}
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : weatherData ? (
          <div>
            <Typography variant="body1"><strong>Temperature:</strong> {weatherData.temperature} °C</Typography>
            <Typography variant="body1"><strong>Humidity:</strong> {weatherData.humidity} %</Typography>
            <Typography variant="body1"><strong>Wet Bulb Temperature:</strong> {weatherData.wetBulbTemp.toFixed(2)} °C</Typography>
          </div>
        ) : (
          <Typography variant="body1">No weather data available.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherData;
