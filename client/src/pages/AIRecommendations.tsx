import { useState, useEffect } from 'react';
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
      items: recommendations?.body || [],
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
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">AI 建議</h1>
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.id}>
              <div className="flex items-center gap-2 mb-4">
                <category.icon className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">{category.title}</h2>
              </div>

              {category.items.length === 0 ? (
                <Card className={`${category.color} border`}>
                  <CardContent className="p-4 text-center text-muted-foreground">
                    暫無建議
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {category.items.map((item: any, idx: number) => (
                    <Card key={idx} className={`${category.color} border`}>
                      <CardContent className="p-4">
                        <div className="mb-2">
                          <p className="font-medium mt-1">{item.title}</p>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">{item.message}</p>
                        {item.dataBasis && (
                          <p className="text-xs text-muted-foreground mb-2">📊 {item.dataBasis}</p>
                        )}
                        {item.action && (
                          <p className="text-xs text-primary font-medium">✓ {item.action}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
