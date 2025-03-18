import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsExport from "highcharts/modules/exporting";

export const CTFGraph = ({graphData}) => {
    if (!graphData || graphData.length === 0) {
        return <p> No data available</p>
    }

    // recibir graphData prop
    const defocusuData = graphData.map(ctf => [new Date(ctf.datetime).getTime(), ctf.defocusu]);
    const defocusvData = graphData.map(ctf => [new Date(ctf.datetime).getTime(), ctf.defocusv]);

    const myOptions =  {
        chart: {
            zooming: {
                type: 'x'
            }
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
        yAxis: {
            title: {
                text: 'Defocus'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        plotOptions: {
            area: {
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                color: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, 'rgb(171, 216, 170)'],
                        [0.7, 'rgb(76, 175, 254)']
                    ]
                },
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            type: 'area',
            name: 'DefocusU',
            data: defocusuData,
        },
        {
            type:'area',
            name: 'DefocusV',
            data: defocusvData,
        },],
        exporting: {
            enabled: true,
            buttons: {
                contextButton: {
                    menuItems: [
                        "viewFullscreen",
                        "printChart", 
                        "separator", 
                        "downloadPNG", 
                        "downloadJPEG", 
                        "downloadSVG"
                    ],
                },
            }   ,
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500,
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    };

    return (
        <figure className="highcharts-figure">
            <div id="container">
            <HighchartsReact highcharts={Highcharts}
                options={myOptions}
                key={graphData.length} //force update when data changes
            />
            </div>
            <p className="highcharts-description">
                Basic line chart showing defocus of CTF. This chart includes the
                <code>series-label</code> module, which adds a label to each line for
                enhanced readability.
            </p>
        </figure>
    );
}

export default CTFGraph;