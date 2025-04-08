import React from 'react';

const CTFCustomBar = ({ value, onChange, options }) => {
    return (
        <>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </>
    );
};

export default CTFCustomBar;