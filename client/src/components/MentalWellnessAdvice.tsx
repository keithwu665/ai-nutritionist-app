import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent } from '@/components/ui/card';

export type MoodType = 'happy' | 'neutral' | 'sad' | 'angry' | 'tired';

interface MentalWellnessAdviceProps {
  mood?: MoodType | null;
}

export default function MentalWellnessAdvice({ mood }: MentalWellnessAdviceProps) {
  const [displayMood, setDisplayMood] = useState<MoodType>('neutral');

  useEffect(() => {
    if (mood) {
      setDisplayMood(mood);
    }
  }, [mood]);

  const { data: advice, isLoading } = trpc.mood.getMentalAdvice.useQuery(
    { mood: displayMood },
    { enabled: !!displayMood }
  );

  if (isLoading || !advice) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{advice.emoji}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">{advice.title}</h3>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
              {advice.message}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
