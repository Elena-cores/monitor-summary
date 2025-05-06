// src/components/CTFTimeChart.jsx
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { withChartTheme } from '../hocs/withChartTheme';

const CTFTimeChart = ({ graphData, isDark, getThemeOptions }) => {
    if (!graphData || graphData.length === 0) {
        return <p>No data available</p>;
    }

    // convert datetime_ctf to timestamp and map to [x, y] format 
    // map over graphData to create arrays of [x, y] pairs for each parameter
    const defocusuData = graphData.map(ctf => [new Date(ctf.datetime_ctf).getTime(), ctf.defocusu]);
    const pahseShiftData = graphData.map(ctf => [new Date(ctf.datetime_ctf).getTime(), ctf.phaseshift]);
    const resolutionData = graphData.map(ctf => [new Date(ctf.datetime_ctf).getTime(), ctf.resolution]);

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
                title: { 
                    text: 'Defocus (μm)' 
                },
                name: 'Defocus U',
                opposite: false
            },
            {
                title: {
                    text: 'Phase Shift (deg)'
                },
                name: 'Phase Shift',
                opposite: true // show on the right side
            },
            {
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
                marker: { radius: 5 },
                lineWidth: 0,
                states: { hover: { lineWidth: 1.5 } },
                threshold: null
            }
        },
        series: [
            {
                name: 'DefocusU', 
                data: defocusuData,
                yAxis: 0, // specify which yAxis to use},
                color: 'rgb(44,175,254)' // color for DefocusU
            },
            {
                name: 'Resolution',
                data: resolutionData,
                yAxis: 2,
                color: 'rgb(84,79,197)'
            },
            { 
                name: 'Phase Shift',
                data: pahseShiftData,
                yAxis: 1, 
                color: '#00e272'

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