import { useRouter } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface RecipeData {
  name: string;
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  image: string;
  ingredients: string[];
  steps: string[];
}

// Mock recipe data
const mockRecipes: Record<string, RecipeData> = {
  "chicken-salad": {
    name: "香煎雞胸沙律",
    kcal: 420,
    protein: 35,
    fat: 12,
    carbs: 30,
    image: "🥗",
    ingredients: ["雞胸", "生菜", "粟米", "番茄", "橄欖油", "檸檬"],
    steps: [
      "將雞胸切成適當大小",
      "用中火煎雞胸至金黃色",
      "將雞胸切片",
      "混合生菜、粟米和番茄",
      "淋上橄欖油和檸檬汁即可"
    ]
  }
};

export default function RecipePage() {
  const router = useRouter();
  const recipe = mockRecipes["chicken-salad"];

  const handleAddToDiet = async () => {
    try {
      // Show success message and navigate
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
          {/* Recipe Image */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center text-5xl shadow-sm">
              {recipe.image}
            </div>
          </div>

          {/* Nutrition Info Grid */}
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div className="bg-card rounded-lg p-3 border border-border">
              <p className="text-xs text-muted-foreground">熱量</p>
              <p className="text-xl font-bold text-foreground">{recipe.kcal}</p>
              <p className="text-xs text-muted-foreground">kcal</p>
            </div>
            <div className="bg-card rounded-lg p-3 border border-border">
              <p className="text-xs text-muted-foreground">蛋白質</p>
              <p className="text-xl font-bold text-foreground">{recipe.protein}</p>
              <p className="text-xs text-muted-foreground">g</p>
            </div>
            <div className="bg-card rounded-lg p-3 border border-border">
              <p className="text-xs text-muted-foreground">脂肪</p>
              <p className="text-xl font-bold text-foreground">{recipe.fat}</p>
              <p className="text-xs text-muted-foreground">g</p>
            </div>
            <div className="bg-card rounded-lg p-3 border border-border">
              <p className="text-xs text-muted-foreground">碳水</p>
              <p className="text-xl font-bold text-foreground">{recipe.carbs}</p>
              <p className="text-xs text-muted-foreground">g</p>
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
            {recipe.ingredients.map((ingredient, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 bg-accent/50 rounded-full px-3 py-1 text-sm text-foreground"
              >
                <span>🥘</span>
                <span>{ingredient}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps Card */}
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <h2 className="font-semibold text-foreground">做法</h2>
          <div className="space-y-2">
            {recipe.steps.map((step, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                  {idx + 1}
                </div>
                <p className="text-sm text-foreground pt-0.5">{step}</p>
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
