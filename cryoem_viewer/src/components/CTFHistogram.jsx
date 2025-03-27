import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const CTFHistogram = ({ graphData }) => {
    // verify if data exists
    if (!graphData || graphData.length === 0) {
        return <p>No data available for histogram</p>;
    }

    // process data: group by range of resolution and count micrographs
    const resolutionBins = {};
    graphData.forEach(ctf => {
        const resolution = ctf.resolution;
        const binKey = resolution.toFixed(2);  // group by resolution with 2 decimals
        resolutionBins[binKey] = (resolutionBins[binKey] || 0) + 1;
    });

    // convert to Highcharts format
    const histogramData = Object.entries(resolutionBins).map(([bin, count]) => ({
        name: `${bin} Å`, // add unit (Angstroms)
        y: count,
        resolution: parseFloat(bin),
    })).sort((a, b) => a.resolution - b.resolution); // order by resolution

    // configuration of histogram
    const options = {
        chart: {
            type: 'column', // column histogram
        },
        title: {
            text: 'Micrographs by CTF Resolution',
        },
        xAxis: {
            type: 'category', // use categories (resolution ranges)
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
            name: 'Micrographs',
            data: histogramData,
            color: '#7cb5ec', // blue
        }],
        tooltip: {
            headerFormat: '<span style="font-size:10px">Resolution: {point.key}</span><br/>',
            pointFormat: '<b>{point.y}</b> micrograph(s)',
        },
    };

    return (
        <div className="histogram-container">
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default CTFHistogram;