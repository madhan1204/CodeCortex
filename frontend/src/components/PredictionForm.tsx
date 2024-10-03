import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Switch, FormControlLabel, Stepper, Step, StepLabel, Box, Typography } from '@mui/material';
import appService from '../services/apiService'; // Import your API service

// Define the type for the form values
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
    operational_metrics: OperationalMetrics; // Use the defined interface for operational metrics
    chillerStatus: ChillerStatus; // Add chillerStatus to the interface
}

// Define props type for the form component, including onSubmit
interface PredictionFormProps {
    initialValues: PredictionFormValues;
    onSubmit: (values: PredictionFormValues) => void;  // Add onSubmit here
}

// Define the steps
const steps = ['General Information', 'Operational Metrics', 'Chiller Status'];

// Validation schema using Yup
const validationSchema = Yup.object({
  city: Yup.string().required('City is required'),
  date: Yup.string().required('Date is required'),
  hotel_occupancy: Yup.number()
      .min(0, 'Minimum value is 0')
      .max(100, 'Maximum value is 100')
      .required('Hotel occupancy is required'),
  start_hour: Yup.number()
      .min(0, 'Minimum hour is 0')
      .max(23, 'Maximum hour is 23')
      .required('Start hour is required'),
  operational_metrics: Yup.object().shape({
      DeltaCDW: Yup.number().required('DeltaCDW is required'),
      CDHI: Yup.number().required('CDHI is required'),
      CDLO: Yup.number().required('CDLO is required'),
      WBT: Yup.number().required('WBT is required'),
      DeltaCT: Yup.number().required('DeltaCT is required'),
      Hz_CHP: Yup.number().required('Hz_CHP is required'),
      Hz_CHS: Yup.number().required('Hz_CHS is required'),
      Hz_CDS: Yup.number().required('Hz_CDS is required'),
      Hz_CT: Yup.number().required('Hz_CT is required'),
      Precent_CHP: Yup.number().required('Precent_CHP is required'),
      Precent_CH: Yup.number().required('Precent_CH is required'),
      Precent_CDS: Yup.number().required('Precent_CDS is required'),
      Precent_CT: Yup.number().required('Precent_CT is required'),
      kW_Tot: Yup.number().required('kW_Tot is required'),
      kW_RT: Yup.number().required('kW_RT is required'),
      kW_CHH: Yup.number().required('kW_CHH is required'),
      kW_CHP: Yup.number().required('kW_CHP is required'),
      kW_CHS: Yup.number().required('kW_CHS is required'),
      kW_CDS: Yup.number().required('kW_CDS is required'),
      kW_CT: Yup.number().required('kW_CT is required'),
  }),
});


const PredictionForm: React.FC<PredictionFormProps> = ({ initialValues, onSubmit }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [chillerStatus, setChillerStatus] = useState<ChillerStatus>(initialValues.chillerStatus);

    const handleChillerChange = (chiller: keyof ChillerStatus) => {
        setChillerStatus(prev => ({
            ...prev,
            [chiller]: prev[chiller] === 1 ? 0 : 1, // Toggle between 0 and 1
        }));
    };

    const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
    const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                // Include the chiller status in the submitted values
                onSubmit({ ...values, chillerStatus });
            }}  // Use the passed onSubmit prop here
        >
            {({ errors, touched, values }) => (
                <Form>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {activeStep === 0 && (
                        <>
                            {/* Step 1: General Information */}
                            <Field name="city">
                                {({ field }: any) => (
                                    <TextField
                                        {...field}
                                        label="City"
                                        error={touched.city && !!errors.city}
                                        helperText={touched.city && errors.city}
                                        fullWidth
                                        margin="normal"
                                    />
                                )}
                            </Field>

                            <Field name="date">
                                {({ field }: any) => (
                                    <TextField
                                        {...field}
                                        label="Date"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        error={touched.date && !!errors.date}
                                        helperText={touched.date && errors.date}
                                        fullWidth
                                        margin="normal"
                                    />
                                )}
                            </Field>

                            <Field name="hotel_occupancy">
                                {({ field }: any) => (
                                    <TextField
                                        {...field}
                                        label="Hotel Occupancy (%)"
                                        type="number"
                                        error={touched.hotel_occupancy && !!errors.hotel_occupancy}
                                        helperText={touched.hotel_occupancy && errors.hotel_occupancy}
                                        fullWidth
                                        margin="normal"
                                    />
                                )}
                            </Field>

                            <Field name="start_hour">
                                {({ field }: any) => (
                                    <TextField
                                        {...field}
                                        label="Start Hour"
                                        type="number"
                                        error={touched.start_hour && !!errors.start_hour}
                                        helperText={touched.start_hour && errors.start_hour}
                                        fullWidth
                                        margin="normal"
                                    />
                                )}
                            </Field>
                        </>
                    )}

{activeStep === 1 && (
    <>
        {/* Step 2: Operational Metrics */}
        <Field name="operational_metrics.DeltaCDW">
            {({ field }: any) => (
                <TextField
                    {...field}
                    label="DeltaCDW"
                    type="number"
                    error={touched.operational_metrics?.DeltaCDW && !!errors.operational_metrics?.DeltaCDW}
                    helperText={touched.operational_metrics?.DeltaCDW && errors.operational_metrics?.DeltaCDW}
                    fullWidth
                    margin="normal"
                />
            )}
        </Field>

        <Field name="operational_metrics.CDHI">
            {({ field }: any) => (
                <TextField
                    {...field}
                    label="CDHI"
                    type="number"
                    error={touched.operational_metrics?.CDHI && !!errors.operational_metrics?.CDHI}
                    helperText={touched.operational_metrics?.CDHI && errors.operational_metrics?.CDHI}
                    fullWidth
                    margin="normal"
                />
            )}
        </Field>

        {/* Repeat for other operational metrics */}
        <Field name="operational_metrics.CDLO">
            {({ field }: any) => (
                <TextField
                    {...field}
                    label="CDLO"
                    type="number"
                    error={touched.operational_metrics?.CDLO && !!errors.operational_metrics?.CDLO}
                    helperText={touched.operational_metrics?.CDLO && errors.operational_metrics?.CDLO}
                    fullWidth
                    margin="normal"
                />
            )}
        </Field>

        <Field name="operational_metrics.WBT">
            {({ field }: any) => (
                <TextField
                    {...field}
                    label="WBT"
                    type="number"
                    error={touched.operational_metrics?.WBT && !!errors.operational_metrics?.WBT}
                    helperText={touched.operational_metrics?.WBT && errors.operational_metrics?.WBT}
                    fullWidth
                    margin="normal"
                />
            )}
        </Field>

        <Field name="operational_metrics.DeltaCT">
            {({ field }: any) => (
                <TextField
                    {...field}
                    label="DeltaCT"
                    type="number"
                    error={touched.operational_metrics?.DeltaCT && !!errors.operational_metrics?.DeltaCT}
                    helperText={touched.operational_metrics?.DeltaCT && errors.operational_metrics?.DeltaCT}
                    fullWidth
                    margin="normal"
                />
            )}
        </Field>

        <Field name="operational_metrics.Hz_CHP">
            {({ field }: any) => (
                <TextField
                    {...field}
                    label="Hz_CHP"
                    type="number"
                    error={touched.operational_metrics?.Hz_CHP && !!errors.operational_metrics?.Hz_CHP}
                    helperText={touched.operational_metrics?.Hz_CHP && errors.operational_metrics?.Hz_CHP}
                    fullWidth
                    margin="normal"
                />
            )}
        </Field>

        <Field name="operational_metrics.Hz_CHS">
            {({ field }: any) => (
                <TextField
                    {...field}
                    label="Hz_CHS"
                    type="number"
                    error={touched.operational_metrics?.Hz_CHS && !!errors.operational_metrics?.Hz_CHS}
                    helperText={touched.operational_metrics?.Hz_CHS && errors.operational_metrics?.Hz_CHS}
                    fullWidth
                    margin="normal"
                />
            )}
        </Field>

        <Field name="operational_metrics.Hz_CDS">
            {({ field }: any) => (
                <TextField
                    {...field}
                    label="Hz_CDS"
                    type="number"
                    error={touched.operational_metrics?.Hz_CDS && !!errors.operational_metrics?.Hz_CDS}
                    helperText={touched.operational_metrics?.Hz_CDS && errors.operational_metrics?.Hz_CDS}
                    fullWidth
                    margin="normal"
                />
            )}
        </Field>

        <Field name="operational_metrics.Hz_CT">
            {({ field }: any) => (
                <TextField
                    {...field}
                    label="Hz_CT"
                    type="number"
                    error={touched.operational_metrics?.Hz_CT && !!errors.operational_metrics?.Hz_CT}
                    helperText={touched.operational_metrics?.Hz_CT && errors.operational_metrics?.Hz_CT}
                    fullWidth
                    margin="normal"
                />
            )}
        </Field>

        <Field name="operational_metrics.Precent_CHP">
            {({ field }: any) => (
                <TextField
                    {...field}
                    label="Precent_CHP"
                    type="number"
                    error={touched.operational_metrics?.Precent_CHP && !!errors.operational_metrics?.Precent_CHP}
                    helperText={touched.operational_metrics?.Precent_CHP && errors.operational_metrics?.Precent_CHP}
                    fullWidth
                    margin="normal"
                />
            )}
        </Field>

        <Field name="operational_metrics.Precent_CH">
            {({ field }: any) => (
                <TextField
                    {...field}
                    label="Precent_CH"
                    type="number"
                    error={touched.operational_metrics?.Precent_CH && !!errors.operational_metrics?.Precent_CH}
                    helperText={touched.operational_metrics?.Precent_CH && errors.operational_metrics?.Precent_CH}
                    fullWidth
                    margin="normal"
                />
            )}
        </Field>

        <Field name="operational_metrics.Precent_CDS">
            {({ field }: any) => (
                <TextField
                    {...field}
                    label="Precent_CDS"
                    type="number"
                    error={touched.operational_metrics?.Precent_CDS && !!errors.operational_metrics?.Precent_CDS}
                    helperText={touched.operational_metrics?.Precent_CDS && errors.operational_metrics?.Precent_CDS}
                    fullWidth
                    margin="normal"
                />
            )}
        </Field>

        <Field name="operational_metrics.Precent_CT">
            {({ field }: any) => (
                <TextField
                    {...field}
                    label="Precent_CT"
                    type="number"
                    error={touched.operational_metrics?.Precent_CT && !!errors.operational_metrics?.Precent_CT}
                    helperText={touched.operational_metrics?.Precent_CT && errors.operational_metrics?.Precent_CT}
                    fullWidth
                    margin="normal"
                />
            )}
        </Field>

        {/* Add the missing operational metrics fields here */}
        <Field name="operational_metrics.kW_Tot">
            {({ field }: any) => (
                <TextField
                    {...field}
                    label="kW Total"
                    type="number"
                    error={touched.operational_metrics?.kW_Tot && !!errors.operational_metrics?.kW_Tot}
                    helperText={touched.operational_metrics?.kW_Tot && errors.operational_metrics?.kW_Tot}
                    fullWidth
                    margin="normal"
                />
            )}
        </Field>

        <Field name="operational_metrics.kW_RT">
            {({ field }: any) => (
                <TextField
                    {...field}
                    label="kW RT"
                    type="number"
                    error={touched.operational_metrics?.kW_RT && !!errors.operational_metrics?.kW_RT}
                    helperText={touched.operational_metrics?.kW_RT && errors.operational_metrics?.kW_RT}
                    fullWidth
                    margin="normal"
                />
            )}
        </Field>

        <Field name="operational_metrics.kW_CHH">
            {({ field }: any) => (
                <TextField
                    {...field}
                    label="kW CHH"
                    type="number"
                    error={touched.operational_metrics?.kW_CHH && !!errors.operational_metrics?.kW_CHH}
                    helperText={touched.operational_metrics?.kW_CHH && errors.operational_metrics?.kW_CHH}
                    fullWidth
                    margin="normal"
                />
            )}
        </Field>

        <Field name="operational_metrics.kW_CHP">
            {({ field }: any) => (
                <TextField
                    {...field}
                    label="kW CHP"
                    type="number"
                    error={touched.operational_metrics?.kW_CHP && !!errors.operational_metrics?.kW_CHP}
                    helperText={touched.operational_metrics?.kW_CHP && errors.operational_metrics?.kW_CHP}
                    fullWidth
                    margin="normal"
                />
            )}
        </Field>

        <Field name="operational_metrics.kW_CHS">
            {({ field }: any) => (
                <TextField
                    {...field}
                    label="kW CHS"
                    type="number"
                    error={touched.operational_metrics?.kW_CHS && !!errors.operational_metrics?.kW_CHS}
                    helperText={touched.operational_metrics?.kW_CHS && errors.operational_metrics?.kW_CHS}
                    fullWidth
                    margin="normal"
                />
            )}
        </Field>

        <Field name="operational_metrics.kW_CDS">
            {({ field }: any) => (
                <TextField
                    {...field}
                    label="kW CDS"
                    type="number"
                    error={touched.operational_metrics?.kW_CDS && !!errors.operational_metrics?.kW_CDS}
                    helperText={touched.operational_metrics?.kW_CDS && errors.operational_metrics?.kW_CDS}
                    fullWidth
                    margin="normal"
                />
            )}
        </Field>

        <Field name="operational_metrics.kW_CT">
            {({ field }: any) => (
                <TextField
                    {...field}
                    label="kW CT"
                    type="number"
                    error={touched.operational_metrics?.kW_CT && !!errors.operational_metrics?.kW_CT}
                    helperText={touched.operational_metrics?.kW_CT && errors.operational_metrics?.kW_CT}
                    fullWidth
                    margin="normal"
                />
            )}
        </Field>
    </>
)}

                    {activeStep === 2 && (
                        <>
                            {/* Step 3: Chiller Status */}
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={chillerStatus.CH1 === 1}
                                        onChange={() => handleChillerChange('CH1')}
                                    />
                                }
                                label="Chiller 1 (ON/OFF)"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={chillerStatus.CH2 === 1}
                                        onChange={() => handleChillerChange('CH2')}
                                    />
                                }
                                label="Chiller 2 (ON/OFF)"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={chillerStatus.CH3 === 1}
                                        onChange={() => handleChillerChange('CH3')}
                                    />
                                }
                                label="Chiller 3 (ON/OFF)"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={chillerStatus.CH4 === 1}
                                        onChange={() => handleChillerChange('CH4')}
                                    />
                                }
                                label="Chiller 4 (ON/OFF)"
                            />
                        </>
                    )}
                    <Box mt={2}>
    {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
    {activeStep < steps.length - 1 && (
        <Button onClick={handleNext} variant="contained" color="primary">
            Next
        </Button>
    )}
</Box>

{/* Separate Submit Button */}
{activeStep === steps.length - 1 && (
    <Box mt={2}>
        <Button type="submit" variant="contained" color="primary">
            Submit
        </Button>
    </Box>
)}


                </Form>
            )}
        </Formik>
    );
};

export default PredictionForm;