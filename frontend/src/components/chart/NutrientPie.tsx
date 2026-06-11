import type { Plugin } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { CHART_HEIGHT, EMPTY_TOTAL } from '../../constants/mealDefaults';
import { useChartTheme } from '../../hooks/useChartTheme';

interface NutrientPieProps {
  protein: number;
  fat: number;
  carb: number;
}

const createPercentPlugin = (color: string): Plugin<'pie'> => ({
  id: 'percentLabel',
  afterDatasetsDraw: (chart) => {
    const dataset = chart.data.datasets[0];
    const values = (dataset.data as Array<number | null>).map((value) => Number(value ?? 0));
    const total = values.reduce((sum, value) => sum + value, EMPTY_TOTAL);
    chart.getDatasetMeta(0).data.forEach((arc, index) => {
      if (!total || !values[index]) {
        return;
      }
      const position = arc.tooltipPosition(true);
      const percent = Math.round((values[index] / total) * 100);
      chart.ctx.save();
      chart.ctx.fillStyle = color;
      chart.ctx.font = '600 12px serif';
      chart.ctx.textAlign = 'center';
      chart.ctx.fillText(`${percent}%`, Number(position.x ?? 0), Number(position.y ?? 0));
      chart.ctx.restore();
    });
  },
});

export const NutrientPie = ({ protein, fat, carb }: NutrientPieProps) => {
  const theme = useChartTheme();
  const chartData = {
    labels: ['蛋白质', '脂肪', '碳水'],
    datasets: [
      {
        data: [Math.round(protein), Math.round(fat), Math.round(carb)],
        backgroundColor: theme.palette.slice(0, 3),
        borderColor: theme.panelColor,
      },
    ],
  };

  return (
    <div style={{ height: CHART_HEIGHT }}>
      <Pie
        data={chartData}
        options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: theme.textColor } } } }}
        plugins={[createPercentPlugin(theme.textColor)]}
      />
    </div>
  );
};
