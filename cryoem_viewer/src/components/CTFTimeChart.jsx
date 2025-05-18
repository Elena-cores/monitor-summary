// src/components/CTFTimeChart.jsx
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { withChartTheme } from '../hocs/withChartTheme';    // import the HOC for theming
import { useConfig } from '../contexts/ConfigContext'; // import the context for configuration

const CTFTimeChart = ({ graphData, isDark, getThemeOptions }) => {
    if (!graphData || graphData.length === 0) {
        return <p>No data available</p>;
    }

    // get the configuration from context
    const { config, loading, error } = useConfig();
    if (loading) return <p>Loading configuration...</p>;
    if (error) return <p>Error loading configuration: {error}</p>;
    if (!config) return <p>No configuration available</p>;

    // get the configuration from context
    const colorResolution = config.color_resolution;
    const colorDefocus = config.color_defocusu;
    const colorPhase = config.color_phaseshift;

    // sort the data by datetime_ctf before mapping
    const sortedData = [...graphData].sort((a, b) =>
        new Date(a.datetime_ctf) - new Date(b.datetime_ctf)
    );


    // convert datetime_ctf to timestamp and map to [x, y] format 
    // map over graphData to create arrays of [x, y] pairs for each parameter
    const defocusuData = sortedData.map(ctf => [
        new Date(ctf.datetime_ctf).getTime(), ctf.defocusu ]);
    
    const phaseShiftData = sortedData.map(ctf => [
        new Date(ctf.datetime_ctf).getTime(), ctf.phaseshift ]);
    
    const resolutionData = sortedData.map(ctf => [
        new Date(ctf.datetime_ctf).getTime(), ctf.resolution ]);


    const myOptions = getThemeOptions(isDark, {
        chart: {
            type: 'spline',
            zooming: { type: 'x' }
        },
        title: {
            text: 'CTF values over time'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                'Click and drag in the plot area to zoom in' :
                'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: [
            {
                id: 'defocus-axis',
                title: {
                    text: 'Defocus (μm)'
                },
                name: 'Defocus U',
                opposite: false
            },
            {
                id: 'phase-axis',
                title: {
                    text: 'Phase Shift (deg)'
                },
                name: 'Phase Shift',
                opposite: true // show on the right side
            },
            {
                id: 'resolution-axis',
                title: {
                    text: 'Resolution (Å)'
                },
                name: 'Resolution',
                opposite: true // show on the right side
            }
        ],
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
        },
        plotOptions: {
            spline: {
                marker: { 
                    radius: 5,
                    enabled: true
                },
                lineWidth: 0,
                states: { hover: { lineWidth: 1.5 } },
                threshold: null
            }
        },
        series: [
            {
                name: 'DefocusU',
                data: defocusuData,
                yAxis: 'defocus-axis', // specify which yAxis to use},
                color: colorDefocus //'rgb(44,175,254)' // color for DefocusU
            },
            {
                name: 'Resolution',
                data: resolutionData,
                yAxis: 'resolution-axis',
                color: colorResolution //'rgb(84,79,197)'
            },
            {
                name: 'Phase Shift',
                data: phaseShiftData,
                yAxis: 'phase-axis',
                color: colorPhase  //'#00e272'

            },
        ],
        exporting: {
            buttons: {
                contextButton: {
                    menuItems: [
                        "viewFullscreen", "printChart", "separator",
                        "downloadPNG", "downloadJPEG", "downloadSVG",
                        "separator", "downloadXLS", "downloadCSV"
                    ]
                }
            }
        },
        responsive: {
            rules: [{
                condition: { maxWidth: 500 },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    });

    return (
        <figure className="highcharts-figure">
            <div id="container">
                <HighchartsReact
                    highcharts={Highcharts}
                    options={myOptions}
                    key={graphData.length}
                />
            </div>
        </figure>
    );
};

export default withChartTheme(CTFTimeChart);