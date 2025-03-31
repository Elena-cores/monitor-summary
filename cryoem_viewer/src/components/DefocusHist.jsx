import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { withChartTheme } from '../hocs/withChartTheme';

const DefocusHistogram = ({ graphData, isDark, getThemeOptions }) => {
    // verify if data exists
    if (!graphData || graphData.length === 0) {
        return <p>No data available for defocus histogram</p>;
    }

    // process data: group by range of defocusu and count micrographs
    const defocusBins = {};
    graphData.forEach(ctf => {
        const defocusu = ctf.defocusu;
        const binKey = defocusu.toFixed(1); // Group by defocusU to 1 decimal place
        defocusBins[binKey] = (defocusBins[binKey] || 0) + 1;
    });

    // Convert to Highcharts format 
    const histogramData = Object.entries(defocusBins).map(([bin, count]) => ({  // Turn the object into an array of [key, value] pairs
        name: `${bin} μm`,
        y: count,
        defocusU: parseFloat(bin),
    })).sort((a, b) => a.defocusU - b.defocusU); // order by defocusU

    const options = getThemeOptions(isDark, {
        chart: {
            type: 'column',
        },
        title: {
            text: 'Defocus Coverage',
        },
        xAxis: {
            type: 'category', // use categories (defocusu ranges)
            title: {
                text: 'Defocus U (μm)',
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
            color: '#90ed7d', // Green color for defocus
        }],
        tooltip: {
            headerFormat: '<span style="font-size:10px">Defocus: {point.key}</span><br/>',
            pointFormat: '<b>{point.y}</b> micrograph(s)',
        },
    });

    return (
        <div className="defocus-histogram-container">
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default withChartTheme(DefocusHistogram);