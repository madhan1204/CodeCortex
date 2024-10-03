import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableRow } from '@mui/material';

// Define the type for prediction results
interface PredictionResultsProps {
  results: {
    RT: number;
    CHLoad: number;
    GPM: number;
    DeltaCHW: number;
    CHWS: number;
    CHWR: number;
  } | null; // The results can be null if not available yet
}

const PredictionResults: React.FC<PredictionResultsProps> = ({ results }) => {
  console.log("PredictionResults:", results); // Improved log message

  // Handle the case when results are not yet available
  if (!results) {
    return (
      <Typography variant="h6" color="textSecondary" align="center">
        No prediction results available.
      </Typography>
    );
  }

  // Render the prediction results in a card with a table layout for clarity
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Prediction Results
        </Typography>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell><strong>RT</strong></TableCell>
              <TableCell>{results.RT}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>CH Load</strong></TableCell>
              <TableCell>{results.CHLoad}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>GPM</strong></TableCell>
              <TableCell>{results.GPM}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>DeltaCHW</strong></TableCell>
              <TableCell>{results.DeltaCHW}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>CHWS</strong></TableCell>
              <TableCell>{results.CHWS}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>CHWR</strong></TableCell>
              <TableCell>{results.CHWR}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PredictionResults;
