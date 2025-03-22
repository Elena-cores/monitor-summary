import React, { useEffect, useState } from 'react';
import CTFList from '../components/CTFList';
import CTFGraph from '../components/CTFChart';
import getCTFData from '../api/ctfApi';
import Sidebar from '../components/Sidebars';

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
    }, 3000);  //every 3 seconds update

    return () => clearInterval(interval);
  }, []);

  // render data from components AND conditionally render if there is an error (true)
  return (
    <div>
      <h1>CTF Data</h1>
      <Sidebar />
      <CTFList ctfData={ctfData} />
      <CTFGraph graphData={ctfData} />
      {error && <p style={{ color: 'red' }}>{error}</p>}  
    </div>
  );
};

export default CTFPage;