import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';

export function SleepCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const { data: monthlyData, isLoading } = trpc.sleep.getMonthly.useQuery(
    { year, month },
    { enabled: true }
  );

  const { data: summaryData } = trpc.sleep.getSummary.useQuery(
    { days: 7 },
    { enabled: true }
  );

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const today_str = today.toISOString().split('T')[0];

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

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  const calendarData = monthlyData?.calendarData || {};
  const targetHours = monthlyData?.targetHours || 8.0;

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const getColorClass = (percent: number) => {
    if (percent === 0) return 'bg-gray-100 text-gray-400';
    if (percent < 50) return 'bg-purple-100 text-purple-700';
    if (percent < 100) return 'bg-purple-300 text-purple-900';
    return 'bg-purple-500 text-white';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">睡眠追蹤</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
          >
            ← 上月
          </button>
          <span className="px-4 py-1 font-medium">
            {year}年 {month}月
          </span>
          <button
            onClick={handleNextMonth}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
          >
            下月 →
          </button>
        </div>
      </div>

      {/* Summary */}
      {summaryData && (
        <Card className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">7天平均</p>
              <p className="text-xl font-bold">{summaryData.avgHours.toFixed(1)}h</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">達成率</p>
              <p className="text-xl font-bold">{Math.round(summaryData.completionRate)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">連續天數</p>
              <p className="text-xl font-bold">{summaryData.streak}天</p>
            </div>
          </div>
        </Card>
      )}

      {/* Calendar Grid */}
      <Card className="p-4">
        <div className="grid grid-cols-7 gap-2">
          {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}

          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="aspect-square" />;
            }

            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const data = calendarData[dateStr];
            const isToday = dateStr === today_str;
            const percent = data?.percent || 0;

            return (
              <div
                key={dateStr}
                className={`aspect-square flex flex-col items-center justify-center rounded text-sm font-medium cursor-pointer transition ${getColorClass(percent)} ${
                  isToday ? 'ring-2 ring-offset-1 ring-purple-500' : ''
                }`}
              >
                <div>{day}</div>
                <div className="text-xs">{data?.hours.toFixed(1) || '0'}h</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded" />
          <span>無紀錄</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-100 rounded" />
          <span>&lt;50%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-300 rounded" />
          <span>50-99%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded" />
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
