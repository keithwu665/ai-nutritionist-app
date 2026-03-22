import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface ProteinOption {
  id: string;
  name: string;
  emoji: string;
}

const proteins: ProteinOption[] = [
  { id: 'chicken', name: '雞肉', emoji: '🐔' },
  { id: 'pork', name: '豬肉', emoji: '🐷' },
  { id: 'beef', name: '牛肉', emoji: '🐮' },
  { id: 'seafood', name: '海鮮', emoji: '🐟' },
  { id: 'eggs', name: '蛋類', emoji: '🥚' },
  { id: 'vegetarian', name: '素食', emoji: '🌱' },
];

interface ProteinSelectionProps {
  category?: string;
}

export default function ProteinSelection({ category }: ProteinSelectionProps) {
  const [, navigate] = useLocation();

  const handleProteinClick = (proteinId: string) => {
    // Navigate to Level 3 selection page with category and protein
    navigate(`/diet/inspiration/home-cooking/${category}/${proteinId}`);
  };

  const handleBack = () => {
    navigate('/diet/inspiration/home-cooking');
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
        <h1 className="text-3xl font-bold">選擇主要食材</h1>
      </div>

      {/* Protein Grid */}
      <div className="grid grid-cols-3 gap-4 md:gap-6">
        {proteins.map((protein) => (
          <button
            key={protein.id}
            onClick={() => handleProteinClick(protein.id)}
            className="focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-lg"
          >
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:border-emerald-400 h-full border border-gray-200 rounded-xl">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                <div className="text-5xl">{protein.emoji}</div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-foreground">
                    {protein.name}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {/* Placeholder Message */}
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">選擇主要食材查看食譜</p>
      </div>
    </div>
  );
}
