import api from './api';

const API_URL = 'http://localhost:8000/api/ctf/';

// GET all data from CTF
export const getCTFData = async () => {
    try {
        const response = await api.get(API_URL);
        return response.data;
    } catch (error) {
        if (error.response) {
            // server responded with status code outside of 2xx
            console.error('API Server Error - fetching CTF data:', error.response.status, error.response.data);
            throw new Error(`Server error: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.request) {
            // request was sent but no response received
            console.error('Network Failure - Request sent but no response received from:', API_URL, {
                requestDetails: error.request
            });
            throw new Error('Network error: Could not connect to the server');
        } else {
            // Request never sent
            console.error('Request Configuration Error - Failed before sending to:', API_URL, {
                errorDetails: error.message
            });
            throw new Error('Failed to create API request');
        }
    }
};

export default getCTFData;

