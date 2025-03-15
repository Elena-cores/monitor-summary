import React, { useEffect, useState } from 'react';
import CTFList from '../components/CTFList';
import CTFGraph from '../components/CTFChart';
import getCTFData from '../api/ctfApi';

// show components in page
const CTFPage = () => {
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
  }, []);


  return (
    <div>
      <h1>CTF Data</h1>
      <CTFList ctfData={ctfData} />
      <CTFGraph graphData={
        [
          [
            1264550400000,
            0.7107
          ],
          [
            1264636800000,
            0.7144
          ],
          [
            1264723200000,
            0.7161
          ],
          [
            1264982400000,
            0.7189
          ],
          [
            1265068800000,
            0.7176
          ],
          [
            1265155200000,
            0.7152
          ],
        ]
      }/>
    </div>
  );
};

export default CTFPage;