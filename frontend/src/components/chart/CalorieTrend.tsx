import { Line } from 'react-chartjs-2';
import { CHART_HEIGHT } from '../../constants/mealDefaults';
import { useChartTheme } from '../../hooks/useChartTheme';
import type { DailyBreakdown } from '../../types/chart';
import { commonChartOptions } from '../../utils/chartConfig';
import { formatShortDate } from '../../utils/dateUtils';

interface CalorieTrendProps {
  data: DailyBreakdown[];
}

export const CalorieTrend = ({ data }: CalorieTrendProps) => {
  const theme = useChartTheme();
  const chartData = {
    labels: data.map((item) => formatShortDate(item.date)),
    datasets: [
      {
        label: '热量',
        data: data.map((item) => Math.round(item.calories)),
        borderColor: theme.palette[3],
        backgroundColor: `${theme.palette[3]}33`,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div style={{ height: CHART_HEIGHT }}>
      <Line data={chartData} options={commonChartOptions<'line'>(theme)} />
    </div>
  );
};
