import { Check } from 'lucide-react';

interface PersonalitySelectorProps {
  value: 'gentle' | 'coach' | 'hk_style';
  onChange: (value: 'gentle' | 'coach' | 'hk_style') => void;
}

const personalities = [
  {
    id: 'gentle',
    emoji: '🌿',
    title: '溫柔貼身教練',
    description: '細心提醒，陪你慢慢進步',
  },
  {
    id: 'coach',
    emoji: '💪',
    title: '魔鬼教練',
    description: '高要求無藉口，只講結果',
  },
  {
    id: 'hk_style',
    emoji: '😏',
    title: '香港寸嘴教練',
    description: '會寸爆你，但唔會放棄你',
  },
];

export function PersonalitySelector({ value, onChange }: PersonalitySelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="font-semibold text-base mb-1">AI 教練人格</p>
        <p className="text-xs text-gray-500">選擇你喜歡的人格風格，每個人格會以不同的方式提供建議</p>
      </div>

      {/* Horizontal card layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {personalities.map((personality) => (
          <button
            key={personality.id}
            onClick={() => onChange(personality.id as 'gentle' | 'coach' | 'hk_style')}
            className={`relative p-5 rounded-xl border-2 transition-all duration-200 text-center flex flex-col items-center gap-3 ${
              value === personality.id
                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            {/* Checkmark indicator */}
            {value === personality.id && (
              <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-1.5 shadow-md">
                <Check size={16} strokeWidth={3} />
              </div>
            )}

            {/* Emoji icon */}
            <div className="text-4xl">{personality.emoji}</div>

            {/* Content */}
            <div className="space-y-1.5 w-full">
              <h3 className="font-semibold text-sm leading-tight">{personality.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{personality.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
