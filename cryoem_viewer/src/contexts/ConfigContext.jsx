import React, { createContext, useContext, useEffect, useState } from 'react';
import { getConfig, patchConfig } from '../api/configApi';

const ConfigContext = createContext();  

// create context for config data (for graph customization)
 // use children prop to wrap around components
export const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [defocusParameter, setDefocusParameter] = useState('DefocusU');

    const loadConfig = async () => {
            try {
                setLoading(true);
                const data = await getConfig(); // fetch config data 
                setConfig(data);
                setError(null);
            } catch (error) {
                setError(err.message)
                console.error("Error loading config data:", error);
            } finally {
                setLoading(false);
            }
        setLoading(false);
    };

    // function to update config data and local state
    const updateConfig = async (newConfig) => {
        try {
            const updatedConfig = await patchConfig(newConfig); // call API to update config
            
            setConfig(updatedConfig); // update local state with new config
            return updatedConfig;
        } catch (err) {
            console.error("Error updating config:", err);
            throw err;
        }
    };

    useEffect(() => {
        loadConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{
            config,
            loading,
            error,
            updateConfig, 
            refreshConfig: loadConfig,
            defocusParameter, 
            setDefocusParameter}}>
            {children}
        </ConfigContext.Provider>
    );
};

// useConfig hook to access config data in components
export const useConfig = () => useContext(ConfigContext);

