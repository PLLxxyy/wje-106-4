import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DayDetail } from '../components/calendar/DayDetail';
import { MonthCalendar } from '../components/calendar/MonthCalendar';
import { getDiaryDetailPath } from '../constants/routes';
import { useDiaryStore } from '../stores/useDiaryStore';
import { formatMonthTitle, todayISO } from '../utils/dateUtils';

export const Calendar = () => {
  const navigate = useNavigate();
  const entries = useDiaryStore((state) => state.entries);
  const [monthDate, setMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const selectedEntries = entries.filter((entry) => entry.date === selectedDate);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-stone-500 dark:text-stone-400">日历回顾</p>
        <h1 className="text-3xl font-semibold text-stone-950 dark:text-stone-100">
          {formatMonthTitle(monthDate)}饮食轨迹
        </h1>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <MonthCalendar
          monthDate={monthDate}
          selectedDate={selectedDate}
          entries={entries}
          onSelectDate={setSelectedDate}
          onMonthChange={setMonthDate}
        />
        <DayDetail
          date={selectedDate}
          entries={selectedEntries}
          onOpenEntry={(id) => navigate(getDiaryDetailPath(id))}
        />
      </div>
    </div>
  );
};
