import React from 'react';

const CTFCustomBar = ({ value, onChange, valueListCombo2 }) => {
    const handleChange = (event) => {
        if (onChange) {
            onChange(event.target.value);
        }
    };
  
  
    return (
    <>
        <select
            name="combo-opcion-1" 
            id="combo-opcion-1" 
            value={value} 
            onChange={handleChange} 
        >
            <option value="x">X</option>
            <option value="y">Y</option>
        </select>

        <select 
            name="combo-opcion-2" 
            id="combo-opcion-2" 
        >
            {valueListCombo2.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </>
  );
};
  
export default CTFCustomBar;