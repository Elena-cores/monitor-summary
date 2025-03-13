import React, { useEffect, useState } from 'react';
import getCTFData from '../api/ctfApi';

const CTFList = () => {
  const [ctfData, setCtfData] = useState([]);

  const loadData = async () => {
    const data = await getCTFData();
    setCtfData(data);
  };

  useEffect(() => {
    loadData(); // initially load data

    const interval = setInterval(() => {
      loadData();
    }, 3000);  //every 3 seconds update
    
    return () => clearInterval(interval);
    //getCTFData().then(setCtfData);
  }, []);

  return (
    <ul>
      {ctfData.map((ctf) => (
        <li key={ctf.id}>
          DefocusU: {ctf.defocusu}, DefocusV: {ctf.defocusv}
        </li>
      ))}
    </ul>
  );
};

export default CTFList;