import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { withChartTheme } from '../hocs/withChartTheme';

const DefocusHistogram = ({ graphData, isDark, getThemeOptions }) => {
    // verify if data exists
    if (!graphData || graphData.length === 0) {
        return <p>No data available for defocus histogram</p>;
    }

    // generate interval ranges
    const generateDefocusRanges = () =>{
        const ranges = [];
        //first specific range (0-0.1)
        ranges.push({ min: 0, max: 0.1, label: '0-0.1' });
        // intermediate ranges (0.1-0.5)
        ranges.push({ min: 0.1, max: 0.5, label: '0.1-0.5' });
        // generate ranges from 0.5-4.0
        for (let i = 0.5; i < 4.0; i += 0.5) {
            ranges.push({ 
                min: i, 
                max: i + 0.5, 
                label: `${i.toFixed(1)}-${(i + 0.5).toFixed(1)}`
            });
        };
        // last range (>4.0)
        ranges.push({ min: 4.0, max: Infinity, label: '>4.0' });
        return ranges;
    };

    const defocusRanges = generateDefocusRanges();  // object array of ranges

    // Convert to Highcharts format 
    const histogramData = defocusRanges.map(range => {  // Turn the object into an array of [key, value] pairs
        const count = graphData.filter(ctf => {
            const defocusu = ctf.defocusu;
            return defocusu >= range.min && defocusu < range.max;
        }).length; // count of micrographs in this bin. 
        
        return {
            name: range.label, //ex. '0-0.1'
            y: count,
            range: `${range.min}-${range.max}` //ex. ['0-0.1', 25] (25 micrographs in this range)
        };
    });
        
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
            labels: {
                rotation: -45, 
            },
        },
        yAxis: {
            title: {
                text: 'Micrographs',
            },
        },
        series: [{
            name: 'Defocus',
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