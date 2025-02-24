import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Divider,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Fade,
  Stack,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import ExportResults from './ExportResults';
import { useSettings } from '../contexts/SettingsContext';

// Format number with appropriate decimal places and units
const formatValue = (value, unit, decimals = 2) => {
  if (value === undefined || value === null) return '-';
  return `${Number(value).toFixed(decimals)} ${unit}`;
};

// Safety factor status and color
const getSafetyStatus = (safetyFactor) => {
  if (safetyFactor >= 2.0) return { label: 'Safe', color: 'success' };
  if (safetyFactor >= 1.67) return { label: 'Acceptable', color: 'warning' };
  return { label: 'Unsafe', color: 'error' };
};

const ResultsDisplay = ({ results }) => {
  const { settings } = useSettings();

  if (!results) return null;

  const {
    fairleadAngle,
    groundedLength,
    anchorDistance,
    anchorAngle,
    anchorTension,
    safetyFactor,
    calculationTime,
    inputValues
  } = results;

  const safetyStatus = getSafetyStatus(safetyFactor);

  return (
    <Fade in={true}>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        {/* Title Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Calculation Results
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Calculation completed in {calculationTime.toFixed(1)} ms
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Main Results Table */}
          <Grid item xs={12}>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Parameter</TableCell>
                    <TableCell align="right">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Fairlead Angle</TableCell>
                    <TableCell align="right">{formatValue(fairleadAngle, '°')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Grounded Length</TableCell>
                    <TableCell align="right">{formatValue(groundedLength, settings.units.length)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Anchor Distance</TableCell>
                    <TableCell align="right">{formatValue(anchorDistance, settings.units.length)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Anchor Angle</TableCell>
                    <TableCell align="right">{formatValue(anchorAngle, '°')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Anchor Tension</TableCell>
                    <TableCell align="right">{formatValue(anchorTension, settings.units.force)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Safety Factor
                      <Chip
                        size="small"
                        label={safetyStatus.label}
                        color={safetyStatus.color}
                        sx={{ ml: 1 }}
                      />
                    </TableCell>
                    <TableCell align="right">{formatValue(safetyFactor, '', 3)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Input Summary */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Input Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>Component Type:</strong> {inputValues.componentType}
                </Typography>
                <Typography variant="body2">
                  <strong>Size:</strong> {inputValues.componentSize}
                </Typography>
                <Typography variant="body2">
                  <strong>Length:</strong> {formatValue(inputValues.componentLength, settings.units.length)}
                </Typography>
                <Typography variant="body2">
                  <strong>Water Depth:</strong> {formatValue(inputValues.waterDepth, settings.units.length)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>Weight:</strong> {formatValue(inputValues.componentWeight, settings.units.force + '/m')}
                </Typography>
                <Typography variant="body2">
                  <strong>Stiffness:</strong> {formatValue(inputValues.componentStiffness, settings.units.force + '/m²', 0)}
                </Typography>
                <Typography variant="body2">
                  <strong>MBL:</strong> {formatValue(inputValues.componentMBL, settings.units.force, 0)}
                </Typography>
                <Typography variant="body2">
                  <strong>Fairlead Tension:</strong> {formatValue(inputValues.fairleadTension, settings.units.force, 0)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* Export Options */}
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="center">
              <ExportResults
                results={results}
              />
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Fade>
  );
};

export default ResultsDisplay;
