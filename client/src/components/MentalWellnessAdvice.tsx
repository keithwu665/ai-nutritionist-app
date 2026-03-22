import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type MoodType = 'happy' | 'neutral' | 'sad' | 'angry' | 'tired';

interface MentalWellnessAdviceProps {
  mood?: MoodType | null;
}

interface MentalAdviceSection {
  title: string;
  content: string;
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

  // Parse the advice message into sections
  const parseSections = (message: string): MentalAdviceSection[] => {
    const sections: MentalAdviceSection[] = [];
    
    // Extract 【今日狀態】section
    const todayMatch = message.match(/【今日狀態】([\s\S]*?)(?=【|$)/);
    if (todayMatch) {
      sections.push({
        title: '【今日狀態】',
        content: todayMatch[1].trim()
      });
    }
    
    // Extract 【近期狀態】section
    const recentMatch = message.match(/【近期狀態】([\s\S]*?)(?=【|$)/);
    if (recentMatch) {
      sections.push({
        title: '【近期狀態】',
        content: recentMatch[1].trim()
      });
    }
    
    // Extract 【可以做的事】section
    const actionMatch = message.match(/【可以做的事】([\s\S]*?)(?=【|$)/);
    if (actionMatch) {
      sections.push({
        title: '【可以做的事】',
        content: actionMatch[1].trim()
      });
    }
    
    // If no sections found, return the whole message as one section
    if (sections.length === 0) {
      sections.push({
        title: '心靈建議',
        content: message
      });
    }
    
    return sections;
  };

  // Show loading state with placeholder
  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🧠</span>
            <span>心靈建議</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-foreground/60 animate-pulse">
            正在生成建議...
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show placeholder if no advice
  if (!advice) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🧠</span>
            <span>心靈建議</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-foreground/60">
            記錄你的心情，我們會提供個性化的建議。
          </div>
        </CardContent>
      </Card>
    );
  }

  const sections = parseSections(advice.message);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🧠</span>
          <span>心靈建議</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h4 className="font-semibold text-foreground text-sm">
              {section.title}
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
              {section.content}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
