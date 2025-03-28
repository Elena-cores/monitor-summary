import React, { useEffect, useState } from 'react';
import CTFList from '../components/CTFList';
import CTFGraph from '../components/CTFChart';
import CTFResolutionHist from '../components/CTFResolutionHist';
import DefocusHist from '../components/DefocusHist';
import getCTFData from '../api/ctfApi';
import '../assets/histogram.css'; 

// show components in page
const CTFPage = () => {
  const [ctfData, setCtfData] = useState([]);
  const [error, setError] = useState(null); // error false to begin

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

  // render data from components AND conditionally render if there is an error (true)
  return (
    <div>
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