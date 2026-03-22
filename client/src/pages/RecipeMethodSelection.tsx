import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function RecipeMethodSelection() {
  const [, navigate] = useLocation();

  // Extract category and protein from URL path
  const pathSegments = window.location.pathname.split('/');
  const category = pathSegments[5] || 'unknown';
  const protein = pathSegments[6] || 'unknown';

  const options = [
    {
      id: 'recipe-page',
      title: '食譜頁',
      description: '查看做法、材料和營養',
      icon: '📖',
    },
    {
      id: 'ai-recommended',
      title: 'AI 推薦菜式',
      description: '根據你的目標推薦合適菜式',
      icon: '🤖',
    },
    {
      id: 'fitasty',
      title: 'Fitasty integration',
      description: '快速加入 Fitasty 產品及營養資料',
      icon: '⚡',
    },
  ];

  const handleOptionClick = (optionId: string) => {
    if (optionId === 'recipe-page') {
      // Navigate to recipe list page
      navigate(
        `/diet/inspiration/home-cooking/${category}/${protein}/recipes?category=${category}&protein=${protein}`
      );
    } else {
      navigate(
        `/diet/inspiration/home-cooking/${category}/${protein}/${optionId}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft size={24} />
            <span>返回</span>
          </button>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700 capitalize">
              {category} / {protein}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Subtitle */}
        <h2 className="text-center text-lg font-semibold text-gray-800 mb-8">
          選擇你想查看的方式
        </h2>

        {/* Options Grid */}
        <div className="space-y-4">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              className="w-full p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-green-400 hover:shadow-lg transition-all duration-200 text-left"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{option.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Placeholder Message */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          選擇一個選項開始
        </div>
      </div>
    </div>
  );
}
