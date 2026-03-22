import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface RecipeCategory {
  id: string;
  name: string;
  emoji: string;
  label: string;
}

const categories: RecipeCategory[] = [
  { id: 'breakfast', name: '早餐', emoji: '🍳', label: 'Breakfast' },
  { id: 'main', name: '正餐', emoji: '🍱', label: 'Main Course' },
  { id: 'salad', name: '沙律', emoji: '🥗', label: 'Salad' },
  { id: 'snack', name: '小食', emoji: '🍪', label: 'Snack' },
  { id: 'soup', name: '湯類', emoji: '🍲', label: 'Soup' },
  { id: 'other', name: '其他', emoji: '🍽', label: 'Other' },
];

export default function HomeRecipes() {
  const [, navigate] = useLocation();

  const handleCategoryClick = (categoryId: string) => {
    // For now, show a placeholder or empty recipe page
    // In the future, this will navigate to the recipe list for that category
    console.log('Selected category:', categoryId);
    // Placeholder: show a toast or navigate to a recipe list page
  };

  const handleBack = () => {
    navigate('/food');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">在家料理</h1>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-3 gap-4 md:gap-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-lg"
          >
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:border-emerald-400 h-full border border-gray-200 rounded-xl">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                <div className="text-5xl">{category.emoji}</div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-foreground">
                    {category.name}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {/* Placeholder Message */}
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">選擇一個類別查看食譜</p>
      </div>
    </div>
  );
}
