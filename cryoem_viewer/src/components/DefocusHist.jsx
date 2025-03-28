import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { withChartTheme } from '../hocs/withChartTheme';

const DefocusHistogram = ({ graphData, isDark, getThemeOptions }) => {
    if (!graphData || graphData.length === 0) {
        return <p>No data available for defocus histogram</p>;
    }

    // process data: group by range of defocusU and count micrographs
    const defocusBins = {};
    graphData.forEach(ctf => {
        const binKey = ctf.defocusu.toFixed(2); // Group by defocusU to 2 decimales
        defocusBins[binKey] = (defocusBins[binKey] || 0) + 1;
    });

    // Convert to Highcharts format and sort
    const histogramData = Object.entries(defocusBins).map(([bin, count]) => ({
        name: `${bin} μm`,
        y: count,
        defocus: parseFloat(bin),
    })).sort((a, b) => a.defocus - b.defocus);

    const options = getThemeOptions(isDark, {
        chart: {
            type: 'column',
        },
        title: {
            text: 'Defocus Coverage',
        },
        xAxis: {
            type: 'category',
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