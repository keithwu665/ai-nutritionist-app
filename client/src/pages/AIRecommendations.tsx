import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, Utensils, Dumbbell, Heart, Sparkles } from 'lucide-react';

export default function AIRecommendations() {
  const [, setLocation] = useLocation();
  const [todayMood, setTodayMood] = useState<string | null>(null);

  // Load mood from localStorage on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const moods = JSON.parse(localStorage.getItem('userMoods') || '{}');
    setTodayMood(moods[today] || null);
  }, []);

  const { data: recommendations, isLoading } = trpc.recommendations.get.useQuery({ 
    mood: todayMood || undefined 
  });

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter out diet and exercise items from encouragement to avoid duplication
  const filteredEncouragement = (recommendations?.encouragement || []).filter((item: any) => {
    const content = (item.content || '').toLowerCase();
    const title = (item.title || '').toLowerCase();
    // Exclude items that are clearly diet or exercise related
    const isDiet = content.includes('飲食') || content.includes('食物') || content.includes('卡路里') || content.includes('營養') || title.includes('飲食');
    const isExercise = content.includes('運動') || content.includes('健身') || content.includes('鍛鍊') || content.includes('訓練') || title.includes('運動');
    return !isDiet && !isExercise;
  });

  const categories = [
    {
      id: 'diet',
      title: '飲食建議',
      icon: Utensils,
      color: 'bg-blue-50 border-blue-100',
      items: recommendations?.diet || [],
    },
    {
      id: 'exercise',
      title: '運動建議',
      icon: Dumbbell,
      color: 'bg-green-50 border-green-100',
      items: recommendations?.exercise || [],
    },
    {
      id: 'body',
      title: '身體建議',
      icon: Heart,
      color: 'bg-pink-50 border-pink-100',
      items: [], // Placeholder for future body recommendations
    },
    {
      id: 'overall',
      title: '全面建議',
      icon: Sparkles,
      color: 'bg-purple-50 border-purple-100',
      items: filteredEncouragement,
    },
  ];

  return (
    <div className="pb-32 md:pb-8">
      {/* Header */}
      <div className="p-4 md:p-8 border-b border-gray-200">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <button
            onClick={() => setLocation('/dashboard')}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">AI 建議</h1>
            <p className="text-xs text-muted-foreground mt-1">
              {todayMood ? `根據你的心情 (${todayMood}) 提供個性化建議` : '根據你的數據提供個性化建議'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-8 space-y-4 max-w-7xl mx-auto">
        {categories.map((category) => {
          const Icon = category.icon;
          const hasItems = category.items.length > 0;

          return (
            <Card key={category.id} className={`rounded-2xl border ${category.color}`}>
              <CardContent className="pt-4 pb-4">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">{category.title}</h2>
                </div>

                {/* Category Items */}
                {hasItems ? (
                  <div className="space-y-3">
                    {category.items.map((item: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <h3 className="font-semibold text-sm">{item.title}</h3>
                          {item.dataBasis && (
                            <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                              {item.dataBasis}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-foreground mb-2">{item.content}</p>
                        {item.action && (
                          <div className="text-xs text-primary font-medium">
                            💡 {item.action}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground">
                      {category.id === 'body' ? '身體數據建議將在未來推出' : '暫無建議'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Action Button */}
        <div className="flex gap-3 justify-center pt-4">
          <Button
            onClick={() => setLocation('/dashboard')}
            variant="outline"
            className="rounded-full"
          >
            返回儀錶板
          </Button>
        </div>
      </div>
    </div>
  );
}
