import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { withChartTheme } from '../hocs/withChartTheme'; // import the HOC for theming

const CTFResolutionHist = ({ graphData, isDark, getThemeOptions }) => {
    // verify if data exists
    if (!graphData || graphData.length === 0) {
        return <p>No data available for histogram</p>;
    }

    // process data: group by range of resolution and count micrographs
    const resolutionBins = {};
    graphData.forEach(ctf => {
        const resolution = ctf.resolution;
        const binKey = (Math.ceil(resolution / 0.5) * 0.5).toFixed(1);  // group by resolution and round to nearest 0.5 Å
        resolutionBins[binKey] = (resolutionBins[binKey] || 0) + 1;
    });

    // Generate categories from 0-10 Å with intervals of 0.5
    const categories = [] 
    for (let i = 0; i <= 10; i += 0.5) {
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
            data: histogramData.map(({ resolution, y}) => [resolution, y]), // Use [x, y] pairs
            color: '#7cb5ec', // // Blue color for resolution
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