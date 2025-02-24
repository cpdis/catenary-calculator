import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Slider,
  Button,
  Grid,
  Divider,
  FormControlLabel,
  Alert,
  Snackbar
} from '@mui/material';
import { useSettings } from '../contexts/SettingsContext';
import { useState } from 'react';

const UserSettings = () => {
  const {
    settings,
    updateUnits,
    updateVisualization,
    updateNotifications,
    resetSettings
  } = useSettings();

  const [showResetAlert, setShowResetAlert] = useState(false);

  const handleLengthUnitChange = (event) => {
    updateUnits('length', event.target.value);
  };

  const handleForceUnitChange = (event) => {
    updateUnits('force', event.target.value);
  };

  const handleScaleChange = (event, newValue) => {
    updateVisualization('scale', newValue);
  };

  const handleGridSizeChange = (event, newValue) => {
    updateVisualization('gridSize', newValue);
  };

  const handleShowGridChange = (event) => {
    updateVisualization('showGrid', event.target.checked);
  };

  const handleShowAxesChange = (event) => {
    updateVisualization('showAxes', event.target.checked);
  };

  const handleThemeChange = (event) => {
    updateVisualization('theme', event.target.value);
  };

  const handleNotificationChange = (key) => (event) => {
    updateNotifications(key, event.target.checked);
  };

  const handleReset = () => {
    resetSettings();
    setShowResetAlert(true);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        User Settings
      </Typography>

      {/* Units Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Measurement Units
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Length Units</InputLabel>
                <Select
                  value={settings.units.length}
                  label="Length Units"
                  onChange={handleLengthUnitChange}
                >
                  <MenuItem value="ft">Feet (ft)</MenuItem>
                  <MenuItem value="m">Meters (m)</MenuItem>
                  <MenuItem value="in">Inches (in)</MenuItem>
                  <MenuItem value="cm">Centimeters (cm)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Force Units</InputLabel>
                <Select
                  value={settings.units.force}
                  label="Force Units"
                  onChange={handleForceUnitChange}
                >
                  <MenuItem value="lbs">Pounds (lbs)</MenuItem>
                  <MenuItem value="N">Newtons (N)</MenuItem>
                  <MenuItem value="kN">Kilonewtons (kN)</MenuItem>
                  <MenuItem value="kg">Kilograms (kg)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Visualization Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Visualization Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography gutterBottom>Scale Factor</Typography>
              <Slider
                value={settings.visualization.scale}
                onChange={handleScaleChange}
                min={0.1}
                max={2}
                step={0.1}
                marks={[
                  { value: 0.1, label: '0.1x' },
                  { value: 1, label: '1x' },
                  { value: 2, label: '2x' }
                ]}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Grid Size</Typography>
              <Slider
                value={settings.visualization.gridSize}
                onChange={handleGridSizeChange}
                min={20}
                max={100}
                step={10}
                marks={[
                  { value: 20, label: '20' },
                  { value: 50, label: '50' },
                  { value: 100, label: '100' }
                ]}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.visualization.showGrid}
                    onChange={handleShowGridChange}
                  />
                }
                label="Show Grid"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.visualization.showAxes}
                    onChange={handleShowAxesChange}
                  />
                }
                label="Show Axes"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={settings.visualization.theme}
                  label="Theme"
                  onChange={handleThemeChange}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Notification Preferences
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.calculationSuccess}
                    onChange={handleNotificationChange('calculationSuccess')}
                  />
                }
                label="Show Calculation Success Messages"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.calculationError}
                    onChange={handleNotificationChange('calculationError')}
                  />
                }
                label="Show Calculation Error Messages"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.saveSuccess}
                    onChange={handleNotificationChange('saveSuccess')}
                  />
                }
                label="Show Save Success Messages"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Reset Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleReset}
        >
          Reset to Defaults
        </Button>
      </Box>

      {/* Reset Alert */}
      <Snackbar
        open={showResetAlert}
        autoHideDuration={3000}
        onClose={() => setShowResetAlert(false)}
      >
        <Alert
          onClose={() => setShowResetAlert(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Settings have been reset to defaults
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserSettings;
