import api from './api';

const API_URL = 'http://localhost:8000/api/auth/';

// Register a new user
export const register = async (userData) => {
    try {
        const response = await api.post(`${API_URL}register/`, userData);
        return response.data;
    } catch (error) {
        throw handleApiError(error, 'register');
    }
};

// Login an existing user
export const login = async (credentials) => {
    try {
        const response = await api.post(`${API_URL}login/`, credentials);
        return response.data;
    } catch (error) {
        throw handleApiError(error, 'login');
    }
};

// Logout the current user
// 
export const verifyToken = async (token) => {
    try {
        // endpoint that requires authentication
        const response = await api.get('http://localhost:8000/api/config/', {
            headers: { 'Authorization': `Token ${token}` }
        });
        return true;
    } catch (error) {
        return false;
    }
};

// Reusable error handler for API calls
const handleApiError = (error, context) => {
    if (error.response) {
        console.error(`API Error in ${context}:`, error.response.data);
        return new Error(error.response.data.error || 'Server error');
    } else if (error.request) {
        console.error(`Network error in ${context}:`, error.request);
        return new Error('Network error');
    } else {
        console.error(`Request error in ${context}:`, error.message);
        return new Error('Request failed');
    }
};