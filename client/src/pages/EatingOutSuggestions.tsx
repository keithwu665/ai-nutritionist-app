import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function EatingOutSuggestions() {
  const tips = [
    {
      id: 1,
      title: '選擇蛋白質豐富的菜式',
      description: '優先選擇雞肉、魚類或豆製品',
      examples: ['烤雞胸肉', '清蒸魚', '豆腐菜式'],
    },
    {
      id: 2,
      title: '要求清淡烹飪方式',
      description: '避免油炸和過度油膩的菜式',
      examples: ['蒸、煮、烤', '要求少油', '醬料分開'],
    },
    {
      id: 3,
      title: '增加蔬菜和纖維攝取',
      description: '選擇配菜中有蔬菜的選項',
      examples: ['沙律', '蒸菜', '清湯'],
    },
  ];

  const avoidList = [
    '油炸食物（薯條、炸雞、天婦羅）',
    '高糖飲料（汽水、果汁、奶茶）',
    '過量醬料（美乃滋、芝士醬）',
    '加工肉類（香腸、午餐肉）',
    '過量鹽分的菜式',
  ];

  return (
    <div className="pb-32 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 bg-background z-10 p-4 md:p-8 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <Link href="/diet">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">外食選擇建議</h1>
          <p className="text-muted-foreground mt-2">健康的外出用餐指南</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            💡 <strong>小貼士：</strong> 外出用餐時，主動與餐廳溝通你的飲食需求。大多數餐廳都願意配合特殊要求。
          </p>
        </div>

        {/* Healthy Choices */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">✅ 健康選擇</h2>
          {tips.map((tip) => (
            <Card key={tip.id}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  {tip.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tip.examples.map((example, idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Avoid List */}
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              ❌ 避免的食物
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {avoidList.map((item, idx) => (
                <li key={idx} className="text-sm text-red-900">
                  • {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Restaurant Tips */}
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-base">餐廳選擇建議</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>🍜 <strong>亞洲菜：</strong> 選擇清湯麵、清蒸菜、白飯配蛋白質</p>
            <p>🍔 <strong>西餐：</strong> 選擇烤肉、沙律、避免起司和醬料</p>
            <p>🌮 <strong>中東菜：</strong> 選擇烤肉串、豆類、避免油炸</p>
            <p>🍕 <strong>意大利菜：</strong> 選擇番茄醬基礎的菜式，控制份量</p>
          </CardContent>
        </Card>

        {/* Portion Control */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">份量控制技巧</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• 餐廳份量通常較大，可以要求分享或打包一半</p>
            <p>• 先吃蛋白質和蔬菜，再吃碳水化合物</p>
            <p>• 飲用水或無糖飲品，避免高糖飲料</p>
            <p>• 細心咀嚼，給大腦足夠時間感受飽腹感</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
