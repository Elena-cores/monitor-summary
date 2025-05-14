import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { withChartTheme } from '../hocs/withChartTheme'; // import the HOC for theming
import { useConfig } from '../contexts/ConfigContext'; // import the context for configuration

const DefocusHistogram = ({ graphData, parameter, isDark, getThemeOptions }) => {
    // verify if data exists
    if (!graphData || graphData.length === 0) {
        return <p>No data available for defocus histogram</p>;
    }

    // Get config from context
    const { config } = useConfig();

    // generate interval ranges using config values with defaults
    const generateDefocusRanges = () => {
        const ranges = [];
        // default values for defocus coverage
        const {
            defocuscov_min = 0.0,
            defocuscov_max = 4.0,
            defocuscov_interval = 0.5
        } = config || {};

        // Generate ranges from min to max
        for (let i = defocuscov_min; i < defocuscov_max; i += defocuscov_interval) {
            const max = Math.min(i + defocuscov_interval, defocuscov_max);
            ranges.push({
                min: i,
                max: max,
                label: `${i.toFixed(1)}-${max.toFixed(1)}`
            });
        }

        // Add final overflow range
        ranges.push({
            min: defocuscov_max,
            max: Infinity,
            label: `>${defocuscov_max.toFixed(1)}`
        });

        return ranges;
    };

    const defocusRanges = generateDefocusRanges();  // object array of ranges
    const recentCount = config?.defocuscov_recent_micrographs_count || 50;


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
        
    //  filter recent micrographs
    //  If sort() method returns: a negative number, a goes before b
    const recentDefocusData = [...graphData]
        .sort((a, b) => new Date(b.datetime_ctf) - new Date(a.datetime_ctf))
        .slice(0, recentCount);

    // data for recent mcirographs
    const recentHistData = defocusRanges.map(range => { // create new array iterating over same ranges
        const count = recentDefocusData.filter(ctf => { // filter recent micrographs 
            const defocusValue = ctf[parameter.toLowerCase()];
            return defocusValue >= range.min && defocusValue < range.max;
        }).length; // count of micrographs in this bin.

        return {
            name: range.label,
            y: count,
            range: `${range.min}-${range.max}` //ex. ['0-0.1', 25] (25 micrographs in this range)	
        };
    });

     // Get colors from config or use default colors
    const defocusColor = parameter === 'DefocusU' 
        ? config?.color_defocusu || '#00e272'
        : config?.color_defocusv || '#00e272';

    // default color for defocus histogram
     const recentColor = config?.color_recent_defocuscov || '#544FC5';

    const options = getThemeOptions(isDark, {
        chart: {
            type: 'column',
             zooming: {
                type: 'x',
                mouseWheel: true
            }
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
            name: parameter, // dynamic name & color
            data: histogramData,
            color: defocusColor, 
        },
        {
            name: `Defocus (last ${recentCount} mics)`, 
            data: recentHistData,
            color: recentColor, //'rgb(84,79,197)', // Purple color for last 50 micrographs
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