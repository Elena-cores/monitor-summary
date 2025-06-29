import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { withChartTheme } from '../hocs/withChartTheme'; // import the HOC for theming
import { useConfig } from '../contexts/ConfigContext'; // import the context for configuration
import { useAuth } from '../contexts/AuthContext'; // import the context for authentication


const CTFResolutionHist = ({ graphData, isDark, getThemeOptions }) => {
    const { isLoading, isAuthenticated } = useAuth();
    const { config, loading: configLoading, error: configError } = useConfig();

    // Mostrar estados de carga/error
    if (isLoading) return <p>Verifying authentication...</p>;
    if (!isAuthenticated) return <p>Please login to view this content</p>;
    if (configLoading) return <p>Loading configuration...</p>;
    if (configError) return <p>Error loading configuration: {configError}</p>;
    if (!graphData || graphData.length === 0) return <p>No data available for histogram</p>;
    if (!config) return <p>No configuration available</p>;

    const color = config.color_resolution;  // default color for resolution histogram
    const interval = config.maxres_interval; // interval for resolution histogram
    const minRange = config.maxres_min; // minimum range for resolution histogram
    const maxRange = config.maxres_max; // maximum range for resolution histogram

    // process data: group by range of resolution and count micrographs
    const resolutionBins = {};
    graphData.forEach(ctf => {
        const resolution = ctf.resolution;
        // use Math.floor here if you want to round down to the nearest 0.5 Å
        const binKey = (Math.round(resolution / interval) * interval).toFixed(1);  // group by resolution and round to nearest 0.5 Å
        resolutionBins[binKey] = (resolutionBins[binKey] || 0) + 1;
    });

    // Generate categories from 0-10 Å with intervals of 0.5
    const categories = [] 
    for (let i = minRange; i <= maxRange; i += interval) {
        categories.push(i.toFixed(1));
    }

    // convert to Highcharts format
    const histogramData = categories.map(bin => ({  // Turn the object into an array of [key, value] pairs
        name: `${bin} Å`,  
        y: resolutionBins[bin] || 0, // count of micrographs in this bin
    }));

    // configuration of histogram
    const options = getThemeOptions(isDark, {
        chart: {
            type: 'column',
             zooming: {
                type: 'x',
                mouseWheel: true
            }
        },
        title: {
            text: 'Max. Resolution',
        },
        xAxis: {
            type: 'category', 
            categories, // resolution ranges
            title: {
                text: 'Resolution (Å)',
            },
        },
        yAxis: {
            title: {
                text: 'Micrographs',
            },
        },
        series: [{
            name: 'Resolution',
            data: histogramData,
            color: color, // // Blue color for resolution
        }],
        tooltip: {
            headerFormat: '<span style="font-size:10px">Resolution: {point.key}</span><br/>',
            pointFormat: '<b>{point.y}</b> micrograph(s)',
        },
    });

    return (
        <div className="histogram-container">
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default withChartTheme(CTFResolutionHist);   