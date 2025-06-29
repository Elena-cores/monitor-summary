import api from './api';

const API_URL = 'http://localhost:8000/api/auth/';

// Register a new user
export const register = async (userData) => {
    try {
        const response = await api.post(`${API_URL}register/`, userData);
        return response.data;
    } catch (error) {
        // Extract specific error messages from the backend
        if (error.response && error.response.data) {
            const errorData = error.response.data;

            // manage backend validation errors
            if (errorData.username) {
                throw new Error(`Username: ${Array.isArray(errorData.username) ? errorData.username.join(' ') : errorData.username}`);
            }
            if (errorData.password) {
                throw new Error(`Password: ${Array.isArray(errorData.password) ? errorData.password.join(' ') : errorData.password}`);
            }
            if (errorData.email) {
                throw new Error(`Email: ${Array.isArray(errorData.email) ? errorData.email.join(' ') : errorData.email}`);
            }
            if (errorData.non_field_errors) {
                throw new Error(Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors.join(' ') : errorData.non_field_errors);
            }
        }
        throw handleApiError(error, 'register');
    }
};

// Login an existing user
export const login = async (credentials) => {
    try {
        const response = await api.post(`${API_URL}login/`, credentials);
        return response.data;
    } catch (error) {
        // manage specific error messages of inivalid credentials
        if (error.response && error.response.status === 400) {
            throw new Error('Invalid username or password');
        }
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
        if (error.response.status === 401) {
            return new Error('Session expired. Please login again');
        }
        if (error.response.status === 500) {
            return new Error('Server error. Please try again later');
        }
        return new Error(error.response.data.detail || 'Request failed');
    } else if (error.request) {
        console.error(`Network error in ${context}:`, error.request);
        return new Error('Network error. Please check your connection');
    } else {
        console.error(`Request error in ${context}:`, error.message);
        return new Error('Request failed. Please try again');
    }
};