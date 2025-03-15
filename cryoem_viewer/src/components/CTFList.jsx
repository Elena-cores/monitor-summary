import React from 'react';

const CTFList = ({ ctfData }) => {

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