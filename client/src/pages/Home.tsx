import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Activity, Utensils, BarChart3, Target, Heart, Dumbbell } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [loading, isAuthenticated, setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Heart className="h-7 w-7 text-emerald-600" />
          <span className="text-xl font-bold text-emerald-700">AI 營養師</span>
        </div>
        <a href={getLoginUrl()}>
          <Button variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50">
            登入
          </Button>
        </a>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          智能管理你的
          <span className="text-emerald-600">營養</span>與
          <span className="text-emerald-600">健身</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          透過 AI 驅動的個人化建議，記錄飲食、運動和身體數據，
          讓你的健康管理更科學、更高效。
        </p>
        <a href={getLoginUrl()}>
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg">
            立即開始
          </Button>
        </a>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
          核心功能
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Utensils className="h-8 w-8 text-emerald-600" />}
            title="飲食記錄"
            description="輕鬆記錄每餐攝取，自動計算熱量和營養素，掌握每日飲食狀況。"
          />
          <FeatureCard
            icon={<Dumbbell className="h-8 w-8 text-emerald-600" />}
            title="運動追蹤"
            description="記錄運動類型、時長和強度，追蹤卡路里消耗，建立運動習慣。"
          />
          <FeatureCard
            icon={<Activity className="h-8 w-8 text-emerald-600" />}
            title="身體數據"
            description="追蹤體重、體脂率和肌肉量變化，視覺化趨勢圖表助你掌握進度。"
          />
          <FeatureCard
            icon={<Target className="h-8 w-8 text-emerald-600" />}
            title="目標設定"
            description="根據你的身體數據和目標，自動計算 BMR、TDEE 和每日目標熱量。"
          />
          <FeatureCard
            icon={<BarChart3 className="h-8 w-8 text-emerald-600" />}
            title="數據分析"
            description="直觀的圖表和統計數據，讓你清楚了解健康趨勢和進步方向。"
          />
          <FeatureCard
            icon={<Heart className="h-8 w-8 text-emerald-600" />}
            title="智能建議"
            description="基於你的數據，提供個人化的飲食和運動建議，助你達成健康目標。"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-emerald-600 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          開始你的健康之旅
        </h2>
        <p className="text-lg text-emerald-100 mb-8 max-w-xl mx-auto">
          免費註冊，立即體驗 AI 營養師的智能健康管理功能。
        </p>
        <a href={getLoginUrl()}>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-emerald-700 px-8 py-3 text-lg">
            免費註冊
          </Button>
        </a>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 text-center text-gray-500 text-sm">
        <p>© 2026 AI 營養師 — Powered by Manus Fellow Events × Fitasty</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
