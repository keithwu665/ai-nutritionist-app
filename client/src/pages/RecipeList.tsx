import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface RecipeListProps {
  category?: string;
  protein?: string;
}

export default function RecipeList({ category, protein }: RecipeListProps) {
  const [, navigate] = useLocation();

  const handleBack = () => {
    navigate(`/diet/inspiration/home-cooking/${category}`);
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
        <h1 className="text-3xl font-bold">食譜列表</h1>
      </div>

      {/* Placeholder Content */}
      <div className="text-center py-16 space-y-4">
        <p className="text-lg text-gray-600">
          食譜功能即將推出
        </p>
        <p className="text-sm text-gray-500">
          類別: {category} | 食材: {protein}
        </p>
      </div>
    </div>
  );
}
