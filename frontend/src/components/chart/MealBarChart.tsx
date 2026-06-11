import type { Plugin } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { MEAL_TYPE_LABEL, MEAL_TYPES, type MealType } from '../../constants/enums';
import { CHART_HEIGHT } from '../../constants/mealDefaults';
import { useChartTheme } from '../../hooks/useChartTheme';
import { commonChartOptions } from '../../utils/chartConfig';

interface MealBarChartProps {
  data: Record<MealType, number>;
}

const createValuePlugin = (color: string): Plugin<'bar'> => ({
  id: 'barValueLabel',
  afterDatasetsDraw: (chart) => {
    const values = chart.data.datasets[0].data as number[];
    chart.getDatasetMeta(0).data.forEach((bar, index) => {
      chart.ctx.save();
      chart.ctx.fillStyle = color;
      chart.ctx.font = '600 12px serif';
      chart.ctx.textAlign = 'center';
      chart.ctx.fillText(`${Math.round(values[index])}`, bar.x, bar.y - 8);
      chart.ctx.restore();
    });
  },
});

export const MealBarChart = ({ data }: MealBarChartProps) => {
  const theme = useChartTheme();
  const chartData = {
    labels: MEAL_TYPES.map((meal) => MEAL_TYPE_LABEL[meal]),
    datasets: [
      {
        label: '千卡',
        data: MEAL_TYPES.map((meal) => Math.round(data[meal])),
        backgroundColor: theme.palette,
        borderRadius: 8,
      },
    ],
  };

  return (
    <div style={{ height: CHART_HEIGHT }}>
      <Bar data={chartData} options={commonChartOptions<'bar'>(theme)} plugins={[createValuePlugin(theme.textColor)]} />
    </div>
  );
};
