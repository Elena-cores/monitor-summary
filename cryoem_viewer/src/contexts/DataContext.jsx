import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCTFData } from '../api/ctfApi'; // import API functions to fetch data


const DataContext = createContext(); 

// use children prop to wrap around components
export const DataProvider = ({ children }) => { 
    // ** IN THE FUTURE, WE CAN ADD MORE STATES FOR OTHER DATA TYPES **
    const [ctfData, setCtfData] = useState([]); // manage CTF data state
    const [error, setError] = useState(null);

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
        loadCTFData();
        // set up interval to refresh data every 6 seconds
        const interval = setInterval(() => {
            loadData();
        }, 6000);  //every 6 seconds update

        return () => clearInterval(interval);

    }, []);

    return (
        <DataContext.Provider value={{ ctfData, error }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);


