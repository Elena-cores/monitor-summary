import axios from 'axios';

const Config_URL = 'http://localhost:8000/api/config/';

// GET all data from Config
export const getConfig = async () => {
    try {
        const response = await axios.get(Config_URL);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to load config data: ${error.message}`);
    }
};

export const patchConfig = async (data) => {
    try {
        const response = await axios.patch(Config_URL, data);
        return response.data; // updated config data
    } catch (error) {
        throw new Error(`Failed to update config: ${error.message}`);
    }
};