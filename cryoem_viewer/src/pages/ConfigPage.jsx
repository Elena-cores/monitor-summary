import React, { useState, useEffect } from "react";
import { useConfig } from "../contexts/ConfigContext";
import "../assets/configPage.css"; 

const ConfigPage = () => {
    const { config, updateConfig } = useConfig(); // use updateConfig from context
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [localConfig, setLocalConfig] = useState({}); // local state for form inputs

    // synchronize local state with context config
    // When global config updates, sync it into localConfig
    useEffect(() => {
        if (config) {
            setLocalConfig({ ...config });
        }
    }, [config]);

    // Handle standard input changes (both numbers and colors)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalConfig(prev => ({
            ...prev,
            // if name includes 'color', set value as is, else parse to float
            [name]: name.includes('color') ? value : value === "" ? "" : parseFloat(value) // parse value to float for numeric inputs
        }));
    };

     // Submit updated config to context and show success/error messages
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // reset error message
        setSuccess(""); // reset success message
        try {
            // Validation: min value must be less than max value
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

    // render the configuration form with current values
    return (
        <div className="config-page">
            <h2>Max Resolution settings</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <form onSubmit={handleSubmit}>
                 {/* Range for Max Resolution */}
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
                            name="maxres_max"
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
                {/* Range for Defocus Coverage */}
                <h2>Defocus Coverage settings</h2>
                
                <div className="form-group">
                    <label>Defocus Range (μm):</label>
                    <div className="range-inputs">
                        <input
                            type="number"
                            name="defocuscov_min"
                            value={localConfig.defocuscov_min ?? 0.0}
                            onChange={handleChange}
                            step="0.1"
                            min="0"
                            required
                        />
                        <span>to</span>
                        <input
                            type="number"
                            name="defocuscov_max"
                            value={localConfig.defocuscov_max ?? 4.0}
                            onChange={handleChange}
                            step="0.1"
                            min={(localConfig.defocuscov_min ?? 0) + 0.1}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Interval (μm):</label>
                    <input
                        type="number"
                        name="defocuscov_interval"
                        value={localConfig.defocuscov_interval ?? 0.5}
                        onChange={handleChange}
                        step="0.1"
                        min="0.1"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Recent Micrographs Count:</label>
                    <input
                        type="number"
                        name="defocuscov_recent_micrographs_count"
                        value={localConfig.defocuscov_recent_micrographs_count ?? 50}
                        onChange={handleChange}
                        min="1"
                        max="1000"
                        required
                    />
                </div>
                
                {/* Section Colors config*/}
                <h2>Color settings</h2>
                <div className="color-pickers">
                    <div className="form-group">
                        <label>Resolution Color:</label>
                        <input
                            type="color"
                            name="color_resolution"
                            value={localConfig.color_resolution ?? "#2CAFFE"} // default blue
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Defocus U Color:</label>
                        <input
                            type="color"
                            name="color_defocusu"
                            value={localConfig.color_defocusu ?? "#00e272"} // default green
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Defocus V Color:</label>
                        <input
                            type="color"
                            name="color_defocusv"
                            value={localConfig.color_defocusv ?? "#00e272"} // default green
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Phase Shift Color:</label>
                        <input
                            type="color"
                            name="color_phaseshift"
                            value={localConfig.color_phaseshift ?? "#544FC5"} // default purple
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Recent Defocus Coverage Color:</label>
                        <input
                            type="color"
                            name="color_recent_defocuscov"
                            value={localConfig.color_recent_defocuscov ?? "#544FC5"}
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