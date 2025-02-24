import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';

import { useSettings } from '../contexts/SettingsContext';

import {
  componentTypes,
  getAvailableSizes,
  getComponentOptions,
  getComponentDefaults
} from '../data/componentDefaults';

// Validation schema
const validationSchema = Yup.object().shape({
  fairleadTension: Yup.number()
    .required('Required')
    .positive('Must be positive')
    .max(10000000, 'Value too high'),
  waterDepth: Yup.number()
    .required('Required')
    .positive('Must be positive')
    .max(5000, 'Maximum depth exceeded'),
  componentType: Yup.string()
    .required('Required')
    .oneOf(Object.values(componentTypes)),
  componentSize: Yup.string()
    .required('Required'),
  componentLength: Yup.number()
    .required('Required')
    .positive('Must be positive'),
  componentWeight: Yup.number()
    .required('Required')
    .positive('Must be positive'),
  componentStiffness: Yup.number()
    .required('Required')
    .positive('Must be positive'),
  componentMBL: Yup.number()
    .required('Required')
    .positive('Must be positive')
});

const InputForm = ({ onCalculate, isCalculating, error: externalError }) => {
  const { settings } = useSettings();
  const [availableSizes, setAvailableSizes] = useState([]);
  const [componentOptions, setComponentOptions] = useState([]);
  const [error, setError] = useState(null);

  const initialValues = {
    fairleadTension: '',
    waterDepth: '',
    componentType: '',
    componentSize: '',
    componentLength: '',
    componentWeight: '',
    componentStiffness: '',
    componentMBL: '',
    additionalOption: '' // For grade/construction/material based on type
  };

  const handleSubmit = (values, { setSubmitting }) => {
    try {
      // Convert string values to numbers where needed
      const calculationInput = {
        ...values,
        fairleadTension: Number(values.fairleadTension),
        waterDepth: Number(values.waterDepth),
        componentLength: Number(values.componentLength),
        componentWeight: Number(values.componentWeight),
        componentStiffness: Number(values.componentStiffness),
        componentMBL: Number(values.componentMBL)
      };

      // Additional validation
      if (calculationInput.componentLength <= calculationInput.waterDepth) {
        throw new Error('Component length must be greater than water depth');
      }

      onCalculate(calculationInput);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Mooring Line Parameters
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          isSubmitting
        }) => (
          <Form>
            <Grid container spacing={3}>
              {/* Basic Parameters */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="fairleadTension"
                  label={`Fairlead Tension (${settings.units.force})`}
                  type="number"
                  value={values.fairleadTension}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.fairleadTension && Boolean(errors.fairleadTension)}
                  helperText={touched.fairleadTension && errors.fairleadTension}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="waterDepth"
                  label={`Water Depth (${settings.units.length})`}
                  type="number"
                  value={values.waterDepth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.waterDepth && Boolean(errors.waterDepth)}
                  helperText={touched.waterDepth && errors.waterDepth}
                />
              </Grid>

              {/* Component Selection */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Component Type</InputLabel>
                  <Select
                    name="componentType"
                    value={values.componentType}
                    onChange={(e) => {
                      const type = e.target.value;
                      setFieldValue('componentType', type);
                      setFieldValue('componentSize', '');
                      setFieldValue('additionalOption', '');
                      setAvailableSizes(getAvailableSizes(type));
                      setComponentOptions(getComponentOptions(type));
                    }}
                    error={touched.componentType && Boolean(errors.componentType)}
                  >
                    {Object.entries(componentTypes).map(([key, value]) => (
                      <MenuItem key={key} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Size</InputLabel>
                  <Select
                    name="componentSize"
                    value={values.componentSize}
                    onChange={(e) => {
                      const size = e.target.value;
                      setFieldValue('componentSize', size);
                      
                      // Auto-fill default values when size is selected
                      const defaults = getComponentDefaults(values.componentType, size);
                      if (defaults) {
                        setFieldValue('componentLength', defaults.defaultLength);
                        setFieldValue('componentWeight', defaults.weight);
                        setFieldValue('componentStiffness', defaults.stiffness);
                        setFieldValue('componentMBL', defaults.mbl);
                      }
                    }}
                    disabled={!values.componentType}
                    error={touched.componentSize && Boolean(errors.componentSize)}
                  >
                    {availableSizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Component Details */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="componentLength"
                  label={`Component Length (${settings.units.length})`}
                  type="number"
                  value={values.componentLength}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.componentLength && Boolean(errors.componentLength)}
                  helperText={touched.componentLength && errors.componentLength}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="componentWeight"
                  label={`Weight per Length (${settings.units.force}/${settings.units.length})`}
                  type="number"
                  value={values.componentWeight}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.componentWeight && Boolean(errors.componentWeight)}
                  helperText={touched.componentWeight && errors.componentWeight}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="componentStiffness"
                  label={`Stiffness (${settings.units.force}/${settings.units.length}²)`}
                  type="number"
                  value={values.componentStiffness}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.componentStiffness && Boolean(errors.componentStiffness)}
                  helperText={touched.componentStiffness && errors.componentStiffness}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="componentMBL"
                  label={`Maximum Breaking Load (${settings.units.force})`}
                  type="number"
                  value={values.componentMBL}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.componentMBL && Boolean(errors.componentMBL)}
                  helperText={touched.componentMBL && errors.componentMBL}
                />
              </Grid>

              {/* Additional Options based on component type */}
              {componentOptions.length > 0 && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>
                      {values.componentType === componentTypes.CHAIN ? 'Grade' :
                       values.componentType === componentTypes.SYNTHETIC ? 'Material' :
                       'Construction'}
                    </InputLabel>
                    <Select
                      name="additionalOption"
                      value={values.additionalOption}
                      onChange={handleChange}
                    >
                      {componentOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {/* Error Display */}
              {(error || externalError) && (
                <Grid item xs={12}>
                  <Alert severity="error">{error || externalError}</Alert>
                </Grid>
              )}

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || isCalculating}
                  sx={{ mt: 2 }}
                  startIcon={isCalculating && <CircularProgress size={20} color="inherit" />}
                >
                  {isCalculating ? 'Calculating...' : 'Calculate'}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default InputForm;
