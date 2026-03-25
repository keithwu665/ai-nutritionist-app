import { RefObject } from 'react';
import { Bell, User } from 'lucide-react';
import type { DashboardViewModel } from './DashboardPage';

type RecommendationLike = {
  title?: string;
  description?: string;
};

type MetricCardProps = {
  label: string;
  value: string | number | null;
  unit?: string;
  note?: string;
};

function MetricCard({ label, value, unit = '', note = '' }: MetricCardProps) {
  return (
    <div className="flex min-h-[110px] flex-col justify-between rounded-2xl bg-[#f6f3ee] p-4 shadow-sm">
      <span className="text-[10px] uppercase tracking-widest text-[#46483c]/70">{label}</span>
      <div className="mt-2">
        <span
          className="text-xl font-bold text-[#1c1c19]"
          style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
        >
          {value ?? '—'}
        </span>
        {unit ? <span className="ml-0.5 text-[10px] text-[#46483c]/70">{unit}</span> : null}
      </div>
      {note ? <p className="mt-2 text-[9px] font-medium italic text-[#56642b]/80">{note}</p> : <div />}
    </div>
  );
}

interface DashboardProps {
  viewModel: DashboardViewModel;
  aiRecommendationsRef: RefObject<HTMLDivElement | null>;
}

export function Dashboard({ viewModel, aiRecommendationsRef }: DashboardProps) {
  const { header, mood, dailyFuel, macros, bodyBalance, targetProgress, aiAdvice, activities, hydration, sleep, handlers } = viewModel;

  return (
    <div className="min-h-screen bg-[#fcf9f4] pb-32 text-[#1c1c19]">
      <header className="w-full px-6 pb-4 pt-8">
        <div className="mx-auto max-w-md space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#7d7d72]/70">{header.dateString}</p>
            <p
              className="text-2xl font-bold italic text-[#56642b]"
              style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
            >
              {header.weekday}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-[#f6f3ee]/90 p-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest text-[#5f6155]">{header.greeting}</span>
                <div className="flex items-center gap-2">
                  <h1
                    className="text-2xl font-bold text-[#1c1c19]"
                    style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
                  >
                    {header.userName}
                  </h1>
                  <span className="text-[#56642b]/80">☀️</span>
                </div>
                <p className="mt-1 text-sm text-[#7b6a5e]">
                  {header.greetingCn}，{header.userName}！
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="relative rounded-full p-2 transition-colors hover:bg-[#ebe8e3]"
                onClick={handlers.onBellClick}
                title="View AI recommendations"
              >
                <Bell className="h-5 w-5 text-[#46483c]" />
                {mood.shouldShowNotification ? (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-[#fcf9f4] bg-[#ba1a1a]" />
                ) : null}
              </button>

              <button
                type="button"
                className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#8a9a5b]/20 transition-opacity hover:opacity-90"
                onClick={handlers.onProfileClick}
                title="Profile"
              >
                <div className="flex h-full w-full items-center justify-center bg-[#d9eaa3]/30">
                  <User className="h-4 w-4 text-[#56642b]" />
                </div>
              </button>
            </div>
          </div>

          <section className="mb-2 mt-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#5f6155]/70">Today Mood</h3>
              <button
                type="button"
                className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a9a5b] transition-opacity hover:opacity-70"
                onClick={handlers.onMoodRecordClick}
              >
                Mood Record
              </button>
            </div>

            <div className="flex justify-between gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {mood.options.map((moodOption) => {
                const isActive = mood.selected === moodOption.id;

                return (
                  <button
                    key={moodOption.id}
                    type="button"
                    onClick={() => handlers.onMoodSelect(moodOption.id)}
                    className={`flex min-w-[64px] flex-col items-center gap-1.5 rounded-xl border p-3 transition-all active:scale-95 ${
                      isActive
                        ? 'border-[#7e947f]/30 bg-[#8a9a5b]/10'
                        : 'border-transparent bg-[#ffffff]/60 hover:bg-[#ebe8e3]'
                    }`}
                  >
                    <span className="text-xl">{moodOption.emoji}</span>
                    <span className="text-[10px] font-medium text-[#46483c]">{moodOption.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-8 px-6 pt-2">
        <section className="relative overflow-hidden rounded-2xl bg-[#d27d5b]/10 p-8 text-center">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#d27d5b]/5 blur-2xl" />
          <p
            className="text-lg italic leading-relaxed text-[#924a2c]"
            style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
          >
            &quot;Nourishing the body is an act of gratitude for the soul&apos;s temporary home.&quot;
          </p>
          <p className="mt-4 text-xs uppercase tracking-widest text-[#464646]/60">Daily Intention</p>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between px-2">
            <h2
              className="text-3xl font-bold text-[#1c1c19]"
              style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
            >
              Daily Fuel
            </h2>
            <div className="text-right">
              <span
                className="text-2xl font-bold text-[#56642b]"
                style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
              >
                {Math.round(dailyFuel.calories).toLocaleString()}
              </span>
              <span className="ml-1 text-sm text-[#46483c]/80">
                / {Math.round(dailyFuel.target).toLocaleString()} kcal
              </span>
            </div>
          </div>

          <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl bg-[#ffffff]">
            <svg className="h-40 w-40 -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={70}
                fill="transparent"
                stroke="#e5e2dd"
                strokeWidth="12"
              />
              <circle
                cx="80"
                cy="80"
                r={70}
                fill="transparent"
                stroke="url(#dashboardFuelGradient)"
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 70}
                strokeDashoffset={dailyFuel.progressOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
              <defs>
                <linearGradient id="dashboardFuelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8a9a5b" />
                  <stop offset="100%" stopColor="#56642b" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span
                className="text-3xl font-bold text-[#1c1c19]"
                style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
              >
                {dailyFuel.percent}%
              </span>
              <span className="text-[10px] text-[#46483c]/70">of daily goal</span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2
            className="text-2xl font-bold text-[#1c1c19]"
            style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
          >
            Macro Breakdown
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <MetricCard label="Protein" value={macros.protein} unit="g" />
            <MetricCard label="Carbs" value={macros.carbs} unit="g" />
            <MetricCard label="Fats" value={macros.fats} unit="g" />
          </div>
        </section>

        <section className="space-y-4">
          <h2
            className="text-2xl font-bold text-[#1c1c19]"
            style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
          >
            Body Balance
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <MetricCard label="Weight" value={bodyBalance.weight} unit="kg" />
            <MetricCard label="Body Fat" value={bodyBalance.bodyFat} unit="%" />
            <MetricCard label="BMI" value={bodyBalance.bmi} />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2
              className="text-2xl font-bold text-[#1c1c19]"
              style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
            >
              Target Progress
            </h2>
            <button
              type="button"
              className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a9a5b] transition-opacity hover:opacity-70"
              onClick={handlers.onTargetProgressMore}
            >
              More
            </button>
          </div>
          <div className="space-y-3 rounded-2xl bg-[#f6f3ee] p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#46483c]">
                {targetProgress.startWeight ?? '—'} kg → {targetProgress.goalWeight ?? '—'} kg
              </span>
              <span className="text-sm font-semibold text-[#56642b]">{targetProgress.progressPercent}% Completed</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5e2dd]">
              <div
                className="h-full bg-gradient-to-r from-[#8a9a5b] to-[#56642b] transition-all duration-500"
                style={{ width: `${targetProgress.progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#46483c]/70">
              <span>{targetProgress.daysRemaining ?? '—'} days remaining</span>
              <span>Δ {targetProgress.difference ? targetProgress.difference.toFixed(1) : '—'} kg</span>
            </div>
          </div>
        </section>

        <section className="space-y-4" ref={aiRecommendationsRef}>
          <div className="flex items-center justify-between px-2">
            <h2
              className="text-2xl font-bold text-[#1c1c19]"
              style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
            >
              AI Advice
            </h2>
            <button
              type="button"
              className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a9a5b] transition-opacity hover:opacity-70"
              onClick={handlers.onAIAdviceMore}
            >
              More
            </button>
          </div>
          <div className="space-y-2">
            {aiAdvice.recommendations.map((rec, idx) => (
              <div key={idx} className="rounded-xl bg-[#f6f3ee] p-3">
                {rec.title ? (
                  <p className="text-xs font-semibold text-[#56642b]">{rec.title}</p>
                ) : null}
                <p className="mt-1 text-sm text-[#46483c]">{rec.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2
              className="text-2xl font-bold text-[#1c1c19]"
              style={{ fontFamily: '"Noto Serif", "Georgia", serif' }}
            >
              Today Activity
            </h2>
            <button
              type="button"
              className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a9a5b] transition-opacity hover:opacity-70"
              onClick={handlers.onActivityMore}
            >
              More
            </button>
          </div>
          {activities.hasActivities ? (
            <div className="space-y-2">
              {activities.list.map((activity, idx) => (
                <div key={idx} className="rounded-xl bg-[#f6f3ee] p-3">
                  <p className="text-sm font-semibold text-[#56642b]">{activity.name || 'Activity'}</p>
                  <p className="mt-1 text-xs text-[#46483c]/70">
                    {activity.duration ? `${activity.duration} min` : ''} {activity.distance ? `• ${activity.distance} km` : ''}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-[#f6f3ee] p-4 text-center">
              <p className="text-sm text-[#46483c]/70">No activity recorded today</p>
              <button
                type="button"
                className="mt-3 inline-block rounded-lg bg-[#8a9a5b] px-4 py-2 text-xs font-semibold text-[#ffffff] transition-opacity hover:opacity-90"
                onClick={handlers.onAddActivity}
              >
                Add Activity
              </button>
            </div>
          )}
        </section>

        {/* HYDRATION SECTION */}
        <div className="bg-gradient-to-r from-emerald-50/60 to-teal-50/50 rounded-3xl p-6 border border-emerald-100/35 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-700/65 tracking-widest uppercase mb-2">HYDRATION PULSE</p>
              <p className="text-sm text-emerald-900/75">{hydration.current}L of {hydration.goal}L goal</p>
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-200"></div>
            </div>
          </div>
        </div>
        {/* SLEEP SECTION */}
        <div className="bg-gradient-to-r from-slate-50/60 to-blue-50/50 rounded-3xl p-6 border border-slate-100/35 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">🌙</span>
              <div>
                <p className="text-xs font-semibold text-slate-700/65 tracking-widest uppercase mb-2">SLEEP</p>
                <p className="text-sm text-slate-900/75">{sleep.hours}h {Math.round((sleep.hours % 1) * 60)}m</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200/40 flex items-center justify-center">
              <span className="text-xs text-slate-600">+</span>
            </div>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around border-t border-[#e5e2dd] bg-[#ffffff] px-4 py-4">
        <button
          type="button"
          className="flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors hover:bg-[#f6f3ee]"
          onClick={handlers.onNavDashboard}
        >
          <span className="text-lg">📊</span>
          <span className="text-[10px] font-medium text-[#46483c]">Dashboard</span>
        </button>
        <button
          type="button"
          className="flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors hover:bg-[#f6f3ee]"
          onClick={handlers.onNavBody}
        >
          <span className="text-lg">🧍</span>
          <span className="text-[10px] font-medium text-[#46483c]">Body</span>
        </button>
        <button
          type="button"
          className="flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors hover:bg-[#f6f3ee]"
          onClick={handlers.onNavExercise}
        >
          <span className="text-lg">🏋️</span>
          <span className="text-[10px] font-medium text-[#46483c]">Exercise</span>
        </button>
        <button
          type="button"
          className="flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors hover:bg-[#f6f3ee]"
          onClick={handlers.onNavDiet}
        >
          <span className="text-lg">🍽️</span>
          <span className="text-[10px] font-medium text-[#46483c]">Diet</span>
        </button>
        <button
          type="button"
          className="flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors hover:bg-[#f6f3ee]"
          onClick={handlers.onNavProfile}
        >
          <span className="text-lg">👤</span>
          <span className="text-[10px] font-medium text-[#46483c]">Profile</span>
        </button>
      </nav>
    </div>
  );
}
