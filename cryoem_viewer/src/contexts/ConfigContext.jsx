import React, { createContext, useContext, useEffect, useState } from 'react';
import { getConfig } from '../api/ctfApi';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => { // use children prop to wrap around components
    const [config, setConfig] = useState(null);

    useEffect(() => {
        const loadConfig = async () => {
            const data = await getConfig(); // fetch config data 
            setConfig(data);
        };
        loadConfig();
    }, []);

    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => useContext(ConfigContext);

