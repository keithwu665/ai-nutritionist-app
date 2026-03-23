import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Clock, Flame } from 'lucide-react';
import { getRecipesByProteinAndCategory } from '@/lib/recipeData';

// Map URL protein parameter to recipe protein_type
const proteinMap: Record<string, 'chicken' | 'pork' | 'beef' | 'seafood' | 'egg' | 'vegetarian'> = {
  chicken: 'chicken',
  pork: 'pork',
  beef: 'beef',
  seafood: 'seafood',
  eggs: 'egg',
  egg: 'egg',
  vegetarian: 'vegetarian',
};

export function RecipeListPage() {
  const [, setLocation] = useLocation();
  const params = useParams<{ category: string; protein: string }>();
  
  const category = params.category || 'breakfast';
  const protein = params.protein || 'chicken';
  
  // Map URL protein to recipe protein_type
  const proteinType = proteinMap[protein] || 'chicken';

  // Get recipes for the selected protein type and category
  const allRecipes = getRecipesByProteinAndCategory(proteinType, 'breakfast');
  
  // Convert to display format
  const recipes = allRecipes.map(r => ({
    id: r.id,
    name: r.name,
    kcal: r.kcal,
    time: '15分鐘' // Default time, can be customized per recipe
  }));


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
        {recipes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">沒有找到相應的食譜</p>
          </div>
        ) : (
          recipes.map((recipe) => (
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
          ))
        )}
      </div>
    </div>
  );
}
