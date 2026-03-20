import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';

export default function DietInspirationCards() {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">飲食靈感</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Home Cooking Card */}
        <Link href="/diet/inspiration/home-cooking">
          <Card className="cursor-pointer hover:shadow-md transition-all hover:border-emerald-300 h-full border border-gray-200 rounded-xl">
            <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
              <div className="text-4xl">🏠</div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">在家料理</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  簡單健康食譜
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Eating Out Card */}
        <Link href="/diet/inspiration/eating-out">
          <Card className="cursor-pointer hover:shadow-md transition-all hover:border-emerald-300 h-full border border-gray-200 rounded-xl">
            <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
              <div className="text-4xl">🍽</div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">外食選擇</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  健康用餐建議
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
