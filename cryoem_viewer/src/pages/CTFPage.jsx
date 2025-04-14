import React, { useEffect, useState } from 'react';
import CTFTimeChart from '../components/CTFTimeChart';
import CTFResolutionHist from '../components/CTFResolutionHist';
import DefocusHist from '../components/DefocusHist';
import getCTFData from '../api/ctfApi';
import '../assets/histogram.css';
import CTFCustomBar from '../components/CTFCustomBar';
import Layout from '../components/Layout';  
// import CTFList from '../components/CTFList'; 

// show components in page
const CTFPage = () => {
  const [ctfData, setCtfData] = useState([]);
  const [error, setError] = useState(null); // error false to begin
  // custom bar options
  const [selectedGraph, setSelectedGraph] = useState('defocusCoverage'); 
  const [selectedParameter, setSelectedParameter] = useState('DefocusU'); 
  const [defocusParameter, setDefocusParameter] = useState('DefocusU'); 

  
  const graphOptions = {
    defocusCoverage: {
      parameters: ['DefocusU', 'DefocusV'],
    },
    other: {
      parameters: ['option4', 'option5'],
    }
  };

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

    return () => clearInterval(interval);

  }, []);

  // reset selected parameter when graph changes
  useEffect(() => {
    setSelectedParameter(graphOptions[selectedGraph].parameters[0]);
  }, [selectedGraph]);

  // synch defocus parameter with selected parameter
  useEffect(() => {
    if (selectedGraph === 'defocusCoverage') {
      setDefocusParameter(selectedParameter);
    }
  }, [selectedParameter, selectedGraph]);


  // render data from components AND conditionally render if there is an error (true)
  return (
    <div>
      {/* combo 1: selecting graph */}

      <select
        value={selectedGraph}
        onChange={(e) => setSelectedGraph(e.target.value)}
      >
        <option value="defocusCoverage">Defocus coverage</option>
        <option value="other">other</option>
      </select>

      {/* combo 2: specific options of selected graphs */}
      <CTFCustomBar
        value={selectedParameter} // default value of combo2
        onChange={setSelectedParameter} // pass the function to handle changes
        options={graphOptions[selectedGraph].parameters} // options of combo2
      />

      <p>Selected graph: {selectedGraph}</p>
      <p>Selected parameter: {selectedParameter}</p>


      {/*graphs*/}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="histograms-container">
        <div className="histogram-wrapper">
          <CTFResolutionHist graphData={ctfData} />
        </div>
        <div className="histogram-wrapper">
          <DefocusHist graphData={ctfData} parameter={defocusParameter} />
        </div>
      </div>
      <CTFTimeChart graphData={ctfData} />
    </div>
  );
};

export default CTFPage;
