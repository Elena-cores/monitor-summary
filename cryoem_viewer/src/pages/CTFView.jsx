import React, { useEffect, useState } from 'react';
import CTFList from '../components/CTFList';
import CTFGraph from '../components/CTFChart';
import CTFResolutionHist from '../components/CTFResolutionHist';
import DefocusHist from '../components/DefocusHist';
import getCTFData from '../api/ctfApi';
import '../assets/histogram.css'; 
import CTFCustomBar from '../components/CTFCustomBar';

// show components in page
const CTFPage = () => {
  const [ctfData, setCtfData] = useState([]);
  const [error, setError] = useState(null); // error false to begin

  const [selectedOption, setSelectedOption] = useState('x'); // Default value
  const handleOptionChange = (newValue) => {
    setSelectedOption(newValue);
  };

  const [valueList2, setValueList2] = useState([]); // state for valueListCombo2

  const optionsCombo2 = {
    "x": ['option1', 'option2', 'option3'],
    "y": ['option4', 'option5', 'option6'],
  }

  const loadData = async () => {
    try {
      const data = await getCTFData();
      setCtfData(data);
      setError(null); // clean previous errors
      
    } catch (err) {
      console.error("Error fetching CTF data", err);
      setError("* Failed to load the data *");
    }
  };

  useEffect(() => {
    loadData(); // initially load data

    const interval = setInterval(() => {
      loadData();
    }, 6000);  //every 6 seconds update

    console.log(selectedOption);
    setValueList2(optionsCombo2[selectedOption]); // update valueListCombo2 based on selectedOption

    return () => clearInterval(interval);

  }, [selectedOption]);

  // render data from components AND conditionally render if there is an error (true)
  return (
    <div>

      <CTFCustomBar 
        value={selectedOption} 
        onChange={handleOptionChange}
        valueListCombo2={valueList2}
      />

      <p>Selected value: {selectedOption}</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="histograms-container">
        <div className="histogram-wrapper">
          <CTFResolutionHist graphData={ctfData} />
        </div>
        <div className="histogram-wrapper">
          <DefocusHist graphData={ctfData} />
        </div>
      </div>
      <CTFGraph graphData={ctfData} />
    </div>
  );
};

export default CTFPage;