import { useMemo } from 'react';
import { useThemeStore } from '../stores/useThemeStore';
import { chartThemeByMode } from '../utils/chartConfig';

export const useChartTheme = () => {
  const theme = useThemeStore((state) => state.theme);
  return useMemo(() => chartThemeByMode(theme), [theme]);
};
