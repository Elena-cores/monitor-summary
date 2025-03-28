// src/components/CTFChart.jsx
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { withChartTheme } from '../hocs/withChartTheme';

const CTFGraph = ({ graphData, isDark, getThemeOptions }) => {
    if (!graphData || graphData.length === 0) {
        return <p>No data available</p>;
    }

    const defocusuData = graphData.map(ctf => [new Date(ctf.datetime_ctf).getTime(), ctf.defocusu]);
    const defocusvData = graphData.map(ctf => [new Date(ctf.datetime_ctf).getTime(), ctf.defocusv]);

    const myOptions = getThemeOptions(isDark, {
        chart: {
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
        xAxis: { type: 'datetime' },
        yAxis: { title: { text: 'Defocus' } },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        plotOptions: {
            area: {
                marker: { radius: 2 },
                lineWidth: 1,
                color: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, 'rgb(171, 216, 170)'],
                        [0.7, 'rgb(76, 175, 254)']
                    ]
                },
                states: { hover: { lineWidth: 1 } },
                threshold: null
            }
        },
        series: [
            { name: 'DefocusU', data: defocusuData },
            { name: 'DefocusV', data: defocusvData }
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
            <p className="highcharts-description">
                Basic line chart showing defocus of CTF.
            </p>
        </figure>
    );
};

export default withChartTheme(CTFGraph);