import React, { createContext, useContext, useEffect, useState } from 'react';
import { getConfig } from '../api/ctfApi';

const ConfigContext = createContext();  

// create context for config data (for graph customization)
 // use children prop to wrap around components
export const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState() || {};
    const [defocusParameter, setDefocusParameter] = useState('DefocusU');

    useEffect(() => {
        const loadConfig = async () => {
            const data = await getConfig(); // fetch config data 
            setConfig(data);
        };
        loadConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{config, defocusParameter, setDefocusParameter}}>
            {children}
        </ConfigContext.Provider>
    );
};

// personalized hook to use the config context
export const useConfig = () => useContext(ConfigContext);

