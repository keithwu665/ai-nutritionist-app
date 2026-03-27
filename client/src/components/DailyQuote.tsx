import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const DAILY_QUOTES = [
  "Fat won't disappear overnight, but you can start today",
  "Slow progress is still progress",
  "Calories remember everything",
  "You don't need to be perfect, just keep going",
  "Every healthy choice is a vote for the future you",
  "Progress over perfection",
  "Your body is not your enemy, it's your home",
  "Small steps lead to big changes",
  "Today's effort is tomorrow's achievement",
  "You're not on a diet, you're building a lifestyle",
  "Consistency beats intensity",
  "Be patient with yourself, you're doing great",
  "Your health is worth the effort",
  "One day at a time, one choice at a time",
  "You've got this, one meal at a time",
];

export function DailyQuote() {
  // Select a random quote that changes on each page load
  const quote = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * DAILY_QUOTES.length);
    return DAILY_QUOTES[randomIndex];
  }, []);

  return (
    <Card className="rounded-2xl bg-gradient-to-br from-amber-50 to-pink-50 border-amber-100">
      <CardContent className="p-6">
        <div className="text-center space-y-3">
          <p className="text-sm font-medium text-gray-800 leading-relaxed italic">
            "{quote}"
          </p>
          <p className="text-xs text-amber-600 font-semibold tracking-wide">
            DAILY INTENTION
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
