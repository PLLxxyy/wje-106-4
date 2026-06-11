export const ROUTES = {
  DASHBOARD: '/',
  DIARY_CREATE: '/diary/new',
  DIARY_DETAIL: '/diary/:id',
  CALENDAR: '/calendar',
  FOOD_LIBRARY: '/foods',
  STATISTICS: '/statistics',
  GOALS: '/goals',
  SETTINGS: '/settings',
};

export const NAV_ITEMS = [
  { path: ROUTES.DASHBOARD, label: '首页' },
  { path: ROUTES.DIARY_CREATE, label: '记录' },
  { path: ROUTES.CALENDAR, label: '日历' },
  { path: ROUTES.FOOD_LIBRARY, label: '食物库' },
  { path: ROUTES.STATISTICS, label: '统计' },
  { path: ROUTES.GOALS, label: '目标' },
  { path: ROUTES.SETTINGS, label: '设置' },
];

export const getDiaryDetailPath = (id: string) => `/diary/${id}`;
export const getDiaryEditPath = (id: string) => `${ROUTES.DIARY_CREATE}?id=${id}`;
