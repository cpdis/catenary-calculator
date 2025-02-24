import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('userSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      units: {
        length: 'ft',
        force: 'lbs'
      },
      visualization: {
        scale: 1.0,
        gridSize: 50,
        showGrid: true,
        showAxes: true,
        theme: 'light'
      },
      notifications: {
        calculationSuccess: true,
        calculationError: true,
        saveSuccess: true
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  const updateUnits = (unitType, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      units: {
        ...prevSettings.units,
        [unitType]: value
      }
    }));
  };

  const updateVisualization = (key, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      visualization: {
        ...prevSettings.visualization,
        [key]: value
      }
    }));
  };

  const updateNotifications = (key, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      notifications: {
        ...prevSettings.notifications,
        [key]: value
      }
    }));
  };

  const resetSettings = () => {
    const defaultSettings = {
      units: {
        length: 'ft',
        force: 'lbs'
      },
      visualization: {
        scale: 1.0,
        gridSize: 50,
        showGrid: true,
        showAxes: true,
        theme: 'light'
      },
      notifications: {
        calculationSuccess: true,
        calculationError: true,
        saveSuccess: true
      }
    };
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      updateUnits,
      updateVisualization,
      updateNotifications,
      resetSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
