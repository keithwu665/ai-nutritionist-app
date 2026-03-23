/**
 * Comprehensive Recipe Database
 * Includes all menus, categories, and protein types
 * Each recipe has complete ingredient quantities and total serving weight
 */

export interface RecipeData {
  id: string;
  name: string;
  protein_type: 'chicken' | 'pork' | 'beef' | 'seafood' | 'egg' | 'vegetarian';
  category: 'breakfast' | 'lunch' | 'dinner' | 'salad' | 'snack' | 'soup';
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  totalWeight: number; // in grams
  ingredients: { name: string; quantity: string }[];
  steps: string[];
  fatLossTips: string[];
}

// ============================================
// BREAKFAST (早餐) RECIPES
// ============================================

// Chicken Breakfast Recipes
export const chickenBreakfastRecipes: Record<string, RecipeData> = {
  "c1": {
    protein_type: "chicken",
    category: "breakfast",
    id: "c1",
    name: "香煎雞胸蛋白早餐碗",
    kcal: 320,
    protein: 42,
    fat: 8,
    carbs: 18,
    totalWeight: 380,
    ingredients: [
      { name: "雞胸", quantity: "150g" },
      { name: "蛋白", quantity: "2個" },
      { name: "番茄", quantity: "80g" },
      { name: "菠菜", quantity: "50g" },
      { name: "洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
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
    protein_type: "chicken",
    category: "breakfast",
    id: "c2",
    name: "雞胸牛油果全麥吐司",
    kcal: 380,
    protein: 38,
    fat: 12,
    carbs: 28,
    totalWeight: 420,
    ingredients: [
      { name: "雞胸", quantity: "100g" },
      { name: "全麥吐司", quantity: "2片（60g）" },
      { name: "牛油果", quantity: "1/2個（60g）" },
      { name: "番茄", quantity: "60g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "黑椒", quantity: "0.5g" },
      { name: "鹽", quantity: "1g" }
    ],
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
    protein_type: "chicken",
    category: "breakfast",
    id: "c3",
    name: "雞肉菠菜蛋白捲",
    kcal: 310,
    protein: 40,
    fat: 9,
    carbs: 15,
    totalWeight: 360,
    ingredients: [
      { name: "雞胸", quantity: "100g" },
      { name: "蛋白", quantity: "3個" },
      { name: "菠菜", quantity: "60g" },
      { name: "起司", quantity: "20g" },
      { name: "洋蔥", quantity: "25g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" }
    ],
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
    protein_type: "chicken",
    category: "breakfast",
    id: "c4",
    name: "雞胸番茄沙律碗",
    kcal: 340,
    protein: 39,
    fat: 10,
    carbs: 20,
    totalWeight: 400,
    ingredients: [
      { name: "雞胸", quantity: "120g" },
      { name: "番茄", quantity: "150g" },
      { name: "生菜", quantity: "50g" },
      { name: "小黃瓜", quantity: "60g" },
      { name: "紫洋蔥", quantity: "20g" },
      { name: "橄欖油", quantity: "1湯匙（15ml）" },
      { name: "醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
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
    protein_type: "chicken",
    category: "breakfast",
    id: "c5",
    name: "雞肉藜麥早餐碗",
    kcal: 360,
    protein: 36,
    fat: 11,
    carbs: 32,
    totalWeight: 450,
    ingredients: [
      { name: "雞胸", quantity: "100g" },
      { name: "藜麥", quantity: "50g（乾）" },
      { name: "彩椒", quantity: "60g" },
      { name: "黑豆", quantity: "40g（罐裝）" },
      { name: "玉米", quantity: "30g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "鹽", quantity: "1g" }
    ],
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
    protein_type: "chicken",
    category: "breakfast",
    id: "c6",
    name: "雞胸蘑菇炒蛋",
    kcal: 330,
    protein: 41,
    fat: 10,
    carbs: 12,
    totalWeight: 380,
    ingredients: [
      { name: "雞胸", quantity: "100g" },
      { name: "蛋", quantity: "2個" },
      { name: "蘑菇", quantity: "150g" },
      { name: "洋蔥", quantity: "30g" },
      { name: "大蒜", quantity: "5g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
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
    protein_type: "chicken",
    category: "breakfast",
    id: "c7",
    name: "雞肉低脂芝士三文治",
    kcal: 350,
    protein: 37,
    fat: 11,
    carbs: 26,
    totalWeight: 410,
    ingredients: [
      { name: "雞胸", quantity: "100g" },
      { name: "全麥麵包", quantity: "2片（60g）" },
      { name: "低脂芝士", quantity: "1片（20g）" },
      { name: "番茄", quantity: "60g" },
      { name: "生菜", quantity: "30g" },
      { name: "黃芥末", quantity: "1湯匙（15g）" },
      { name: "鹽", quantity: "1g" }
    ],
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
    protein_type: "chicken",
    category: "breakfast",
    id: "c8",
    name: "雞胸蔬菜卷餅",
    kcal: 320,
    protein: 38,
    fat: 9,
    carbs: 22,
    totalWeight: 390,
    ingredients: [
      { name: "雞胸", quantity: "100g" },
      { name: "全麥卷餅", quantity: "2張（80g）" },
      { name: "生菜", quantity: "40g" },
      { name: "番茄", quantity: "60g" },
      { name: "洋蔥", quantity: "25g" },
      { name: "青椒", quantity: "40g" },
      { name: "低脂優格", quantity: "2湯匙（30g）" },
      { name: "鹽", quantity: "1g" }
    ],
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
    protein_type: "chicken",
    category: "breakfast",
    id: "c9",
    name: "雞肉燕麥鹹粥",
    kcal: 340,
    protein: 35,
    fat: 10,
    carbs: 30,
    totalWeight: 520,
    ingredients: [
      { name: "雞胸", quantity: "80g" },
      { name: "燕麥", quantity: "50g（乾）" },
      { name: "高湯", quantity: "500ml" },
      { name: "洋蔥", quantity: "30g" },
      { name: "胡蘿蔔", quantity: "40g" },
      { name: "香菇", quantity: "50g" },
      { name: "鹽", quantity: "2g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
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
    protein_type: "chicken",
    category: "breakfast",
    id: "c10",
    name: "雞胸青瓜乳酪碗",
    kcal: 300,
    protein: 40,
    fat: 8,
    carbs: 14,
    totalWeight: 380,
    ingredients: [
      { name: "雞胸", quantity: "120g" },
      { name: "希臘優格", quantity: "150g" },
      { name: "青瓜", quantity: "80g" },
      { name: "番茄", quantity: "60g" },
      { name: "洋蔥", quantity: "20g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "香草", quantity: "2g" },
      { name: "鹽", quantity: "1g" }
    ],
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

// Pork Breakfast Recipes (Lean Pork)
export const porkBreakfastRecipes: Record<string, RecipeData> = {
  "p1": {
    protein_type: "pork",
    category: "breakfast",
    id: "p1",
    name: "香煎瘦豬肉蛋白碗",
    kcal: 310,
    protein: 44,
    fat: 7,
    carbs: 16,
    totalWeight: 380,
    ingredients: [
      { name: "瘦豬肉", quantity: "140g" },
      { name: "蛋白", quantity: "2個" },
      { name: "番茄", quantity: "80g" },
      { name: "菠菜", quantity: "50g" },
      { name: "洋蔥", quantity: "25g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "瘦豬肉切成小塊，用中火煎至半熟",
      "加入蛋白攪拌均勻",
      "加入番茄、菠菜和洋蔥",
      "繼續煎至豬肉熟透，蛋白凝固",
      "調味後盛碟享用"
    ],
    fatLossTips: [
      "瘦豬肉高蛋白低脂，飽腹感強",
      "蛋白無脂肪，完美減肥食材",
      "菠菜含鐵質，提升新陳代謝"
    ]
  },
  "p2": {
    protein_type: "pork",
    category: "breakfast",
    id: "p2",
    name: "豬里肌牛油果吐司",
    kcal: 360,
    protein: 40,
    fat: 11,
    carbs: 28,
    totalWeight: 410,
    ingredients: [
      { name: "豬里肌", quantity: "110g" },
      { name: "全麥吐司", quantity: "2片（60g）" },
      { name: "牛油果", quantity: "1/2個（60g）" },
      { name: "番茄", quantity: "60g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "黑椒", quantity: "0.5g" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "將豬里肌煎熟後切成薄片",
      "全麥吐司放入烤麵包機烤至金黃",
      "牛油果切半，用叉子壓成泥狀",
      "在吐司上塗上牛油果泥",
      "放上豬肉片和番茄片，淋上檸檬汁"
    ],
    fatLossTips: [
      "豬里肌是瘦肉部位，脂肪含量低",
      "全麥吐司富含纖維，增加飽腹感",
      "牛油果含健康脂肪，促進脂肪燃燒"
    ]
  },
  "p3": {
    protein_type: "pork",
    category: "breakfast",
    id: "p3",
    name: "瘦肉菠菜蛋白炒",
    kcal: 300,
    protein: 42,
    fat: 6,
    carbs: 14,
    totalWeight: 360,
    ingredients: [
      { name: "瘦豬肉", quantity: "130g" },
      { name: "蛋白", quantity: "3個" },
      { name: "菠菜", quantity: "70g" },
      { name: "洋蔥", quantity: "25g" },
      { name: "大蒜", quantity: "5g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "瘦豬肉切成小塊，先炒至半熟",
      "加入洋蔥和大蒜爆香",
      "加入菠菜炒軟",
      "蛋白打散倒入，快速炒至熟透",
      "調味後盛碟"
    ],
    fatLossTips: [
      "瘦豬肉高蛋白低脂，完美減肥食材",
      "蛋白無脂肪，增加蛋白質攝入",
      "菠菜含鐵質和葉綠素，促進代謝"
    ]
  },
  "p4": {
    protein_type: "pork",
    category: "breakfast",
    id: "p4",
    name: "豬肉番茄早餐碗",
    kcal: 330,
    protein: 40,
    fat: 8,
    carbs: 20,
    totalWeight: 390,
    ingredients: [
      { name: "瘦豬肉", quantity: "130g" },
      { name: "番茄", quantity: "150g" },
      { name: "生菜", quantity: "50g" },
      { name: "小黃瓜", quantity: "60g" },
      { name: "紫洋蔥", quantity: "20g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "將瘦豬肉煎熟後切成塊狀",
      "番茄、小黃瓜切塊",
      "生菜撕成適當大小",
      "混合所有材料",
      "淋上橄欖油和醋調味"
    ],
    fatLossTips: [
      "瘦豬肉高蛋白低脂，飽腹感強",
      "番茄含番茄紅素，強大抗氧化劑",
      "生菜低卡高纖，完美減肥食材"
    ]
  },
  "p5": {
    protein_type: "pork",
    category: "breakfast",
    id: "p5",
    name: "豬肉生菜卷",
    kcal: 280,
    protein: 38,
    fat: 5,
    carbs: 12,
    totalWeight: 340,
    ingredients: [
      { name: "瘦豬肉", quantity: "120g" },
      { name: "生菜葉", quantity: "4片（80g）" },
      { name: "番茄", quantity: "60g" },
      { name: "小黃瓜", quantity: "50g" },
      { name: "紫洋蔥", quantity: "20g" },
      { name: "低脂優格", quantity: "2湯匙（30g）" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "瘦豬肉煎熟後切成條狀",
      "生菜葉洗淨瀝乾",
      "蔬菜切成條狀",
      "在生菜葉上放豬肉和蔬菜",
      "淋上優格和檸檬汁，捲起享用"
    ],
    fatLossTips: [
      "生菜低卡高纖，完美減肥食材",
      "瘦豬肉高蛋白低脂，飽腹感強",
      "優格含益生菌，改善腸道健康"
    ]
  },
  "p6": {
    protein_type: "pork",
    category: "breakfast",
    id: "p6",
    name: "瘦肉粟米蛋白粥",
    kcal: 320,
    protein: 40,
    fat: 6,
    carbs: 28,
    totalWeight: 480,
    ingredients: [
      { name: "瘦豬肉", quantity: "100g" },
      { name: "蛋白", quantity: "2個" },
      { name: "粟米", quantity: "60g" },
      { name: "米", quantity: "40g（乾）" },
      { name: "高湯", quantity: "400ml" },
      { name: "洋蔥", quantity: "25g" },
      { name: "鹽", quantity: "2g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "米洗淨，用高湯煮軟",
      "瘦豬肉切成小塊，加入煮",
      "加入粟米和洋蔥",
      "繼續煮至粥軟爛",
      "蛋白打散倒入，快速攪拌至熟"
    ],
    fatLossTips: [
      "瘦豬肉高蛋白低脂，完美減肥食材",
      "粟米含纖維，促進消化",
      "蛋白無脂肪，增加蛋白質攝入"
    ]
  },
  "p7": {
    protein_type: "pork",
    category: "breakfast",
    id: "p7",
    name: "豬肉藜麥早餐碗",
    kcal: 350,
    protein: 38,
    fat: 9,
    carbs: 32,
    totalWeight: 440,
    ingredients: [
      { name: "瘦豬肉", quantity: "110g" },
      { name: "藜麥", quantity: "50g（乾）" },
      { name: "彩椒", quantity: "70g" },
      { name: "黑豆", quantity: "40g（罐裝）" },
      { name: "玉米", quantity: "30g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "藜麥按包裝指示煮熟",
      "瘦豬肉切成小塊，用中火煎至熟透",
      "彩椒切丁",
      "混合藜麥、豬肉、彩椒和黑豆",
      "淋上橄欖油和檸檬汁"
    ],
    fatLossTips: [
      "藜麥是完全蛋白質，含所有必需胺基酸",
      "黑豆富含纖維，促進腸道健康",
      "瘦豬肉高蛋白低脂，飽腹感強"
    ]
  },
  "p8": {
    protein_type: "pork",
    category: "breakfast",
    id: "p8",
    name: "豬肉蘑菇炒蛋白",
    kcal: 310,
    protein: 42,
    fat: 5,
    carbs: 12,
    totalWeight: 360,
    ingredients: [
      { name: "瘦豬肉", quantity: "120g" },
      { name: "蛋白", quantity: "3個" },
      { name: "蘑菇", quantity: "150g" },
      { name: "洋蔥", quantity: "30g" },
      { name: "大蒜", quantity: "5g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "瘦豬肉切成小塊，先炒至半熟",
      "加入切片蘑菇和洋蔥",
      "蛋白打散，倒入鍋中",
      "快速炒至蛋白熟透",
      "加入大蒜和調味料完成"
    ],
    fatLossTips: [
      "蘑菇含維生素D，促進鈣質吸收",
      "蛋白無脂肪，完美減肥食材",
      "瘦豬肉高蛋白低脂，飽腹感強"
    ]
  },
  "p9": {
    protein_type: "pork",
    category: "breakfast",
    id: "p9",
    name: "豬肉全麥三文治",
    kcal: 340,
    protein: 38,
    fat: 8,
    carbs: 26,
    totalWeight: 400,
    ingredients: [
      { name: "瘦豬肉", quantity: "110g" },
      { name: "全麥麵包", quantity: "2片（60g）" },
      { name: "低脂芝士", quantity: "1片（20g）" },
      { name: "番茄", quantity: "70g" },
      { name: "生菜", quantity: "40g" },
      { name: "黃芥末", quantity: "1湯匙（15g）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "瘦豬肉煎熟後切成薄片",
      "全麥麵包輕輕烤一下",
      "在麵包上塗黃芥末",
      "放上生菜、番茄、豬肉和低脂芝士",
      "蓋上另一片麵包即可"
    ],
    fatLossTips: [
      "瘦豬肉高蛋白低脂，飽腹感強",
      "全麥麵包富含纖維，增加飽腹感",
      "低脂芝士提供鈣質，同時控制熱量"
    ]
  },
  "p10": {
    protein_type: "pork",
    category: "breakfast",
    id: "p10",
    name: "豬肉青瓜乳酪碗",
    kcal: 290,
    protein: 40,
    fat: 5,
    carbs: 14,
    totalWeight: 370,
    ingredients: [
      { name: "瘦豬肉", quantity: "130g" },
      { name: "希臘優格", quantity: "150g" },
      { name: "青瓜", quantity: "80g" },
      { name: "番茄", quantity: "60g" },
      { name: "洋蔥", quantity: "20g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "香草", quantity: "2g" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "瘦豬肉煎熟後切成塊狀",
      "青瓜切成小塊",
      "番茄切丁",
      "在碗中混合優格、檸檬汁和香草",
      "加入豬肉和蔬菜，輕輕混合"
    ],
    fatLossTips: [
      "瘦豬肉高蛋白低脂，飽腹感強",
      "希臘優格蛋白質高，脂肪低",
      "青瓜含95%水分，超低卡"
    ]
  }
};

// Beef Breakfast Recipes
export const beefBreakfastRecipes: Record<string, RecipeData> = {
  "b1": {
    protein_type: "beef",
    category: "breakfast",
    id: "b1",
    name: "牛肉早餐碗",
    kcal: 360,
    protein: 42,
    fat: 13,
    carbs: 18,
    totalWeight: 410,
    ingredients: [
      { name: "牛肉", quantity: "130g" },
      { name: "蛋", quantity: "1個" },
      { name: "番茄", quantity: "80g" },
      { name: "菠菜", quantity: "50g" },
      { name: "洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "牛肉用中火煎至半熟",
      "加入蛋煎至半熟",
      "加入番茄、菠菜和洋蔥",
      "繼續煎至牛肉熟透",
      "調味後盛碟享用"
    ],
    fatLossTips: [
      "牛肉含豐富鐵質，提升血紅素",
      "菠菜含鐵質，提升新陳代謝",
      "番茄低卡高纖，促進消化"
    ]
  },
  "b2": {
    protein_type: "beef",
    category: "breakfast",
    id: "b2",
    name: "牛肉全麥吐司",
    kcal: 390,
    protein: 38,
    fat: 15,
    carbs: 28,
    totalWeight: 430,
    ingredients: [
      { name: "牛肉", quantity: "110g" },
      { name: "全麥吐司", quantity: "2片（60g）" },
      { name: "牛油果", quantity: "1/2個（60g）" },
      { name: "番茄", quantity: "60g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "黑椒", quantity: "0.5g" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "將牛肉煎熟後切成薄片",
      "全麥吐司放入烤麵包機烤至金黃",
      "牛油果切半，用叉子壓成泥狀",
      "在吐司上塗上牛油果泥",
      "放上牛肉片和番茄片，淋上檸檬汁"
    ],
    fatLossTips: [
      "全麥吐司富含纖維，增加飽腹感",
      "牛油果含健康脂肪，促進脂肪燃燒",
      "檸檬汁幫助消化，加快代謝"
    ]
  },
  "b3": {
    protein_type: "beef",
    category: "breakfast",
    id: "b3",
    name: "牛肉菠菜蛋白捲",
    kcal: 330,
    protein: 40,
    fat: 12,
    carbs: 15,
    totalWeight: 380,
    ingredients: [
      { name: "牛肉", quantity: "110g" },
      { name: "蛋白", quantity: "3個" },
      { name: "菠菜", quantity: "60g" },
      { name: "起司", quantity: "20g" },
      { name: "洋蔥", quantity: "25g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "將蛋白打成蛋液",
      "在平底鍋倒入蛋液，搖晃至半熟",
      "加入菠菜和洋蔥，繼續煮",
      "放上牛肉片和起司",
      "捲起蛋捲，切成適當大小"
    ],
    fatLossTips: [
      "蛋白卷低脂高蛋白，完美早餐",
      "菠菜含葉綠素，幫助排毒",
      "起司提供鈣質，強化骨骼"
    ]
  },
  "b4": {
    protein_type: "beef",
    category: "breakfast",
    id: "b4",
    name: "牛肉番茄沙律碗",
    kcal: 370,
    protein: 39,
    fat: 13,
    carbs: 20,
    totalWeight: 420,
    ingredients: [
      { name: "牛肉", quantity: "130g" },
      { name: "番茄", quantity: "150g" },
      { name: "生菜", quantity: "50g" },
      { name: "小黃瓜", quantity: "60g" },
      { name: "紫洋蔥", quantity: "20g" },
      { name: "橄欖油", quantity: "1湯匙（15ml）" },
      { name: "醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "將牛肉煎熟後切成塊狀",
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
  "b5": {
    protein_type: "beef",
    category: "breakfast",
    id: "b5",
    name: "牛肉藜麥早餐碗",
    kcal: 380,
    protein: 36,
    fat: 14,
    carbs: 32,
    totalWeight: 470,
    ingredients: [
      { name: "牛肉", quantity: "110g" },
      { name: "藜麥", quantity: "50g（乾）" },
      { name: "彩椒", quantity: "60g" },
      { name: "黑豆", quantity: "40g（罐裝）" },
      { name: "玉米", quantity: "30g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "藜麥按包裝指示煮熟",
      "牛肉切成小塊，用中火煎至熟透",
      "彩椒切丁",
      "混合藜麥、牛肉、彩椒和黑豆",
      "淋上橄欖油和檸檬汁"
    ],
    fatLossTips: [
      "藜麥是完全蛋白質，含所有必需胺基酸",
      "黑豆富含纖維，促進腸道健康",
      "彩椒含維生素C，提升免疫力"
    ]
  },
  "b6": {
    protein_type: "beef",
    category: "breakfast",
    id: "b6",
    name: "牛肉蘑菇炒蛋",
    kcal: 350,
    protein: 41,
    fat: 13,
    carbs: 12,
    totalWeight: 400,
    ingredients: [
      { name: "牛肉", quantity: "110g" },
      { name: "蛋", quantity: "2個" },
      { name: "蘑菇", quantity: "150g" },
      { name: "洋蔥", quantity: "30g" },
      { name: "大蒜", quantity: "5g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "牛肉切成小塊，先炒至半熟",
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
  "b7": {
    protein_type: "beef",
    category: "breakfast",
    id: "b7",
    name: "牛肉低脂芝士三文治",
    kcal: 370,
    protein: 37,
    fat: 14,
    carbs: 26,
    totalWeight: 430,
    ingredients: [
      { name: "牛肉", quantity: "110g" },
      { name: "全麥麵包", quantity: "2片（60g）" },
      { name: "低脂芝士", quantity: "1片（20g）" },
      { name: "番茄", quantity: "60g" },
      { name: "生菜", quantity: "30g" },
      { name: "黃芥末", quantity: "1湯匙（15g）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "牛肉煎熟後切成薄片",
      "全麥麵包輕輕烤一下",
      "在麵包上塗黃芥末",
      "放上生菜、番茄、牛肉和低脂芝士",
      "蓋上另一片麵包即可"
    ],
    fatLossTips: [
      "低脂芝士提供鈣質，同時控制熱量",
      "黃芥末無熱量，增加風味",
      "全麥麵包提供複雜碳水化合物"
    ]
  },
  "b8": {
    protein_type: "beef",
    category: "breakfast",
    id: "b8",
    name: "牛肉蔬菜卷餅",
    kcal: 340,
    protein: 38,
    fat: 12,
    carbs: 22,
    totalWeight: 410,
    ingredients: [
      { name: "牛肉", quantity: "110g" },
      { name: "全麥卷餅", quantity: "2張（80g）" },
      { name: "生菜", quantity: "40g" },
      { name: "番茄", quantity: "60g" },
      { name: "洋蔥", quantity: "25g" },
      { name: "青椒", quantity: "40g" },
      { name: "低脂優格", quantity: "2湯匙（30g）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "牛肉煎熟後切成條狀",
      "全麥卷餅微波加熱",
      "蔬菜切成條狀",
      "在卷餅上放生菜、蔬菜和牛肉",
      "淋上低脂優格，捲起享用"
    ],
    fatLossTips: [
      "全麥卷餅富含纖維，促進消化",
      "優格含益生菌，改善腸道健康",
      "生蔬菜提供豐富微量營養素"
    ]
  },
  "b9": {
    protein_type: "beef",
    category: "breakfast",
    id: "b9",
    name: "牛肉燕麥鹹粥",
    kcal: 360,
    protein: 35,
    fat: 13,
    carbs: 30,
    totalWeight: 540,
    ingredients: [
      { name: "牛肉", quantity: "90g" },
      { name: "燕麥", quantity: "50g（乾）" },
      { name: "高湯", quantity: "500ml" },
      { name: "洋蔥", quantity: "30g" },
      { name: "胡蘿蔔", quantity: "40g" },
      { name: "香菇", quantity: "50g" },
      { name: "鹽", quantity: "2g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "燕麥用高湯煮軟",
      "牛肉切成小塊，加入煮",
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
  "b10": {
    protein_type: "beef",
    category: "breakfast",
    id: "b10",
    name: "牛肉青瓜乳酪碗",
    kcal: 320,
    protein: 40,
    fat: 11,
    carbs: 14,
    totalWeight: 400,
    ingredients: [
      { name: "牛肉", quantity: "130g" },
      { name: "希臘優格", quantity: "150g" },
      { name: "青瓜", quantity: "80g" },
      { name: "番茄", quantity: "60g" },
      { name: "洋蔥", quantity: "20g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "香草", quantity: "2g" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "牛肉煎熟後切成塊狀",
      "青瓜切成小塊",
      "番茄切丁",
      "在碗中混合優格、檸檬汁和香草",
      "加入牛肉和蔬菜，輕輕混合"
    ],
    fatLossTips: [
      "希臘優格蛋白質高，脂肪低",
      "青瓜含95%水分，超低卡",
      "檸檬增加風味，無需額外鹽分"
    ]
  }
};

// Seafood Breakfast Recipes
export const seafoodBreakfastRecipes: Record<string, RecipeData> = {
  "s1": {
    protein_type: "seafood",
    category: "breakfast",
    id: "s1",
    name: "三文魚早餐碗",
    kcal: 340,
    protein: 38,
    fat: 12,
    carbs: 18,
    totalWeight: 400,
    ingredients: [
      { name: "三文魚", quantity: "120g" },
      { name: "蛋", quantity: "1個" },
      { name: "番茄", quantity: "80g" },
      { name: "菠菜", quantity: "50g" },
      { name: "洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "三文魚用中火煎至半熟",
      "加入蛋煎至半熟",
      "加入番茄、菠菜和洋蔥",
      "繼續煎至三文魚熟透",
      "調味後盛碟享用"
    ],
    fatLossTips: [
      "三文魚含Omega-3，保護心臟健康",
      "菠菜含鐵質，提升新陳代謝",
      "番茄低卡高纖，促進消化"
    ]
  },
  "s2": {
    protein_type: "seafood",
    category: "breakfast",
    id: "s2",
    name: "三文魚全麥吐司",
    kcal: 380,
    protein: 36,
    fat: 14,
    carbs: 28,
    totalWeight: 420,
    ingredients: [
      { name: "三文魚", quantity: "100g" },
      { name: "全麥吐司", quantity: "2片（60g）" },
      { name: "牛油果", quantity: "1/2個（60g）" },
      { name: "番茄", quantity: "60g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "黑椒", quantity: "0.5g" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "將三文魚煎熟後切成薄片",
      "全麥吐司放入烤麵包機烤至金黃",
      "牛油果切半，用叉子壓成泥狀",
      "在吐司上塗上牛油果泥",
      "放上三文魚片和番茄片，淋上檸檬汁"
    ],
    fatLossTips: [
      "全麥吐司富含纖維，增加飽腹感",
      "牛油果含健康脂肪，促進脂肪燃燒",
      "檸檬汁幫助消化，加快代謝"
    ]
  },
  "s3": {
    protein_type: "seafood",
    category: "breakfast",
    id: "s3",
    name: "蝦仁菠菜蛋白捲",
    kcal: 310,
    protein: 40,
    fat: 8,
    carbs: 15,
    totalWeight: 360,
    ingredients: [
      { name: "蝦仁", quantity: "100g" },
      { name: "蛋白", quantity: "3個" },
      { name: "菠菜", quantity: "60g" },
      { name: "起司", quantity: "20g" },
      { name: "洋蔥", quantity: "25g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "將蛋白打成蛋液",
      "在平底鍋倒入蛋液，搖晃至半熟",
      "加入菠菜和洋蔥，繼續煮",
      "放上蝦仁和起司",
      "捲起蛋捲，切成適當大小"
    ],
    fatLossTips: [
      "蛋白卷低脂高蛋白，完美早餐",
      "菠菜含葉綠素，幫助排毒",
      "起司提供鈣質，強化骨骼"
    ]
  },
  "s4": {
    protein_type: "seafood",
    category: "breakfast",
    id: "s4",
    name: "蝦仁番茄沙律碗",
    kcal: 330,
    protein: 38,
    fat: 9,
    carbs: 20,
    totalWeight: 400,
    ingredients: [
      { name: "蝦仁", quantity: "120g" },
      { name: "番茄", quantity: "150g" },
      { name: "生菜", quantity: "50g" },
      { name: "小黃瓜", quantity: "60g" },
      { name: "紫洋蔥", quantity: "20g" },
      { name: "橄欖油", quantity: "1湯匙（15ml）" },
      { name: "醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "將蝦仁煮熟",
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
  "s5": {
    protein_type: "seafood",
    category: "breakfast",
    id: "s5",
    name: "蝦仁藜麥早餐碗",
    kcal: 350,
    protein: 36,
    fat: 10,
    carbs: 32,
    totalWeight: 450,
    ingredients: [
      { name: "蝦仁", quantity: "100g" },
      { name: "藜麥", quantity: "50g（乾）" },
      { name: "彩椒", quantity: "60g" },
      { name: "黑豆", quantity: "40g（罐裝）" },
      { name: "玉米", quantity: "30g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "藜麥按包裝指示煮熟",
      "蝦仁用中火煎至熟透",
      "彩椒切丁",
      "混合藜麥、蝦仁、彩椒和黑豆",
      "淋上橄欖油和檸檬汁"
    ],
    fatLossTips: [
      "藜麥是完全蛋白質，含所有必需胺基酸",
      "黑豆富含纖維，促進腸道健康",
      "彩椒含維生素C，提升免疫力"
    ]
  },
  "s6": {
    protein_type: "seafood",
    category: "breakfast",
    id: "s6",
    name: "蝦仁蘑菇炒蛋",
    kcal: 320,
    protein: 40,
    fat: 9,
    carbs: 12,
    totalWeight: 380,
    ingredients: [
      { name: "蝦仁", quantity: "100g" },
      { name: "蛋", quantity: "2個" },
      { name: "蘑菇", quantity: "150g" },
      { name: "洋蔥", quantity: "30g" },
      { name: "大蒜", quantity: "5g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "蝦仁先炒至半熟",
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
  "s7": {
    protein_type: "seafood",
    category: "breakfast",
    id: "s7",
    name: "蝦仁低脂芝士三文治",
    kcal: 340,
    protein: 35,
    fat: 10,
    carbs: 26,
    totalWeight: 410,
    ingredients: [
      { name: "蝦仁", quantity: "100g" },
      { name: "全麥麵包", quantity: "2片（60g）" },
      { name: "低脂芝士", quantity: "1片（20g）" },
      { name: "番茄", quantity: "60g" },
      { name: "生菜", quantity: "30g" },
      { name: "黃芥末", quantity: "1湯匙（15g）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "蝦仁煮熟後切成適當大小",
      "全麥麵包輕輕烤一下",
      "在麵包上塗黃芥末",
      "放上生菜、番茄、蝦仁和低脂芝士",
      "蓋上另一片麵包即可"
    ],
    fatLossTips: [
      "低脂芝士提供鈣質，同時控制熱量",
      "黃芥末無熱量，增加風味",
      "全麥麵包提供複雜碳水化合物"
    ]
  },
  "s8": {
    protein_type: "seafood",
    category: "breakfast",
    id: "s8",
    name: "蝦仁蔬菜卷餅",
    kcal: 310,
    protein: 36,
    fat: 8,
    carbs: 22,
    totalWeight: 390,
    ingredients: [
      { name: "蝦仁", quantity: "100g" },
      { name: "全麥卷餅", quantity: "2張（80g）" },
      { name: "生菜", quantity: "40g" },
      { name: "番茄", quantity: "60g" },
      { name: "洋蔥", quantity: "25g" },
      { name: "青椒", quantity: "40g" },
      { name: "低脂優格", quantity: "2湯匙（30g）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "蝦仁煮熟後切成適當大小",
      "全麥卷餅微波加熱",
      "蔬菜切成條狀",
      "在卷餅上放生菜、蔬菜和蝦仁",
      "淋上低脂優格，捲起享用"
    ],
    fatLossTips: [
      "全麥卷餅富含纖維，促進消化",
      "優格含益生菌，改善腸道健康",
      "生蔬菜提供豐富微量營養素"
    ]
  },
  "s9": {
    protein_type: "seafood",
    category: "breakfast",
    id: "s9",
    name: "蝦仁燕麥鹹粥",
    kcal: 330,
    protein: 34,
    fat: 9,
    carbs: 30,
    totalWeight: 520,
    ingredients: [
      { name: "蝦仁", quantity: "80g" },
      { name: "燕麥", quantity: "50g（乾）" },
      { name: "高湯", quantity: "500ml" },
      { name: "洋蔥", quantity: "30g" },
      { name: "胡蘿蔔", quantity: "40g" },
      { name: "香菇", quantity: "50g" },
      { name: "鹽", quantity: "2g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "燕麥用高湯煮軟",
      "蝦仁加入煮",
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
  "s10": {
    protein_type: "seafood",
    category: "breakfast",
    id: "s10",
    name: "蝦仁青瓜乳酪碗",
    kcal: 300,
    protein: 38,
    fat: 7,
    carbs: 14,
    totalWeight: 380,
    ingredients: [
      { name: "蝦仁", quantity: "120g" },
      { name: "希臘優格", quantity: "150g" },
      { name: "青瓜", quantity: "80g" },
      { name: "番茄", quantity: "60g" },
      { name: "洋蔥", quantity: "20g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "香草", quantity: "2g" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "蝦仁煮熟後切成適當大小",
      "青瓜切成小塊",
      "番茄切丁",
      "在碗中混合優格、檸檬汁和香草",
      "加入蝦仁和蔬菜，輕輕混合"
    ],
    fatLossTips: [
      "希臘優格蛋白質高，脂肪低",
      "青瓜含95%水分，超低卡",
      "檸檬增加風味，無需額外鹽分"
    ]
  }
};

// Egg Breakfast Recipes
export const eggBreakfastRecipes: Record<string, RecipeData> = {
  "e1": {
    protein_type: "egg",
    category: "breakfast",
    id: "e1",
    name: "菠菜炒蛋早餐碗",
    kcal: 280,
    protein: 32,
    fat: 10,
    carbs: 18,
    totalWeight: 360,
    ingredients: [
      { name: "蛋", quantity: "3個" },
      { name: "菠菜", quantity: "80g" },
      { name: "番茄", quantity: "60g" },
      { name: "洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "蛋打散",
      "用中火煎至半熟",
      "加入菠菜、番茄和洋蔥",
      "繼續炒至蛋熟透",
      "調味後盛碟享用"
    ],
    fatLossTips: [
      "蛋含膽鹼，幫助脂肪代謝",
      "菠菜含鐵質，提升新陳代謝",
      "番茄低卡高纖，促進消化"
    ]
  },
  "e2": {
    protein_type: "egg",
    category: "breakfast",
    id: "e2",
    name: "蛋白全麥吐司",
    kcal: 320,
    protein: 30,
    fat: 11,
    carbs: 28,
    totalWeight: 390,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "全麥吐司", quantity: "2片（60g）" },
      { name: "牛油果", quantity: "1/2個（60g）" },
      { name: "番茄", quantity: "60g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "黑椒", quantity: "0.5g" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "將蛋白煎熟",
      "全麥吐司放入烤麵包機烤至金黃",
      "牛油果切半，用叉子壓成泥狀",
      "在吐司上塗上牛油果泥",
      "放上蛋白和番茄片，淋上檸檬汁"
    ],
    fatLossTips: [
      "全麥吐司富含纖維，增加飽腹感",
      "牛油果含健康脂肪，促進脂肪燃燒",
      "檸檬汁幫助消化，加快代謝"
    ]
  },
  "e3": {
    protein_type: "egg",
    category: "breakfast",
    id: "e3",
    name: "蛋白菠菜捲",
    kcal: 260,
    protein: 32,
    fat: 7,
    carbs: 15,
    totalWeight: 340,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "菠菜", quantity: "80g" },
      { name: "起司", quantity: "15g" },
      { name: "洋蔥", quantity: "25g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "將蛋白打成蛋液",
      "在平底鍋倒入蛋液，搖晃至半熟",
      "加入菠菜和洋蔥，繼續煮",
      "放上起司",
      "捲起蛋捲，切成適當大小"
    ],
    fatLossTips: [
      "蛋白卷低脂高蛋白，完美早餐",
      "菠菜含葉綠素，幫助排毒",
      "起司提供鈣質，強化骨骼"
    ]
  },
  "e4": {
    protein_type: "egg",
    category: "breakfast",
    id: "e4",
    name: "蛋白番茄沙律碗",
    kcal: 290,
    protein: 31,
    fat: 8,
    carbs: 20,
    totalWeight: 380,
    ingredients: [
      { name: "蛋", quantity: "3個" },
      { name: "番茄", quantity: "150g" },
      { name: "生菜", quantity: "50g" },
      { name: "小黃瓜", quantity: "60g" },
      { name: "紫洋蔥", quantity: "20g" },
      { name: "橄欖油", quantity: "1湯匙（15ml）" },
      { name: "醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "將蛋煎熟後切成塊狀",
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
  "e5": {
    protein_type: "egg",
    category: "breakfast",
    id: "e5",
    name: "蛋藜麥早餐碗",
    kcal: 310,
    protein: 28,
    fat: 9,
    carbs: 32,
    totalWeight: 430,
    ingredients: [
      { name: "蛋", quantity: "2個" },
      { name: "藜麥", quantity: "50g（乾）" },
      { name: "彩椒", quantity: "60g" },
      { name: "黑豆", quantity: "40g（罐裝）" },
      { name: "玉米", quantity: "30g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "藜麥按包裝指示煮熟",
      "蛋煎熟後切成塊狀",
      "彩椒切丁",
      "混合藜麥、蛋、彩椒和黑豆",
      "淋上橄欖油和檸檬汁"
    ],
    fatLossTips: [
      "藜麥是完全蛋白質，含所有必需胺基酸",
      "黑豆富含纖維，促進腸道健康",
      "彩椒含維生素C，提升免疫力"
    ]
  },
  "e6": {
    protein_type: "egg",
    category: "breakfast",
    id: "e6",
    name: "蘑菇炒蛋",
    kcal: 280,
    protein: 32,
    fat: 8,
    carbs: 12,
    totalWeight: 360,
    ingredients: [
      { name: "蛋", quantity: "3個" },
      { name: "蘑菇", quantity: "150g" },
      { name: "洋蔥", quantity: "30g" },
      { name: "大蒜", quantity: "5g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "先炒蘑菇和洋蔥",
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
  "e7": {
    protein_type: "egg",
    category: "breakfast",
    id: "e7",
    name: "蛋低脂芝士三文治",
    kcal: 300,
    protein: 27,
    fat: 9,
    carbs: 26,
    totalWeight: 390,
    ingredients: [
      { name: "蛋", quantity: "2個" },
      { name: "全麥麵包", quantity: "2片（60g）" },
      { name: "低脂芝士", quantity: "1片（20g）" },
      { name: "番茄", quantity: "60g" },
      { name: "生菜", quantity: "30g" },
      { name: "黃芥末", quantity: "1湯匙（15g）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "蛋煎熟後切成薄片",
      "全麥麵包輕輕烤一下",
      "在麵包上塗黃芥末",
      "放上生菜、番茄、蛋和低脂芝士",
      "蓋上另一片麵包即可"
    ],
    fatLossTips: [
      "低脂芝士提供鈣質，同時控制熱量",
      "黃芥末無熱量，增加風味",
      "全麥麵包提供複雜碳水化合物"
    ]
  },
  "e8": {
    protein_type: "egg",
    category: "breakfast",
    id: "e8",
    name: "蛋蔬菜卷餅",
    kcal: 270,
    protein: 28,
    fat: 7,
    carbs: 22,
    totalWeight: 370,
    ingredients: [
      { name: "蛋", quantity: "2個" },
      { name: "全麥卷餅", quantity: "2張（80g）" },
      { name: "生菜", quantity: "40g" },
      { name: "番茄", quantity: "60g" },
      { name: "洋蔥", quantity: "25g" },
      { name: "青椒", quantity: "40g" },
      { name: "低脂優格", quantity: "2湯匙（30g）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "蛋煎熟後切成條狀",
      "全麥卷餅微波加熱",
      "蔬菜切成條狀",
      "在卷餅上放生菜、蔬菜和蛋",
      "淋上低脂優格，捲起享用"
    ],
    fatLossTips: [
      "全麥卷餅富含纖維，促進消化",
      "優格含益生菌，改善腸道健康",
      "生蔬菜提供豐富微量營養素"
    ]
  },
  "e9": {
    protein_type: "egg",
    category: "breakfast",
    id: "e9",
    name: "蛋燕麥鹹粥",
    kcal: 290,
    protein: 26,
    fat: 8,
    carbs: 30,
    totalWeight: 500,
    ingredients: [
      { name: "蛋", quantity: "2個" },
      { name: "燕麥", quantity: "50g（乾）" },
      { name: "高湯", quantity: "500ml" },
      { name: "洋蔥", quantity: "30g" },
      { name: "胡蘿蔔", quantity: "40g" },
      { name: "香菇", quantity: "50g" },
      { name: "鹽", quantity: "2g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "燕麥用高湯煮軟",
      "蛋打散，加入煮",
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
  "e10": {
    protein_type: "egg",
    category: "breakfast",
    id: "e10",
    name: "蛋青瓜乳酪碗",
    kcal: 260,
    protein: 30,
    fat: 6,
    carbs: 14,
    totalWeight: 360,
    ingredients: [
      { name: "蛋", quantity: "2個" },
      { name: "希臘優格", quantity: "150g" },
      { name: "青瓜", quantity: "80g" },
      { name: "番茄", quantity: "60g" },
      { name: "洋蔥", quantity: "20g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "香草", quantity: "2g" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "蛋煎熟後切成塊狀",
      "青瓜切成小塊",
      "番茄切丁",
      "在碗中混合優格、檸檬汁和香草",
      "加入蛋和蔬菜，輕輕混合"
    ],
    fatLossTips: [
      "希臘優格蛋白質高，脂肪低",
      "青瓜含95%水分，超低卡",
      "檸檬增加風味，無需額外鹽分"
    ]
  }
};

// Vegetarian Breakfast Recipes
export const vegetarianBreakfastRecipes: Record<string, RecipeData> = {
  "v1": {
    protein_type: "vegetarian",
    category: "breakfast",
    id: "v1",
    name: "豆腐菠菜早餐碗",
    kcal: 260,
    protein: 28,
    fat: 8,
    carbs: 18,
    totalWeight: 360,
    ingredients: [
      { name: "豆腐", quantity: "150g" },
      { name: "菠菜", quantity: "80g" },
      { name: "番茄", quantity: "60g" },
      { name: "洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "豆腐切成小塊",
      "用中火炒至半熟",
      "加入菠菜、番茄和洋蔥",
      "繼續炒至豆腐熟透",
      "調味後盛碟享用"
    ],
    fatLossTips: [
      "豆腐含植物蛋白，低脂肪",
      "菠菜含鐵質，提升新陳代謝",
      "番茄低卡高纖，促進消化"
    ]
  },
  "v2": {
    protein_type: "vegetarian",
    category: "breakfast",
    id: "v2",
    name: "牛油果全麥吐司",
    kcal: 340,
    protein: 12,
    fat: 14,
    carbs: 38,
    totalWeight: 380,
    ingredients: [
      { name: "全麥吐司", quantity: "2片（60g）" },
      { name: "牛油果", quantity: "1個（120g）" },
      { name: "番茄", quantity: "80g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "黑椒", quantity: "0.5g" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "全麥吐司放入烤麵包機烤至金黃",
      "牛油果切半，用叉子壓成泥狀",
      "在吐司上塗上牛油果泥",
      "放上番茄片，淋上檸檬汁",
      "調味後享用"
    ],
    fatLossTips: [
      "全麥吐司富含纖維，增加飽腹感",
      "牛油果含健康脂肪，促進脂肪燃燒",
      "檸檬汁幫助消化，加快代謝"
    ]
  },
  "v3": {
    protein_type: "vegetarian",
    category: "breakfast",
    id: "v3",
    name: "菠菜豆腐捲",
    kcal: 240,
    protein: 26,
    fat: 6,
    carbs: 15,
    totalWeight: 340,
    ingredients: [
      { name: "豆腐", quantity: "150g" },
      { name: "菠菜", quantity: "80g" },
      { name: "起司", quantity: "15g" },
      { name: "洋蔥", quantity: "25g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "豆腐切成薄片",
      "加入菠菜和洋蔥",
      "放上起司",
      "捲起豆腐捲，切成適當大小"
    ],
    fatLossTips: [
      "豆腐卷低脂高蛋白，完美早餐",
      "菠菜含葉綠素，幫助排毒",
      "起司提供鈣質，強化骨骼"
    ]
  },
  "v4": {
    protein_type: "vegetarian",
    category: "breakfast",
    id: "v4",
    name: "番茄沙律碗",
    kcal: 270,
    protein: 8,
    fat: 10,
    carbs: 28,
    totalWeight: 380,
    ingredients: [
      { name: "番茄", quantity: "200g" },
      { name: "生菜", quantity: "60g" },
      { name: "小黃瓜", quantity: "80g" },
      { name: "紫洋蔥", quantity: "25g" },
      { name: "橄欖油", quantity: "1湯匙（15ml）" },
      { name: "醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
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
  "v5": {
    protein_type: "vegetarian",
    category: "breakfast",
    id: "v5",
    name: "藜麥早餐碗",
    kcal: 290,
    protein: 12,
    fat: 8,
    carbs: 40,
    totalWeight: 420,
    ingredients: [
      { name: "藜麥", quantity: "60g（乾）" },
      { name: "彩椒", quantity: "80g" },
      { name: "黑豆", quantity: "50g（罐裝）" },
      { name: "玉米", quantity: "40g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "藜麥按包裝指示煮熟",
      "彩椒切丁",
      "混合藜麥、彩椒、黑豆和玉米",
      "淋上橄欖油和檸檬汁"
    ],
    fatLossTips: [
      "藜麥是完全蛋白質，含所有必需胺基酸",
      "黑豆富含纖維，促進腸道健康",
      "彩椒含維生素C，提升免疫力"
    ]
  },
  "v6": {
    protein_type: "vegetarian",
    category: "breakfast",
    id: "v6",
    name: "蘑菇炒豆腐",
    kcal: 260,
    protein: 26,
    fat: 7,
    carbs: 12,
    totalWeight: 360,
    ingredients: [
      { name: "豆腐", quantity: "150g" },
      { name: "蘑菇", quantity: "150g" },
      { name: "洋蔥", quantity: "30g" },
      { name: "大蒜", quantity: "5g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "先炒蘑菇和洋蔥",
      "加入豆腐塊",
      "快速炒至豆腐熟透",
      "加入大蒜和調味料完成"
    ],
    fatLossTips: [
      "蘑菇含維生素D，促進鈣質吸收",
      "豆腐含植物蛋白，低脂肪",
      "大蒜含硫化物，增強免疫力"
    ]
  },
  "v7": {
    protein_type: "vegetarian",
    category: "breakfast",
    id: "v7",
    name: "低脂芝士三文治",
    kcal: 280,
    protein: 12,
    fat: 8,
    carbs: 38,
    totalWeight: 380,
    ingredients: [
      { name: "全麥麵包", quantity: "2片（60g）" },
      { name: "低脂芝士", quantity: "1片（20g）" },
      { name: "番茄", quantity: "80g" },
      { name: "生菜", quantity: "40g" },
      { name: "黃芥末", quantity: "1湯匙（15g）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "全麥麵包輕輕烤一下",
      "在麵包上塗黃芥末",
      "放上生菜、番茄和低脂芝士",
      "蓋上另一片麵包即可"
    ],
    fatLossTips: [
      "低脂芝士提供鈣質，同時控制熱量",
      "黃芥末無熱量，增加風味",
      "全麥麵包提供複雜碳水化合物"
    ]
  },
  "v8": {
    protein_type: "vegetarian",
    category: "breakfast",
    id: "v8",
    name: "蔬菜卷餅",
    kcal: 250,
    protein: 8,
    fat: 6,
    carbs: 40,
    totalWeight: 360,
    ingredients: [
      { name: "全麥卷餅", quantity: "2張（80g）" },
      { name: "生菜", quantity: "50g" },
      { name: "番茄", quantity: "80g" },
      { name: "洋蔥", quantity: "30g" },
      { name: "青椒", quantity: "50g" },
      { name: "低脂優格", quantity: "2湯匙（30g）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "全麥卷餅微波加熱",
      "蔬菜切成條狀",
      "在卷餅上放生菜和蔬菜",
      "淋上低脂優格，捲起享用"
    ],
    fatLossTips: [
      "全麥卷餅富含纖維，促進消化",
      "優格含益生菌，改善腸道健康",
      "生蔬菜提供豐富微量營養素"
    ]
  },
  "v9": {
    protein_type: "vegetarian",
    category: "breakfast",
    id: "v9",
    name: "燕麥鹹粥",
    kcal: 270,
    protein: 10,
    fat: 6,
    carbs: 40,
    totalWeight: 480,
    ingredients: [
      { name: "燕麥", quantity: "60g（乾）" },
      { name: "高湯", quantity: "500ml" },
      { name: "洋蔥", quantity: "40g" },
      { name: "胡蘿蔔", quantity: "50g" },
      { name: "香菇", quantity: "60g" },
      { name: "鹽", quantity: "2g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "燕麥用高湯煮軟",
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
  "v10": {
    protein_type: "vegetarian",
    category: "breakfast",
    id: "v10",
    name: "青瓜乳酪碗",
    kcal: 240,
    protein: 12,
    fat: 5,
    carbs: 32,
    totalWeight: 360,
    ingredients: [
      { name: "希臘優格", quantity: "200g" },
      { name: "青瓜", quantity: "100g" },
      { name: "番茄", quantity: "80g" },
      { name: "洋蔥", quantity: "25g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "香草", quantity: "2g" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "青瓜切成小塊",
      "番茄切丁",
      "在碗中混合優格、檸檬汁和香草",
      "加入蔬菜，輕輕混合"
    ],
    fatLossTips: [
      "希臘優格蛋白質高，脂肪低",
      "青瓜含95%水分，超低卡",
      "檸檬增加風味，無需額外鹽分"
    ]
  }
};

/**
 * Get all recipes by category and protein type
 */
export function getRecipesByProtein(protein: string): Record<string, RecipeData> {
  switch (protein.toLowerCase()) {
    case "chicken":
    case "雞肉":
      return chickenBreakfastRecipes;
    case "pork":
    case "豬肉":
      return porkBreakfastRecipes;
    case "beef":
    case "牛肉":
      return beefBreakfastRecipes;
    case "seafood":
    case "海鮮":
      return seafoodBreakfastRecipes;
    case "eggs":
    case "蛋類":
      return eggBreakfastRecipes;
    case "vegetarian":
    case "素食":
      return vegetarianBreakfastRecipes;
    default:
      return chickenBreakfastRecipes;
  }
}

/**
 * Get a single recipe by ID
 */
export function getRecipeById(recipeId: string): RecipeData | null {
  const allRecipes = [
    ...Object.values(chickenBreakfastRecipes),
    ...Object.values(porkBreakfastRecipes),
    ...Object.values(beefBreakfastRecipes),
    ...Object.values(seafoodBreakfastRecipes),
    ...Object.values(eggBreakfastRecipes),
    ...Object.values(vegetarianBreakfastRecipes)
  ];
  return allRecipes.find(r => r.id === recipeId) || null;
}

export function getRecipesByProteinAndCategory(
  protein_type: 'chicken' | 'pork' | 'beef' | 'seafood' | 'egg' | 'vegetarian',
  category: 'breakfast' | 'lunch' | 'dinner' | 'salad' | 'snack' | 'soup' = 'breakfast'
): RecipeData[] {
  const allRecipes = [
    ...Object.values(chickenBreakfastRecipes),
    ...Object.values(porkBreakfastRecipes),
    ...Object.values(beefBreakfastRecipes),
    ...Object.values(seafoodBreakfastRecipes),
    ...Object.values(eggBreakfastRecipes),
    ...Object.values(vegetarianBreakfastRecipes)
  ];
  return allRecipes.filter(r => r.protein_type === protein_type && r.category === category);
}
