import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { withChartTheme } from '../hocs/withChartTheme';

const DefocusHistogram = ({ graphData, parameter, isDark, getThemeOptions }) => {
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

    // Convert to Highcharts format and count micrgraphs in each range depending on parameter selected 
    const histogramData = defocusRanges.map(range => {  
        const count = graphData.filter(ctf => {
            const defocusValue = ctf[parameter.toLowerCase()]; 
            return defocusValue >= range.min && defocusValue < range.max;
        }).length; // count of micrographs in this bin. 
        
        return {
            name: range.label, 
            y: count,
            range: `${range.min}-${range.max}` //ex. ['0-0.1', 25] (25 micrographs in this range)
        };
    });
        
    //  filter last 50 micrographs
    //  If sort() method returns: a negative number, a goes before b
    const recentDefocusData = [...graphData].sort((a, b) => new Date(b.datetime_ctf) - new Date(a.datetime_ctf)).slice(0, 50);

    // data for last 50 mcirographs
    const recentHistData = defocusRanges.map(range => { // create new array iterating over same ranges
        const count = recentDefocusData.filter(ctf => { // filter last 50 micrographs 
            const defocusValue = ctf[parameter.toLowerCase()];
            return defocusValue >= range.min && defocusValue < range.max;
        }).length; // count of micrographs in this bin.

        return {
            name: range.label,
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
                text: `Defocus ${parameter === 'DefocusU' ? 'U' : 'V'} (μm)`, 
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
            name: parameter, // dynamic name
            data: histogramData,
            color: '#00e272', // Green color for defocus
        },
        {
            name: 'Defocus (last 50 mics)', 
            data: recentHistData,
            color: 'rgb(84,79,197)', // Purple color for last 50 micrographs
        }
    ],
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