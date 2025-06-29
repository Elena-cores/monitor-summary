// src/hocs/withChartTheme.jsx
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import ExportData from 'highcharts/modules/export-data';
import { useEffect, useState } from 'react';

/**
 * Generates a Highcharts-compatible theme configuration based on the current color mode.
 *
 * @param {boolean} isDark - Indicates whether dark mode is active.
 * @param {object} customOptions - Optional additional chart configuration to merge with the theme.
 */
const getThemeOptions = (isDark, customOptions = {}) => {
  const baseOptions = {
    chart: {
      backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
      style: {
        fontFamily: 'inherit'
      }
    },
    title: {
      style: { color: isDark ? '#ffffff' : '#333333' }
    },
    subtitle: {
      style: { color: isDark ? '#cccccc' : '#666666' }
    },
    xAxis: {
      labels: { style: { color: isDark ? '#ffffff' : '#333333' } },
      lineColor: isDark ? '#ffffff' : '#cccccc',
      tickColor: isDark ? '#ffffff' : '#cccccc'
    },
    yAxis: {
      labels: { style: { color: isDark ? '#ffffff' : '#333333' } },
      gridLineColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
    },
    legend: {
      itemStyle: { color: isDark ? '#ffffff' : '#333333' }
    }
  };

  return Highcharts.merge(baseOptions, customOptions);
};

/**
 * Higher-Order Component (HOC) that injects theming support into wrapped Highcharts components.
 *
 * It observes changes to the <body> element's class list to detect dark/light mode and passes
 * `isDark` and `getThemeOptions` as props to the wrapped chart component.
 */
export const withChartTheme = (WrappedChart) => {
  return function ThemedChart(props) {
    const [isDark, setIsDark] = useState(document.body.classList.contains('dark'));

    useEffect(() => {
      const observer = new MutationObserver(() => {
        setIsDark(document.body.classList.contains('dark'));
      });
      observer.observe(document.body, { attributes: true });
      return () => observer.disconnect();
    }, []);

    return <WrappedChart {...props} isDark={isDark} getThemeOptions={getThemeOptions} />;
  };
};