// App.js
import React, { useState, useRef } from 'react';
import Globe from 'react-globe.gl';
import './App.css';
import Navbar from './Navbar'; // Import the Navbar component

// Replace with your actual OpenCage API key
const GEOCODING_API_KEY = '6bac04f63146413db9cb439f23ceea61';

// Mock function to simulate fetching weather data from the backend
const fetchWeatherData = async (lat, lng) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        temp: `${Math.floor(Math.random() * 30) + 10}°C`,
        rh: `${Math.floor(Math.random() * 50) + 30}%`,
        wbt: `${Math.floor(Math.random() * 25) + 5}°C`,
      });
    }, 1000);
  });
};

const App = () => {
  const globeEl = useRef();
  const [markers, setMarkers] = useState([]);
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchLatLng = async (city, state) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          city + ', ' + state
        )}&key=${GEOCODING_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return { lat, lng };
      } else {
        alert('Location not found!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
      alert('Failed to fetch location data.');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedCity = city.trim();
    const trimmedState = stateName.trim();

    if (!trimmedCity || !trimmedState) {
      alert('Please enter both city and state.');
      return;
    }

    const location = await fetchLatLng(trimmedCity, trimmedState);
    if (location) {
      const { lat, lng } = location;

      const newMarker = {
        city: trimmedCity,
        state: trimmedState,
        lat,
        lng,
      };

      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);

      globeEl.current.pointOfView(
        { lat: lat, lng: lng, altitude: 1.5 },
        1000
      );

      const weather = await fetchWeatherData(lat, lng);
      setWeatherData({
        city: newMarker.city,
        state: newMarker.state,
        ...weather,
      });
      setIsDialogOpen(true);

      setCity('');
      setStateName('');
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="App">
      <Navbar /> {/* Add Navbar here */}
      <div className="form-container">
        <h2>Point a Location on the Globe</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>City Name:</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              placeholder="e.g., New York"
            />
          </div>
          <div>
            <label>State:</label>
            <input
              type="text"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              required
              placeholder="e.g., NY"
            />
          </div>
          <button type="submit">Add Location</button>
        </form>
      </div>

      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={markers}
        pointAltitude={0.01}
        pointRadius={0} // Hide default points
        pointsTransitionDuration={0}
        htmlElementsData={markers} // Use HTML for custom markers
        htmlElement={(d) => {
          const el = document.createElement('div');
          el.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 24px; color: red;">📍</span> <!-- Locating icon -->
            </div>
          `;
          el.style.transform = 'translate(-50%, -100%)'; // Position marker correctly
          return el;
        }}
        controlsEnableZoom={true}
        controlsEnableRotate={true}
        controlsAutoRotate={false}
        controlsMinDistance={0.5}
        controlsMaxDistance={2}
        atmosphereColor="lightblue"
        atmosphereAltitude={0.1}
      />

      {isDialogOpen && weatherData && (
        <div className="dialog-overlay" onClick={closeDialog}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>
              {weatherData.city}, {weatherData.state}
            </h3>
            <p>
              <strong>Temperature:</strong> {weatherData.temp}
            </p>
            <p>
              <strong>Relative Humidity:</strong> {weatherData.rh}
            </p>
            <p>
              <strong>Wet Bulb Temperature:</strong> {weatherData.wbt}
            </p>
            <button onClick={closeDialog}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
