import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';

export function useHydrationCalendarViewModel() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const { data: monthlyData, isLoading } = trpc.hydration.getMonthly.useQuery(
    { year, month },
    { enabled: true }
  );

  const { data: summaryData } = trpc.hydration.getSummary.useQuery(
    { days: 7 },
    { enabled: true }
  );

  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
    const days = [];
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  }, [year, month]);

  const handlePrevMonth = () => {
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  const getColorClass = (percent: number) => {
    if (percent === 0) return 'bg-gray-100 text-gray-400';
    if (percent < 50) return 'bg-blue-100 text-blue-700';
    if (percent < 100) return 'bg-blue-300 text-blue-900';
    return 'bg-blue-500 text-white';
  };

  const today_str = today.toISOString().split('T')[0];
  const calendarData = monthlyData?.calendarData || {};
  const targetMl = monthlyData?.targetMl || 2000;

  return {
    year,
    month,
    calendarDays,
    monthlyData,
    summaryData,
    isLoading,
    handlePrevMonth,
    handleNextMonth,
    getColorClass,
    today_str,
    calendarData,
    targetMl,
  };
}
