import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MoodEntry {
  date: string;
  mood: string;
}

export default function MoodLog() {
  const [, setLocation] = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moodHistory, setMoodHistory] = useState<Record<string, string>>({});
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Load mood history from localStorage
  useEffect(() => {
    const moods = JSON.parse(localStorage.getItem('userMoods') || '{}');
    setMoodHistory(moods);
  }, []);

  const getMoodEmoji = (mood: string) => {
    const moodMap: Record<string, string> = {
      happy: '😊',
      neutral: '😐',
      sad: '😞',
      angry: '😡',
      tired: '😴',
    };
    return moodMap[mood] || '😐';
  };

  const getMoodLabel = (mood: string) => {
    const moodMap: Record<string, string> = {
      happy: '開心',
      neutral: '普通',
      sad: '低落',
      angry: '煩躁',
      tired: '疲倦',
    };
    return moodMap[mood] || '未選擇';
  };

  // Get last 7 days mood history
  const getLast7DaysMoods = () => {
    const moods = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      moods.push({ date: dateStr, mood: moodHistory[dateStr] || null });
    }
    return moods;
  };

  // Analyze mood trends
  const analyzeMoodTrends = () => {
    const last7 = getLast7DaysMoods();
    const moodCounts = { sad: 0, angry: 0, tired: 0, neutral: 0, happy: 0 };
    
    last7.forEach(({ mood }) => {
      if (mood && moodCounts.hasOwnProperty(mood)) {
        moodCounts[mood as keyof typeof moodCounts]++;
      }
    });

    return moodCounts;
  };

  // Generate mental wellness advice
  const generateMentalAdvice = () => {
    const today = selectedDate;
    const todayMood = moodHistory[today];
    const last7 = getLast7DaysMoods();
    const moodCounts = analyzeMoodTrends();

    let todayStatus = '';
    let recentStatus = '';
    let actionSuggestions = '';

    // 【今日狀態】- Based on today's mood
    if (!todayMood) {
      todayStatus = '還未選擇今日心情，選擇心情以獲得個人化建議。';
    } else if (todayMood === 'happy') {
      todayStatus = '今日心情不錯，保持這份積極的心態。';
    } else if (todayMood === 'neutral') {
      todayStatus = '今日心情平穩，保持日常節奏。';
    } else if (todayMood === 'sad') {
      todayStatus = '今日心情較低落，給自己一些溫柔和耐心。';
    } else if (todayMood === 'angry') {
      todayStatus = '今日心情有些煩躁，試試放慢腳步。';
    } else if (todayMood === 'tired') {
      todayStatus = '今日感到疲倦，適當休息很重要。';
    }

    // 【近期狀態】- Based on last 7 days
    if (moodCounts.sad >= 3 || moodCounts.angry >= 3) {
      recentStatus = '近期情緒偏低，建議多關注自己的身心狀態。';
    } else if (moodCounts.tired >= 3) {
      recentStatus = '近期疲勞累積，需要充分休息和調整。';
    } else if (moodCounts.happy >= 3) {
      recentStatus = '近期心情不錯，繼續保持良好的生活習慣。';
    } else {
      recentStatus = '近期心情波動，這是正常的情緒變化。';
    }

    // 【可以做的事】- Action suggestions
    if (todayMood === 'sad' || todayMood === 'angry') {
      actionSuggestions = '試試散步或進行輕鬆的運動，可以幫助改善心情。';
    } else if (todayMood === 'tired') {
      actionSuggestions = '確保充足睡眠，適當休息能恢復精力。';
    } else if (todayMood === 'happy') {
      actionSuggestions = '分享你的快樂，與朋友交流能增進關係。';
    } else {
      actionSuggestions = '保持規律作息，均衡飲食有助於穩定情緒。';
    }

    return { todayStatus, recentStatus, actionSuggestions };
  };

  const advice = generateMentalAdvice();

  // Calendar rendering
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = currentDate.toLocaleString('zh-TW', { month: 'long', year: 'numeric' });
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="pb-32 md:pb-8">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/dashboard')}
            className="p-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">心情紀錄</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-8 space-y-4 max-w-2xl mx-auto">
        
        {/* Calendar Card */}
        <Card className="rounded-2xl">
          <CardContent className="pt-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevMonth}
                className="p-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-semibold">{monthName}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextMonth}
                className="p-0"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dateStr = date.toISOString().split('T')[0];
                const mood = moodHistory[dateStr];
                const isSelected = dateStr === selectedDate;
                const isToday = dateStr === new Date().toISOString().split('T')[0];

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-white border-2 border-primary'
                        : isToday
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xs">{day}</span>
                    {mood && <span className="text-lg">{getMoodEmoji(mood)}</span>}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Mental Wellness Advice */}
        <Card className="rounded-2xl bg-purple-50 border-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="text-3xl">🧠</div>
              <h2 className="text-lg font-semibold text-foreground">心靈建議</h2>
            </div>

            <div className="space-y-4 text-sm text-foreground">
              {/* Today's Status */}
              <div>
                <p className="font-semibold text-foreground mb-1">【今日狀態】</p>
                <p className="text-sm text-gray-700">{advice.todayStatus}</p>
              </div>

              {/* Recent Status */}
              <div>
                <p className="font-semibold text-foreground mb-1">【近期狀態】</p>
                <p className="text-sm text-gray-700">{advice.recentStatus}</p>
              </div>

              {/* Action Suggestions */}
              <div>
                <p className="font-semibold text-foreground mb-1">【可以做的事】</p>
                <p className="text-sm text-gray-700">{advice.actionSuggestions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mood History Stats */}
        <Card className="rounded-2xl">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-foreground">近 7 天心情統計</h3>
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'happy', emoji: '😊', label: '開心', count: analyzeMoodTrends().happy },
                { id: 'neutral', emoji: '😐', label: '普通', count: analyzeMoodTrends().neutral },
                { id: 'sad', emoji: '😞', label: '低落', count: analyzeMoodTrends().sad },
                { id: 'angry', emoji: '😡', label: '煩躁', count: analyzeMoodTrends().angry },
                { id: 'tired', emoji: '😴', label: '疲倦', count: analyzeMoodTrends().tired },
              ].map((mood) => (
                <div key={mood.id} className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-2xl mb-1">{mood.emoji}</span>
                  <span className="text-xs font-semibold text-foreground">{mood.count}</span>
                  <span className="text-xs text-muted-foreground">{mood.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
