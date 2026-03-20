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
      <p className="font-medium">AI 教練人格</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {personalities.map((personality) => (
          <button
            key={personality.id}
            onClick={() => onChange(personality.id as 'gentle' | 'coach' | 'hk_style')}
            className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              value === personality.id
                ? 'border-emerald-500 bg-emerald-50 scale-105'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            {/* Checkmark indicator */}
            {value === personality.id && (
              <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1">
                <Check size={16} />
              </div>
            )}

            {/* Content */}
            <div className="space-y-2">
              <div className="text-3xl">{personality.emoji}</div>
              <div>
                <h3 className="font-semibold text-sm">{personality.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{personality.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500">選擇你喜歡的 AI 教練人格風格。每個人格會以不同的方式提供建議。</p>
    </div>
  );
}
