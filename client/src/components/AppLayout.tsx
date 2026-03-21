import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";
import { BarChart3, Utensils, Activity, Settings, Dumbbell, Loader2 } from "lucide-react";
import { useEffect } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const [location] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto" />
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/dashboard', label: '儀錶板', icon: BarChart3 },
    { href: '/body', label: '身體', icon: Activity },
    { href: '/food', label: '飲食', icon: Utensils },
    { href: '/exercise', label: '運動', icon: Dumbbell },
    { href: '/settings', label: '設定', icon: Settings },
  ];

  const isActive = (href: string) => location === href || location.startsWith(href + '/');

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:pl-64">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex-col z-50">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-emerald-600">AI 營養師</h1>
          {user?.name && (
            <p className="text-sm text-gray-500 mt-1">你好，{user.name}</p>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive(item.href)
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium cursor-pointer ${
                    isActive(item.href)
                      ? 'text-emerald-600'
                      : 'text-gray-400'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
}
