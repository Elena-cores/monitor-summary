import React, { useEffect, useState } from 'react';
import CTFTimeChart from '../components/CTFTimeChart';
import CTFResolutionHist from '../components/CTFResolutionHist';
import DefocusHist from '../components/DefocusHist';
import CTFCustomBar from '../components/CTFCustomBar';
import getCTFData from '../api/ctfApi';
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { useConfig } from '../contexts/ConfigContext';
import '../assets/histogram.css';

// show components in page
const CTFPage = () => {
  const { ctfData, error } = useData();
  const { defocusParameter } = useConfig(); // obtaining the defocus parameter from the context

  // render data from components AND conditionally render if there is an error (true)
  return (
    <div>
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
      <div className="histogram-wrapper">
        <CTFTimeChart graphData={ctfData} />
      </div>
      <p className="highcharts-description">
        Customize graphs with the custom bar above.
      </p>
    </div>
  );
};

export default CTFPage;