import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function HomeCookingSuggestions() {
  const meals = [
    {
      id: 1,
      name: '雞胸肉配糙米飯',
      description: '高蛋白、低脂肪的經典組合',
      ingredients: ['雞胸肉 150g', '糙米飯 1碗', '青菜 1份'],
      nutrition: '約 450 kcal，蛋白質 45g',
    },
    {
      id: 2,
      name: '三文魚配甜薯',
      description: '豐富的 Omega-3 和纖維',
      ingredients: ['三文魚 120g', '烤甜薯 150g', '沙律菜 1份'],
      nutrition: '約 480 kcal，蛋白質 35g',
    },
    {
      id: 3,
      name: '瘦牛肉配蔬菜湯',
      description: '鐵質豐富，營養均衡',
      ingredients: ['瘦牛肉 120g', '蔬菜湯 1碗', '白飯 0.5碗'],
      nutrition: '約 420 kcal，蛋白質 40g',
    },
  ];

  return (
    <div className="pb-32 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 bg-background z-10 p-4 md:p-8 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <Link href="/diet">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">在家料理建議</h1>
          <p className="text-muted-foreground mt-2">簡單健康的家常菜食譜</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            💡 <strong>小貼士：</strong> 在家料理能更好地控制份量和營養成分。建議選擇瘦肉、全穀類和新鮮蔬菜，以達到最佳營養平衡。
          </p>
        </div>

        <div className="space-y-4">
          {meals.map((meal) => (
            <Card key={meal.id}>
              <CardHeader>
                <CardTitle className="text-lg">{meal.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{meal.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">材料：</h4>
                  <ul className="space-y-1">
                    {meal.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <p className="text-sm font-semibold text-green-900">
                    {meal.nutrition}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-base">烹飪建議</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✓ 使用健康的烹飪方法：蒸、烤、煮，避免油炸</p>
            <p>✓ 選擇橄欖油或菜籽油作為烹飪油</p>
            <p>✓ 增加蔬菜份量以提高纖維攝取</p>
            <p>✓ 控制鹽分和調味料的使用</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
