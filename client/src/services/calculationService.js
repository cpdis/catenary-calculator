import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth header
const axiosInstance = axios.create({
  baseURL: API_URL
});

// Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const saveCalculation = async (calculationData) => {
  try {
    const response = await axiosInstance.post('/calculations', calculationData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error saving calculation');
  }
};

export const getCalculations = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/calculations', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching calculations');
  }
};

export const getCalculation = async (id) => {
  try {
    const response = await axiosInstance.get(`/calculations/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching calculation');
  }
};

export const updateCalculation = async (id, updates) => {
  try {
    const response = await axiosInstance.put(`/calculations/${id}`, updates);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating calculation');
  }
};

export const deleteCalculation = async (id) => {
  try {
    const response = await axiosInstance.delete(`/calculations/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error deleting calculation');
  }
};

export const getCalculationStats = async () => {
  try {
    const response = await axiosInstance.get('/calculations/stats');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching calculation statistics');
  }
};
