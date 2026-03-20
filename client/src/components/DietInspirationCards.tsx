import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { ChefHat, UtensilsCrossed } from 'lucide-react';

export default function DietInspirationCards() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">飲食靈感</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Home Cooking Card */}
        <Link href="/diet/inspiration/home-cooking">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-5xl">🏠</div>
                <h3 className="text-lg font-semibold text-foreground">在家料理</h3>
                <p className="text-sm text-muted-foreground">
                  簡單健康的家常菜食譜
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Eating Out Card */}
        <Link href="/diet/inspiration/eating-out">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-5xl">🍽</div>
                <h3 className="text-lg font-semibold text-foreground">外食選擇</h3>
                <p className="text-sm text-muted-foreground">
                  外出用餐的健康建議
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
