import { ChevronLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  label?: string;
  className?: string;
}

export default function BackButton({ label = '返回', className = '' }: BackButtonProps) {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    window.history.back();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className={`gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 ${className}`}
    >
      <ChevronLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}
