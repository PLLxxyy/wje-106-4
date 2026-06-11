import {
  DAYS_IN_WEEK,
  DEFAULT_RANGE_DAYS,
  MONTH_RANGE_DAYS,
  WEEK_START_OFFSET,
} from '../constants/mealDefaults';

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  month: 'long',
  day: 'numeric',
});

export const toISODate = (date: Date) => date.toISOString().slice(0, 10);

export const todayISO = () => toISODate(new Date());

export const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const getDateRange = (start: string, end: string) => {
  const dates: string[] = [];
  let current = new Date(start);
  const last = new Date(end);
  while (current <= last) {
    dates.push(toISODate(current));
    current = addDays(current, 1);
  }
  return dates;
};

export const getWeekRange = () => {
  const now = new Date();
  const day = now.getDay() || DAYS_IN_WEEK;
  const start = addDays(now, WEEK_START_OFFSET - day);
  const end = addDays(start, DAYS_IN_WEEK - 1);
  return { start: toISODate(start), end: toISODate(end) };
};

export const getMonthRange = () => {
  const now = new Date();
  const start = addDays(now, -MONTH_RANGE_DAYS + 1);
  return { start: toISODate(start), end: toISODate(now) };
};

export const getRecentRange = () => {
  const now = new Date();
  return {
    start: toISODate(addDays(now, -DEFAULT_RANGE_DAYS + 1)),
    end: toISODate(now),
  };
};

export const formatShortDate = (date: string) => dateFormatter.format(new Date(date));

export const getMonthMatrixStart = (monthDate: Date) => {
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const day = first.getDay() || DAYS_IN_WEEK;
  return addDays(first, WEEK_START_OFFSET - day);
};

export const formatMonthTitle = (date: Date) =>
  `${date.getFullYear()}年${date.getMonth() + 1}月`;

export const isSameMonth = (date: string, monthDate: Date) => {
  const target = new Date(date);
  return (
    target.getFullYear() === monthDate.getFullYear() &&
    target.getMonth() === monthDate.getMonth()
  );
};
