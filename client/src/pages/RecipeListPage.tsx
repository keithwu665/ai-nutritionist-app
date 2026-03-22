import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Clock, Flame } from 'lucide-react';

// Mock recipe data by protein type
const recipesByProtein: Record<string, Array<{ id: string; name: string; kcal: number; time: string }>> = {
  chicken: [
    { id: 'c1', name: '香煎雞胸蛋白早餐碗', kcal: 320, time: '15分鐘' },
    { id: 'c2', name: '雞胸牛油果全麥吐司', kcal: 380, time: '12分鐘' },
    { id: 'c3', name: '雞肉菠菜蛋白捲', kcal: 310, time: '18分鐘' },
    { id: 'c4', name: '雞胸番茄沙律碗', kcal: 340, time: '14分鐘' },
    { id: 'c5', name: '雞肉藜麥早餐碗', kcal: 360, time: '20分鐘' },
    { id: 'c6', name: '雞胸蘑菇炒蛋', kcal: 330, time: '16分鐘' },
    { id: 'c7', name: '雞肉低脂芝士三文治', kcal: 350, time: '13分鐘' },
    { id: 'c8', name: '雞胸蔬菜卷餅', kcal: 320, time: '12分鐘' },
    { id: 'c9', name: '雞肉燕麥鹹粥', kcal: 340, time: '22分鐘' },
    { id: 'c10', name: '雞胸青瓜乳酪碗', kcal: 300, time: '10分鐘' },
  ],
  pork: [
    { id: 'p1', name: '香煎豬扒配沙律', kcal: 480, time: '16分鐘' },
    { id: 'p2', name: '豬肉蔬菜炒飯', kcal: 520, time: '20分鐘' },
    { id: 'p3', name: '豬肉味噌湯', kcal: 350, time: '15分鐘' },
  ],
  beef: [
    { id: 'b1', name: '牛肉炒西蘭花', kcal: 480, time: '18分鐘' },
    { id: 'b2', name: '黑椒牛肉飯', kcal: 620, time: '22分鐘' },
    { id: 'b3', name: '牛肉蔬菜碗', kcal: 520, time: '20分鐘' },
  ],
  seafood: [
    { id: 's1', name: '三文魚沙律', kcal: 380, time: '12分鐘' },
    { id: 's2', name: '蒜蓉蝦意粉', kcal: 520, time: '20分鐘' },
    { id: 's3', name: '海鮮湯', kcal: 420, time: '18分鐘' },
  ],
  eggs: [
    { id: 'e1', name: '菠菜炒蛋', kcal: 320, time: '10分鐘' },
    { id: 'e2', name: '蛋白早餐碗', kcal: 380, time: '12分鐘' },
    { id: 'e3', name: '番茄滑蛋', kcal: 350, time: '12分鐘' },
  ],
  vegetarian: [
    { id: 'v1', name: '雜菜豆腐碗', kcal: 320, time: '15分鐘' },
    { id: 'v2', name: '牛油果沙律', kcal: 380, time: '10分鐘' },
    { id: 'v3', name: '南瓜濃湯', kcal: 280, time: '20分鐘' },
  ],
};

export function RecipeListPage() {
  const [, setLocation] = useLocation();
  const params = useParams<{ category: string; protein: string }>();
  
  const category = params.category || 'breakfast';
  const protein = params.protein || 'chicken';

  // Get recipes for the selected protein type
  const recipes = recipesByProtein[protein] || recipesByProtein.chicken;

  const handleRecipeSelect = (recipeId: string) => {
    // Navigate to recipe detail page with recipe ID
    setLocation(`/diet/inspiration/home-cooking/${category}/${protein}/${recipeId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">食譜頁</h1>
        </div>
        <p className="text-sm text-muted-foreground">選擇你想查看的菜式</p>
      </div>

      {/* Recipe List */}
      <div className="px-4 py-6 space-y-3">
        {recipes.map((recipe) => (
          <Card
            key={recipe.id}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleRecipeSelect(recipe.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-base mb-2">{recipe.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>{recipe.kcal} kcal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{recipe.time}</span>
                  </div>
                </div>
              </div>
              <div className="text-muted-foreground">
                <ChevronLeft className="w-5 h-5 rotate-180" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
