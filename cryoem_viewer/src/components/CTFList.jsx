import React, { useEffect, useState } from 'react';
import getCTFData from '../api/ctfApi';

const CTFList = () => {
  const [ctfData, setCtfData] = useState([]);

  useEffect(() => {
    getCTFData().then(setCtfData);
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