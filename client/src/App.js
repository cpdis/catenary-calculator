import React, { useState, useCallback, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link
} from 'react-router-dom';
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Box,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CalculateIcon from '@mui/icons-material/Calculate';
import HistoryIcon from '@mui/icons-material/History';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AssessmentIcon from '@mui/icons-material/Assessment';

import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import CatenaryVisualization from './components/CatenaryVisualization';
import CalculationHistory from './components/CalculationHistory';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { calculateCatenary, validateComponentLimits } from './utils/catenaryCalculator';
import { saveCalculation } from './services/calculationService';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './views/auth/Login';
import Register from './views/auth/Register';
import ForgotPassword from './views/auth/ForgotPassword';
import UserSettings from './views/UserSettings';

// Create a theme instance with responsive breakpoints
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: 240,
        },
      },
    },
  },
});

function MainApp() {
  // State management
  const [calculationResults, setCalculationResults] = useState(null);
  const [calculationError, setCalculationError] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [showHistory, setShowHistory] = useState(false);
  const visualizationRef = useRef(null);

  // Auth context
  const { user, logout } = useAuth();

  // Responsive layout
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Handle drawer
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Show notification
  const showNotification = useCallback((message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  }, []);

  // Handle notification close
  const handleNotificationClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // Handle calculation
  const handleCalculate = async (inputs) => {
    try {
      setIsCalculating(true);
      setCalculationError(null);

      // Perform calculations
      const results = await calculateCatenary(inputs);
      
      // Validate results
      validateComponentLimits(inputs, results);

      // Save calculation to database
      if (user) {
        await saveCalculation({
          name: 'Untitled Calculation',
          inputs,
          results
        });
      }

      setCalculationResults(results);
      setNotification({
        open: true,
        message: 'Calculation completed successfully',
        severity: 'success'
      });
    } catch (error) {
      setCalculationError(error.message);
      setNotification({
        open: true,
        message: error.message,
        severity: 'error'
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleHistorySelect = (calculation) => {
    setCalculationResults(calculation.results);
    setShowHistory(false);
  };

  const handleLogout = () => {
    logout();
    setNotification({
      open: true,
      message: 'Successfully logged out',
      severity: 'success'
    });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Catenary Calculator
          </Typography>
          {user && (
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button onClick={() => setShowHistory(false)}>
              <ListItemIcon>
                <CalculateIcon />
              </ListItemIcon>
              <ListItemText primary="Calculator" />
            </ListItem>
            <ListItem button onClick={() => setShowHistory(true)}>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="History" />
            </ListItem>
            <ListItem button component={Link} to="/analytics">
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary="Analytics" />
            </ListItem>
            <ListItem button component={Link} to="/settings">
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          mt: 8
        }}
      >
        <Container maxWidth="lg">
          {showHistory ? (
            <CalculationHistory onSelect={handleHistorySelect} />
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <InputForm
                  onCalculate={handleCalculate}
                  isCalculating={isCalculating}
                  error={calculationError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ResultsDisplay
                  results={calculationResults}
                  isMobile={isMobile}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CatenaryVisualization 
                  results={calculationResults}
                  width={isMobile ? window.innerWidth - 32 : undefined}
                  ref={visualizationRef}
                />
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <SettingsProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <MainApp />
                  </PrivateRoute>
                }
              />
              <Route path="/analytics" element={
                <PrivateRoute>
                  <AnalyticsDashboard />
                </PrivateRoute>
              } />
              <Route path="/settings" element={
                <PrivateRoute>
                  <UserSettings />
                </PrivateRoute>
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
