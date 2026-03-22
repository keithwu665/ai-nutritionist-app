import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getMoodEmoji, getDaysInMonth, getFirstDayOfMonth, getTodayDateString, formatDateForAPI } from '@/lib/moodUtils';
import { trpc } from '@/lib/trpc';

interface MoodRecord {
  id: number;
  userId: number;
  date: string;
  mood: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MoodCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [moodMap, setMoodMap] = useState<Record<string, string>>({});
  const todayStr = getTodayDateString();

  // Fetch mood records for the month
  const { data: monthRecords } = trpc.mood.getMonthRecords.useQuery(
    { year, month },
    { enabled: true }
  );

  // Update mood map when records are fetched
  useEffect(() => {
    if (monthRecords) {
      const map: Record<string, string> = {};
      monthRecords.forEach((record: MoodRecord) => {
        map[record.date] = record.mood;
      });
      setMoodMap(map);
    }
  }, [monthRecords]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = [];

  // Add empty cells for days before the month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = new Date(year, month - 1).toLocaleString('zh-HK', { month: 'long' });
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const goToPreviousMonth = () => {
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <Card className="rounded-2xl">
      <CardContent className="pt-4 pb-4">
        <div className="mb-4">
          <p className="text-sm font-semibold mb-3">心情紀錄 📅</p>
          
          {/* Month/Year Navigation */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={goToPreviousMonth}
              className="text-xs text-primary hover:underline"
            >
              ← 上月
            </button>
            <p className="text-xs font-medium">
              {year}年 {month}月
            </p>
            <button
              onClick={goToNextMonth}
              className="text-xs text-primary hover:underline"
            >
              下月 →
            </button>
          </div>

          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const mood = moodMap[dateStr];
              const isToday = dateStr === todayStr;
              const emoji = mood ? getMoodEmoji(mood) : '';

              return (
                <div
                  key={day}
                  className={`
                    aspect-square flex items-center justify-center rounded-lg text-lg
                    ${isToday ? 'border-2 border-primary' : 'border border-gray-200'}
                    ${mood ? 'bg-gray-50' : 'bg-white'}
                    hover:bg-gray-100 transition-colors cursor-pointer
                  `}
                  title={mood ? `${dateStr}: ${mood}` : dateStr}
                >
                  {emoji}
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-muted-foreground mb-2">本週心情：</p>
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => {
              const d = new Date(today);
              d.setDate(d.getDate() - d.getDay() + i);
              const dateStr = formatDateForAPI(d);
              const mood = moodMap[dateStr];
              return (
                <div
                  key={i}
                  className="text-lg"
                  title={dateStr}
                >
                  {mood ? getMoodEmoji(mood) : '—'}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
