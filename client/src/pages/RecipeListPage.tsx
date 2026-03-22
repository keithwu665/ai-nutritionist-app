import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Clock, Flame } from 'lucide-react';

// Mock recipe data by protein type
const recipesByProtein: Record<string, Array<{ id: string; name: string; kcal: number; time: string }>> = {
  chicken: [
    { id: 'c1', name: '香煎雞胸沙律', kcal: 420, time: '15分鐘' },
    { id: 'c2', name: '雞胸粟米飯', kcal: 580, time: '20分鐘' },
    { id: 'c3', name: '蒜香雞胸蔬菜碗', kcal: 450, time: '18分鐘' },
  ],
  pork: [
    { id: 'p1', name: '豬肉蔬菜炒飯', kcal: 520, time: '20分鐘' },
    { id: 'p2', name: '香煎豬扒配沙律', kcal: 480, time: '16分鐘' },
    { id: 'p3', name: '豬肉味噌湯', kcal: 350, time: '15分鐘' },
  ],
  beef: [
    { id: 'b1', name: '牛肉番茄飯', kcal: 620, time: '25分鐘' },
    { id: 'b2', name: '香煎牛排配蔬菜', kcal: 550, time: '20分鐘' },
    { id: 'b3', name: '牛肉蘑菇湯', kcal: 380, time: '18分鐘' },
  ],
  seafood: [
    { id: 's1', name: '蒜香蝦沙律', kcal: 320, time: '12分鐘' },
    { id: 's2', name: '清蒸魚配米飯', kcal: 450, time: '20分鐘' },
    { id: 's3', name: '海鮮湯麵', kcal: 480, time: '18分鐘' },
  ],
  eggs: [
    { id: 'e1', name: '蛋白沙律', kcal: 280, time: '10分鐘' },
    { id: 'e2', name: '番茄蛋飯', kcal: 420, time: '15分鐘' },
    { id: 'e3', name: '蛋花湯配麵包', kcal: 350, time: '12分鐘' },
  ],
  vegetarian: [
    { id: 'v1', name: '豆腐沙律', kcal: 280, time: '10分鐘' },
    { id: 'v2', name: '蔬菜炒飯', kcal: 380, time: '15分鐘' },
    { id: 'v3', name: '蔬菜湯麵', kcal: 320, time: '12分鐘' },
  ],
};

export function RecipeListPage() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const protein = searchParams.get('protein') || 'chicken';
  const category = searchParams.get('category') || 'breakfast';

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
