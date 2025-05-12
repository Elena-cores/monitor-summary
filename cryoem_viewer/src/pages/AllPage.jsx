import React from 'react';
import CTFTimeChart from '../components/CTFTimeChart';
import CTFResolutionHist from '../components/CTFResolutionHist';
import DefocusHist from '../components/DefocusHist';
import { useData } from '../contexts/DataContext';
import { useConfig } from '../contexts/ConfigContext';
import '../assets/histogram.css';

const AllPage = () => {
    const { ctfData, error } = useData();
     const { defocusParameter } = useConfig(); // obtaining the defocus parameter from the context
    
    return (
        <div className="AllView">
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <CTFTimeChart graphData={ctfData} />
            <DefocusHist graphData={ctfData} parameter= {defocusParameter} />
            <CTFResolutionHist graphData={ctfData} parameter="Resolution" />
            <p className="highcharts-description">
                Customize graphs with the custom bar above.
            </p>
        </div>
    );
};

export default AllPage;
