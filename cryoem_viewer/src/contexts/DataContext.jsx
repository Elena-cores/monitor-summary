import React, { createContext, useContext, useEffect, useState } from 'react';
import getCTFData from '../api/ctfApi'; // import API functions to fetch data
import { useAuth } from './AuthContext'; // import Auth context to check authentication


const DataContext = createContext();

// use children prop to wrap around components
export const DataProvider = ({ children }) => {
    // ** IN THE FUTURE, WE CAN ADD MORE STATES FOR OTHER DATA TYPES **
    const [ctfData, setCtfData] = useState([]); // manage CTF data state
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth(); // get authentication status from AuthContext

    // load CTF data
    const loadCTFData = async () => {
        try {
            const data = await getCTFData();
            setCtfData(data);
            setError(null); // clean previous errors
        } catch (err) {
            console.error('Error fetching CTF data:', err);
            setError('Failed to load CTF data');
        }
    };

    // useEffect to load data when component mounts 
    useEffect(() => {
        // ONLY LOAD DATA IF USER IS AUTHENTICATED
        if (!isAuthenticated) {
            setCtfData([]); // clear CTF data if not authenticated
            return;
        }

        loadCTFData();
        const interval = setInterval(() => {
            loadCTFData();
        }, 6000);

        return () => clearInterval(interval);
    }, [isAuthenticated]); // depend on authentication status

    return (
        <DataContext.Provider value={{ ctfData, error }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);


