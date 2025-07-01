import React, { createContext, useContext, useEffect, useState } from 'react';
import { getConfig, patchConfig } from '../api/configApi';
import { useAuth } from './AuthContext';

const ConfigContext = createContext();

// create context for config data (for graph customization)
// use children prop to wrap around components
export const ConfigProvider = ({ children }) => {
    const { isAuthenticated } = useAuth(); // get authentication status from AuthContext
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
            setError(error.message)
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
        } catch (error) {
            console.error("Error updating config:", error);
            throw error;
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadConfig(); // only load config data if user is authenticated
        }
    }, [isAuthenticated]); // depend on authentication status

    return (
        <ConfigContext.Provider value={{
            config,
            loading,
            error,
            updateConfig,
            refreshConfig: loadConfig,
            defocusParameter,
            setDefocusParameter
        }}>
            {children}
        </ConfigContext.Provider>
    );
};

// useConfig hook to access config data in components
export const useConfig = () => useContext(ConfigContext);

