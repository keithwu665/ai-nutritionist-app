import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { getRecipeImageById } from "@/lib/recipeImages";
import { getRecipeById } from "@/lib/recipeDataReorganized";

export default function RecipePage() {
  const params = useParams<{ recipeId: string }>();
  const recipeId = params.recipeId || "c1";
  
  const recipe = getRecipeById(recipeId);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-4">食譜未找到</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  const handleAddToDiet = async (): Promise<void> => {
    try {
      window.location.href = "/food";
    } catch (error) {
      console.error("Failed to add food:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-background border-b border-border p-4 flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">{recipe.name}</h1>
      </div>

      {/* Hero Section */}
      <div className="p-4 space-y-4">
        <div className="flex gap-4 items-start">
          {/* Recipe Image - Larger */}
          <div className="flex-shrink-0">
            <img
              src={getRecipeImageById(recipeId)}
              alt={recipe.name}
              className="w-32 h-32 rounded-xl object-cover shadow-md"
              onError={(e) => {
                e.currentTarget.src = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-salad_2ee5ac36.jpg";
              }}
            />
          </div>

          {/* Nutrition Info Grid */}
          <div className="flex-1 space-y-3">
            {/* Total Weight */}
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-xs text-blue-600 font-medium">總重量</p>
              <p className="text-lg font-bold text-blue-900">{recipe.totalWeight}g</p>
            </div>

            {/* Nutrition Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-card rounded-lg p-2 border border-border">
                <p className="text-xs text-muted-foreground">熱量</p>
                <p className="text-lg font-bold text-foreground">{recipe.kcal}</p>
                <p className="text-xs text-muted-foreground">kcal</p>
              </div>
              <div className="bg-card rounded-lg p-2 border border-border">
                <p className="text-xs text-muted-foreground">蛋白質</p>
                <p className="text-lg font-bold text-foreground">{recipe.protein}</p>
                <p className="text-xs text-muted-foreground">g</p>
              </div>
              <div className="bg-card rounded-lg p-2 border border-border">
                <p className="text-xs text-muted-foreground">脂肪</p>
                <p className="text-lg font-bold text-foreground">{recipe.fat}</p>
                <p className="text-xs text-muted-foreground">g</p>
              </div>
              <div className="bg-card rounded-lg p-2 border border-border">
                <p className="text-xs text-muted-foreground">碳水</p>
                <p className="text-lg font-bold text-foreground">{recipe.carbs}</p>
                <p className="text-xs text-muted-foreground">g</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-4 space-y-4">
        {/* Ingredients Card */}
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <h2 className="font-semibold text-foreground">材料</h2>
          <div className="flex flex-wrap gap-2">
            {recipe.ingredients.map((ingredient: { name: string; quantity: string }, idx: number) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 bg-accent/50 rounded-full px-3 py-1 text-sm text-foreground"
              >
                <span>🥘</span>
                <span>{ingredient.name} {ingredient.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps Card */}
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <h2 className="font-semibold text-foreground">做法</h2>
          <div className="space-y-2">
            {recipe.steps.map((step: string, idx: number) => (
              <div key={idx} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                  {idx + 1}
                </div>
                <p className="text-sm text-foreground pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fat-Loss Tips Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4 space-y-3">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <span>💡</span>
            減脂貼士
          </h2>
          <div className="space-y-2">
            {recipe.fatLossTips.map((tip: string, idx: number) => (
              <div key={idx} className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <p className="text-sm text-foreground">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <Button
          onClick={handleAddToDiet}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3 font-semibold"
        >
          加入今日飲食
        </Button>
      </div>
    </div>
  );
}
