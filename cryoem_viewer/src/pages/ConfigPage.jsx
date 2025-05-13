import React, { useState, useEffect } from "react";
import { useConfig } from "../contexts/ConfigContext";

const ConfigPage = () => {
    const { config, updateConfig } = useConfig(); // use updateConfig from context
    const [error, setError] = useState("");
     const [success, setSuccess] = useState("");
    const [localConfig, setLocalConfig] = useState({}); // local state for form inputs

    // synchronize local state with context config
    // useEffect to set localConfig when config changes
    useEffect(() => {
        if (config) {
            setLocalConfig({ ...config });
        }
    }, [config]);
    // set localConfig to config when it changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalConfig(prev => ({
            ...prev,
            // if name includes 'color', set value as is, else parse to float
            [name]: name.includes('color') ? value : value === "" ? "" : parseFloat(value) // parse value to float for numeric inputs
        }));
    };

    // handle form submission and update config
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // reset error message
        setSuccess(""); // reset success message
        try {
            // basic validation
            if (localConfig.maxres_min >= localConfig.maxres_max) {       // check if min is less than max
                throw new Error("The minimum value must be less than maximum velue for resolution range.");
            }
            await updateConfig(localConfig);
            setSuccess("Configuration saved successfully!"); // set success message

             setTimeout(() => setSuccess(""), 3000); // clear success message after 3 seconds

        } catch (err) {
            setError(err.message);
        }
    };


    if (!config) return <p>Loading configuration...</p>;

    return (
        <div className="config-page">
            <h1>Graph Configuration</h1>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>} 
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Max Resolution Range (Å):</label>
                    <div className="range-inputs">
                        <input
                            type="number"
                            name="maxres_min"
                            value={localConfig.maxres_min ?? ""}
                            onChange={handleChange}
                            step="0.1"  
                            min="0"
                            required
                        />
                        <span>to</span>
                        <input
                            type="number"
                            name= "maxres_max"
                            value={localConfig.maxres_max ?? ""}
                            onChange={handleChange}
                            step="0.1"
                            min={(localConfig.maxres_min ?? 0) + 0.1} // ensure max is greater than min
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Interval (Å):</label>
                    <input
                        type="number"
                        name="maxres_interval"
                        value={localConfig.maxres_interval ?? ""}
                        onChange={handleChange}
                        step="0.1"
                        min="0.1"
                        max={!isNaN(localConfig.maxres_max - localConfig.maxres_min) ?
                            (localConfig.maxres_max - localConfig.maxres_min) : 10} // ensure interval is less than the range
                        required
                    />
                </div>

                <div className="color-pickers">
                    <div className="form-group">
                        <label>Resolution Color:</label>
                        <input
                            type="color"
                            name="color_resolution"
                            value={localConfig.color_resolution ?? "#2CAFFE"} // default color
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <button type="submit" className="submit-btn">
                    Save Configuration
                </button>
            </form>
        </div>
    );
};

export default ConfigPage;