import React, { useEffect, useState } from 'react';
import getCTFData from '../api/ctfApi';
import HighChartsReact from 'highcharts-react-official'

const CTFGraph = () => {
    return (
        <figure class="highcharts-figure">
            <div id="container"></div>
            <p class="highcharts-description">
                Basic line chart showing trends in a dataset. This chart includes the
                <code>series-label</code> module, which adds a label to each line for
                enhanced readability.
            </p>
        </figure>
    );
}

export default CTFGraph;