import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth header
const axiosInstance = axios.create({
  baseURL: API_URL
});

// Add auth token and session ID to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Get or create session ID
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('sessionId', sessionId);
    }
    config.headers['X-Session-Id'] = sessionId;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class AnalyticsService {
  static async logEvent(eventType, metadata = {}) {
    try {
      // Add browser and platform info
      const enhancedMetadata = {
        ...metadata,
        browser: navigator.userAgent,
        platform: navigator.platform,
        screenSize: `${window.innerWidth}x${window.innerHeight}`
      };

      await axiosInstance.post('/analytics/log', {
        eventType,
        metadata: enhancedMetadata
      });
    } catch (error) {
      console.error('Error logging analytics event:', error);
    }
  }

  static async getUserAnalytics(startDate, endDate) {
    try {
      const params = {};
      if (startDate && endDate) {
        params.startDate = startDate.toISOString();
        params.endDate = endDate.toISOString();
      }

      const response = await axiosInstance.get('/analytics/user', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching user analytics');
    }
  }

  static async getSystemAnalytics(startDate, endDate) {
    try {
      const params = {};
      if (startDate && endDate) {
        params.startDate = startDate.toISOString();
        params.endDate = endDate.toISOString();
      }

      const response = await axiosInstance.get('/analytics/system', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching system analytics');
    }
  }
}

// Analytics event tracking functions
export const trackCalculationStarted = (componentType, componentSize) => {
  return AnalyticsService.logEvent('CALCULATION_STARTED', {
    componentType,
    componentSize
  });
};

export const trackCalculationCompleted = (calculationId, duration) => {
  return AnalyticsService.logEvent('CALCULATION_COMPLETED', {
    calculationId,
    duration
  });
};

export const trackCalculationError = (errorMessage) => {
  return AnalyticsService.logEvent('CALCULATION_ERROR', {
    errorMessage
  });
};

export const trackCalculationViewed = (calculationId) => {
  return AnalyticsService.logEvent('CALCULATION_VIEWED', {
    calculationId
  });
};

export const trackCalculationExported = (calculationId, exportFormat) => {
  return AnalyticsService.logEvent('CALCULATION_EXPORTED', {
    calculationId,
    exportFormat
  });
};

export const trackComponentSelected = (componentType, componentSize) => {
  return AnalyticsService.logEvent('COMPONENT_SELECTED', {
    componentType,
    componentSize
  });
};

export const trackVisualizationInteraction = (interactionType) => {
  return AnalyticsService.logEvent('VISUALIZATION_INTERACTION', {
    interactionType
  });
};

// Get user analytics data for a specific date range
export const getUserAnalyticsData = async (startDate, endDate) => {
  try {
    const response = await axiosInstance.get('/analytics/user', {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
    return response;
  } catch (error) {
    throw new Error('Failed to fetch analytics data');
  }
};

// Get system-wide analytics data
export const getSystemAnalyticsData = async (startDate, endDate) => {
  try {
    const response = await axiosInstance.get('/analytics/system', {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
    return response;
  } catch (error) {
    throw new Error('Failed to fetch system analytics data');
  }
};

export const getUserAnalytics = AnalyticsService.getUserAnalytics;
export const getSystemAnalytics = AnalyticsService.getSystemAnalytics;
