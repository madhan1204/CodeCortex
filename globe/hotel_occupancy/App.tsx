import React, { useState } from 'react';
import GaugeChart from 'react-gauge-chart';

const App: React.FC = () => {
  const [value, setValue] = useState<number>(0);
  const maxValue: number = 100; // Define the maximum value for the gauge

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = Number(e.target.value);
    // Ensure the value is between 0 and maxValue
    if (inputValue >= 0 && inputValue <= maxValue) {
      setValue(inputValue);
    }
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      textAlign: 'center',
      padding: '20px',
      borderRadius: '10px',
      width: '320px',
      margin: '0 auto',
      background: '#f9f9f9',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    input: {
      padding: '10px',
      fontSize: '16px',
      width: '100%',
      marginBottom: '20px',
    },
    gaugeContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '20px 0',
    },
    value: {
      fontSize: '20px',
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <h2>Hotel Occupancy Gauge</h2>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        placeholder="Enter a value (0-100)"
        style={styles.input}
      />
      <div style={styles.gaugeContainer}>
        <GaugeChart
          id="gauge-chart"
          nrOfLevels={20}
          arcsLength={[0.3, 0.5, 0.2]}
          colors={['#EA4228', '#F5CD19', '#5BE12C']}
          percent={value / maxValue}
          arcPadding={0.02}
          textColor="#000"
          style={{ width: '200px' }}
        />
      </div>
      <div style={styles.value}>{value}%</div>
    </div>
  );
};

export default App;