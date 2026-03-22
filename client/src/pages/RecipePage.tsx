import { ChevronLeft } from 'lucide-react';

export default function RecipePage() {
  const pathSegments = window.location.pathname.split('/');
  const category = pathSegments[5] || 'unknown';
  const protein = pathSegments[6] || 'unknown';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
              食譜頁
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-4">📖</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">食譜頁</h2>
        <p className="text-gray-600 mb-4">
          查看做法、材料和營養
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <p className="text-gray-700 text-sm">
            類別: <span className="font-semibold capitalize">{category}</span>
          </p>
          <p className="text-gray-700 text-sm mt-2">
            食材: <span className="font-semibold capitalize">{protein}</span>
          </p>
        </div>
        <p className="text-gray-500 text-sm mt-8">
          食譜功能即將推出
        </p>
      </div>
    </div>
  );
}
