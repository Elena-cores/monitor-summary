import axios from 'axios';

const API_URL = 'http://localhost:8000/api/ctf/';

// GET all data from CTF
export const getCTFData = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;       
    } catch (error) {
        console.error('Error fetching CTF data:', error);
        throw error;
    }
};

export default getCTFData;