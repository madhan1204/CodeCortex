import React, { useState } from 'react';
import { Container, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import PredictionForm from '../components/PredictionForm';
import WeatherData from '../components/WeatherData';
import { useNavigate } from 'react-router-dom';
import appService from '../services/apiService'; // Import your API service

// Define the types for the initial form values
interface ChillerStatus {
  CH1: number;
  CH2: number;
  CH3: number;
  CH4: number;
}

interface OperationalMetrics {
  kW_Tot: number;
  kW_RT: number;
  CH1: number;
  CH2: number;
  CH3: number;
  CH4: number;
  kW_CHH: number;
  kW_CHP: number;
  kW_CHS: number;
  kW_CDS: number;
  kW_CT: number;
  DeltaCDW: number;
  CDHI: number;
  CDLO: number;
  WBT: number;
  DeltaCT: number;
  Hz_CHP: number;
  Hz_CHS: number;
  Hz_CDS: number;
  Hz_CT: number;
  Precent_CHP: number;
  Precent_CH: number;
  Precent_CDS: number;
  Precent_CT: number;
}

interface PredictionFormValues {
  city: string;
  date: string;
  start_hour: number;
  hotel_occupancy: number;
  operational_metrics: OperationalMetrics;
  chillerStatus: ChillerStatus;
}

const Home: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [hotelOccupancy, setHotelOccupancy] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false); // State for dialog
  const [predictions, setPredictions] = useState<any>(null); // State for predictions
  const navigate = useNavigate();

  // Define the initial values for the form
  const initialValues: PredictionFormValues = {
    city: 'Vellore',
    date: '2024-09-28',
    start_hour: 11,
    hotel_occupancy: 95,
    operational_metrics: {
      kW_Tot: 260.2,
      kW_RT: 0.815,
      CH1: 1,
      CH2: 0,
      CH3: 0,
      CH4: 0,
      kW_CHH: 184.5,
      kW_CHP: 24.3,
      kW_CHS: 0,
      kW_CDS: 31.6,
      kW_CT: 19.8,
      DeltaCDW: 5.6,
      CDHI: 87.6,
      CDLO: 82,
      WBT: 76.1,
      DeltaCT: -5.9,
      Hz_CHP: 48,
      Hz_CHS: 0,
      Hz_CDS: 47,
      Hz_CT: 48,
      Precent_CHP: 9.3,
      Precent_CH: 70.9,
      Precent_CDS: 12.2,
      Precent_CT: 7.6,
    },
    chillerStatus: {
      CH1: 0,
      CH2: 0,
      CH3: 0,
      CH4: 0,
    },
  };

  // Handle the form submission and open the dialog with results
  const handleFormSubmit = async (values: PredictionFormValues) => {
    setCity(values.city);
    setHotelOccupancy(values.hotel_occupancy);

    const combinedMetrics = {
      ...values.operational_metrics,
      ...values.chillerStatus,
    };

    const data = {
      city: values.city,
      date: values.date,
      start_hour: values.start_hour,
      hotel_occupancy: values.hotel_occupancy,
      operational_metrics: combinedMetrics,
    };

    try {
      const response = await appService.postData('http://127.0.0.1:5000/predict', data);

      if (response && typeof response === 'object') {
        const predictionResults = response;
        setPredictions(predictionResults); // Store predictions

        // Open the dialog
        setOpenDialog(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Optionally navigate to the results page or clear predictions
    navigate('/result', {
      state: {
        predictions: predictions,
        city: city,
      },
    });
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Load Capacity Prediction
      </Typography>

      <Box mb={4}>
        <PredictionForm initialValues={initialValues} onSubmit={handleFormSubmit} />
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Results</DialogTitle>
        <DialogContent>
  <Typography variant="h6">Predicted Results:</Typography>
  <Typography variant="body1">
    {JSON.stringify(predictions, null, 2)} {/* Stringify the predictions object */}
  </Typography>
  {/* Optionally, include WeatherData here */}
  {city && <WeatherData city={city} />}
</DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home;
