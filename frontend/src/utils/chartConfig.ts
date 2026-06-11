import type { ChartOptions } from 'chart.js';

export interface ChartTheme {
  textColor: string;
  gridColor: string;
  panelColor: string;
  palette: string[];
}

export const chartThemeByMode = (theme: 'light' | 'dark'): ChartTheme =>
  theme === 'dark'
    ? {
        textColor: '#e8dfd1',
        gridColor: 'rgba(232, 223, 209, 0.16)',
        panelColor: '#1f1a17',
        palette: ['#7bd7b4', '#f4c167', '#d98baa', '#ff876f'],
      }
    : {
        textColor: '#3b3028',
        gridColor: 'rgba(74, 61, 51, 0.14)',
        panelColor: '#fffaf0',
        palette: ['#2f6f5e', '#d89c3f', '#7e526b', '#c94f39'],
      };

export const commonChartOptions = <TType extends 'line' | 'bar'>(theme: ChartTheme): ChartOptions<TType> => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: theme.textColor, usePointStyle: true },
    },
  },
  scales: {
    x: {
      ticks: { color: theme.textColor },
      grid: { color: theme.gridColor },
    },
    y: {
      ticks: { color: theme.textColor },
      grid: { color: theme.gridColor },
    },
  },
} as unknown as ChartOptions<TType>);
