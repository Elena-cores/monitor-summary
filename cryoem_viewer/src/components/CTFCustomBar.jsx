import React from 'react';
import { useConfig } from '../contexts/ConfigContext';

const CTFCustomBar = ({ options }) => {
    // useConfig() is a custom hook that provides access to the config context
    const { defocusParameter, setDefocusParameter } = useConfig();

    // If defocusParameter is undefined or setDefocusParameter is not a function, return null
    // This is to prevent rendering the component if the necessary context values are not available
    if (defocusParameter === undefined || typeof setDefocusParameter !== 'function') {
        return null;
    }

    return (
        <div className="custom-bar">
            <select
                value={defocusParameter}
                onChange={(e) => setDefocusParameter(e.target.value)}
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))} 
            </select>
        </div>
    );
};

export default CTFCustomBar;