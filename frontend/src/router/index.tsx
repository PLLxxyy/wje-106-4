import { Route, Routes } from 'react-router-dom';
import { Calendar } from '../pages/Calendar';
import { Dashboard } from '../pages/Dashboard';
import { DiaryCreate } from '../pages/DiaryCreate';
import { DiaryDetail } from '../pages/DiaryDetail';
import { FoodLibrary } from '../pages/FoodLibrary';
import { Goals } from '../pages/Goals';
import { Settings } from '../pages/Settings';
import { Statistics } from '../pages/Statistics';
import { ROUTES } from '../constants/routes';

export const AppRoutes = () => (
  <Routes>
    <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
    <Route path={ROUTES.DIARY_CREATE} element={<DiaryCreate />} />
    <Route path={ROUTES.DIARY_DETAIL} element={<DiaryDetail />} />
    <Route path={ROUTES.CALENDAR} element={<Calendar />} />
    <Route path={ROUTES.FOOD_LIBRARY} element={<FoodLibrary />} />
    <Route path={ROUTES.STATISTICS} element={<Statistics />} />
    <Route path={ROUTES.GOALS} element={<Goals />} />
    <Route path={ROUTES.SETTINGS} element={<Settings />} />
  </Routes>
);
