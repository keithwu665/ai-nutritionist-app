import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { getRecipeImageById } from "@/lib/recipeImages";

interface RecipeData {
  name: string;
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  ingredients: string[];
  steps: string[];
  fatLossTips: string[];
}

// 10 Chicken Breakfast Recipes for Fat Loss
const mockRecipes: Record<string, RecipeData> = {
  "c1": {
    name: "香煎雞胸蛋白早餐碗",
    kcal: 320,
    protein: 42,
    fat: 8,
    carbs: 18,
    ingredients: ["雞胸150g", "蛋白2個", "番茄", "菠菜", "洋蔥", "橄欖油1茶匙", "鹽和黑椒"],
    steps: [
      "將雞胸切成小塊，用中火煎至半熟",
      "加入蛋白攪拌均勻",
      "加入番茄、菠菜和洋蔥",
      "繼續煎至雞肉熟透，蛋白凝固",
      "調味後盛碟享用"
    ],
    fatLossTips: [
      "蛋白含有豐富蛋白質，飽腹感強",
      "菠菜含鐵質，提升新陳代謝",
      "番茄低卡高纖，促進消化"
    ]
  },
  "c2": {
    name: "雞胸牛油果全麥吐司",
    kcal: 380,
    protein: 38,
    fat: 12,
    carbs: 28,
    ingredients: ["雞胸100g", "全麥吐司2片", "牛油果1/2個", "番茄", "檸檬", "黑椒"],
    steps: [
      "將雞胸煮熟後切成薄片",
      "全麥吐司放入烤麵包機烤至金黃",
      "牛油果切半，用叉子壓成泥狀",
      "在吐司上塗上牛油果泥",
      "放上雞胸片和番茄片，淋上檸檬汁"
    ],
    fatLossTips: [
      "全麥吐司富含纖維，增加飽腹感",
      "牛油果含健康脂肪，促進脂肪燃燒",
      "檸檬汁幫助消化，加快代謝"
    ]
  },
  "c3": {
    name: "雞肉菠菜蛋白捲",
    kcal: 310,
    protein: 40,
    fat: 9,
    carbs: 15,
    ingredients: ["雞胸100g", "蛋白3個", "菠菜一把", "起司20g", "洋蔥", "橄欖油"],
    steps: [
      "將蛋白打成蛋液",
      "在平底鍋倒入蛋液，搖晃至半熟",
      "加入菠菜和洋蔥，繼續煮",
      "放上雞胸片和起司",
      "捲起蛋捲，切成適當大小"
    ],
    fatLossTips: [
      "蛋白卷低脂高蛋白，完美早餐",
      "菠菜含葉綠素，幫助排毒",
      "起司提供鈣質，強化骨骼"
    ]
  },
  "c4": {
    name: "雞胸番茄沙律碗",
    kcal: 340,
    protein: 39,
    fat: 10,
    carbs: 20,
    ingredients: ["雞胸120g", "番茄2個", "生菜", "小黃瓜", "紫洋蔥", "橄欖油1湯匙", "醋"],
    steps: [
      "將雞胸煮熟後切成塊狀",
      "番茄、小黃瓜切塊",
      "生菜撕成適當大小",
      "混合所有材料",
      "淋上橄欖油和醋調味"
    ],
    fatLossTips: [
      "番茄含番茄紅素，強大抗氧化劑",
      "生菜低卡高纖，完美減肥食材",
      "醋幫助消化，穩定血糖"
    ]
  },
  "c5": {
    name: "雞肉藜麥早餐碗",
    kcal: 360,
    protein: 36,
    fat: 11,
    carbs: 32,
    ingredients: ["雞胸100g", "藜麥50g", "彩椒", "黑豆", "玉米", "橄欖油", "檸檬"],
    steps: [
      "藜麥按包裝指示煮熟",
      "雞胸切成小塊，用中火煎至熟透",
      "彩椒切丁",
      "混合藜麥、雞肉、彩椒和黑豆",
      "淋上橄欖油和檸檬汁"
    ],
    fatLossTips: [
      "藜麥是完全蛋白質，含所有必需胺基酸",
      "黑豆富含纖維，促進腸道健康",
      "彩椒含維生素C，提升免疫力"
    ]
  },
  "c6": {
    name: "雞胸蘑菇炒蛋",
    kcal: 330,
    protein: 41,
    fat: 10,
    carbs: 12,
    ingredients: ["雞胸100g", "蛋2個", "蘑菇150g", "洋蔥", "大蒜", "橄欖油1茶匙"],
    steps: [
      "雞胸切成小塊，先炒至半熟",
      "加入切片蘑菇和洋蔥",
      "蛋打散，倒入鍋中",
      "快速炒至蛋半熟",
      "加入大蒜和調味料完成"
    ],
    fatLossTips: [
      "蘑菇含維生素D，促進鈣質吸收",
      "蛋含膽鹼，幫助脂肪代謝",
      "大蒜含硫化物，增強免疫力"
    ]
  },
  "c7": {
    name: "雞肉低脂芝士三文治",
    kcal: 350,
    protein: 37,
    fat: 11,
    carbs: 26,
    ingredients: ["雞胸100g", "全麥麵包2片", "低脂芝士1片", "番茄", "生菜", "黃芥末"],
    steps: [
      "雞胸煮熟後切成薄片",
      "全麥麵包輕輕烤一下",
      "在麵包上塗黃芥末",
      "放上生菜、番茄、雞肉和低脂芝士",
      "蓋上另一片麵包即可"
    ],
    fatLossTips: [
      "低脂芝士提供鈣質，同時控制熱量",
      "黃芥末無熱量，增加風味",
      "全麥麵包提供複雜碳水化合物"
    ]
  },
  "c8": {
    name: "雞胸蔬菜卷餅",
    kcal: 320,
    protein: 38,
    fat: 9,
    carbs: 22,
    ingredients: ["雞胸100g", "全麥卷餅2張", "生菜", "番茄", "洋蔥", "青椒", "優格"],
    steps: [
      "雞胸煮熟後切成條狀",
      "全麥卷餅微波加熱",
      "蔬菜切成條狀",
      "在卷餅上放生菜、蔬菜和雞肉",
      "淋上低脂優格，捲起享用"
    ],
    fatLossTips: [
      "全麥卷餅富含纖維，促進消化",
      "優格含益生菌，改善腸道健康",
      "生蔬菜提供豐富微量營養素"
    ]
  },
  "c9": {
    name: "雞肉燕麥鹹粥",
    kcal: 340,
    protein: 35,
    fat: 10,
    carbs: 30,
    ingredients: ["雞胸80g", "燕麥50g", "高湯500ml", "洋蔥", "胡蘿蔔", "香菇", "鹽"],
    steps: [
      "燕麥用高湯煮軟",
      "雞胸切成小塊，加入煮",
      "加入切碎的洋蔥、胡蘿蔔和香菇",
      "繼續煮至所有材料軟爛",
      "調味後盛碟"
    ],
    fatLossTips: [
      "燕麥含β-葡聚糖，降低膽固醇",
      "鹹粥比甜粥更適合減肥",
      "蔬菜提供飽腹感，減少進食量"
    ]
  },
  "c10": {
    name: "雞胸青瓜乳酪碗",
    kcal: 300,
    protein: 40,
    fat: 8,
    carbs: 14,
    ingredients: ["雞胸120g", "希臘優格150g", "青瓜", "番茄", "洋蔥", "檸檬", "香草"],
    steps: [
      "雞胸煮熟後切成塊狀",
      "青瓜切成小塊",
      "番茄切丁",
      "在碗中混合優格、檸檬汁和香草",
      "加入雞肉和蔬菜，輕輕混合"
    ],
    fatLossTips: [
      "希臘優格蛋白質高，脂肪低",
      "青瓜含95%水分，超低卡",
      "檸檬增加風味，無需額外鹽分"
    ]
  }
};

export default function RecipePage() {
  const params = useParams<{ recipeId: string }>();
  const recipeId = params.recipeId || "c1";
  const recipe = mockRecipes[recipeId] || mockRecipes["c1"];

  const handleAddToDiet = async () => {
    try {
      window.location.href = "/food";
    } catch (error) {
      console.error("Failed to add food:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-background border-b border-border p-4 flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">{recipe.name}</h1>
      </div>

      {/* Hero Section */}
      <div className="p-4 space-y-4">
        <div className="flex gap-4 items-start">
          {/* Recipe Image */}
          <div className="flex-shrink-0">
            <img
              src={getRecipeImageById(recipeId)}
              alt={recipe.name}
              className="w-24 h-24 rounded-xl object-cover shadow-sm"
              onError={(e) => {
                e.currentTarget.src = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/chicken-salad_2ee5ac36.jpg";
              }}
            />
          </div>

          {/* Nutrition Info Grid */}
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div className="bg-card rounded-lg p-3 border border-border">
              <p className="text-xs text-muted-foreground">熱量</p>
              <p className="text-xl font-bold text-foreground">{recipe.kcal}</p>
              <p className="text-xs text-muted-foreground">kcal</p>
            </div>
            <div className="bg-card rounded-lg p-3 border border-border">
              <p className="text-xs text-muted-foreground">蛋白質</p>
              <p className="text-xl font-bold text-foreground">{recipe.protein}</p>
              <p className="text-xs text-muted-foreground">g</p>
            </div>
            <div className="bg-card rounded-lg p-3 border border-border">
              <p className="text-xs text-muted-foreground">脂肪</p>
              <p className="text-xl font-bold text-foreground">{recipe.fat}</p>
              <p className="text-xs text-muted-foreground">g</p>
            </div>
            <div className="bg-card rounded-lg p-3 border border-border">
              <p className="text-xs text-muted-foreground">碳水</p>
              <p className="text-xl font-bold text-foreground">{recipe.carbs}</p>
              <p className="text-xs text-muted-foreground">g</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-4 space-y-4">
        {/* Ingredients Card */}
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <h2 className="font-semibold text-foreground">材料</h2>
          <div className="flex flex-wrap gap-2">
            {recipe.ingredients.map((ingredient, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 bg-accent/50 rounded-full px-3 py-1 text-sm text-foreground"
              >
                <span>🥘</span>
                <span>{ingredient}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps Card */}
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <h2 className="font-semibold text-foreground">做法</h2>
          <div className="space-y-2">
            {recipe.steps.map((step, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                  {idx + 1}
                </div>
                <p className="text-sm text-foreground pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fat-Loss Tips Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4 space-y-3">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <span>💡</span>
            減脂貼士
          </h2>
          <div className="space-y-2">
            {recipe.fatLossTips.map((tip, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <p className="text-sm text-foreground">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <Button
          onClick={handleAddToDiet}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3 font-semibold"
        >
          加入今日飲食
        </Button>
      </div>
    </div>
  );
}
