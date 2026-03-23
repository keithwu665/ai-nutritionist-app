/**
 * Reorganized Recipe Database
 * Structure: recipes[mealType][proteinType] = RecipeData[]
 * 6 meal types × 6 protein types = 36 recipe arrays
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
  totalWeight: number;
  ingredients: { name: string; quantity: string }[];
  steps: string[];
  fatLossTips: string[];
}

// Breakfast Recipes
const breakfastChicken: RecipeData[] = [
  {
    id: "b-c-1",
    name: "香煎雞胸蛋白早餐碗",
    protein_type: "chicken",
    category: "breakfast",
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
  {
    id: "b-c-2",
    name: "雞胸牛油果全麥吐司",
    protein_type: "chicken",
    category: "breakfast",
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
  {
    id: "b-c-3",
    name: "雞肉菠菜蛋白捲",
    protein_type: "chicken",
    category: "breakfast",
    kcal: 310,
    protein: 40,
    fat: 9,
    carbs: 16,
    totalWeight: 360,
    ingredients: [
      { name: "雞胸", quantity: "120g" },
      { name: "蛋白", quantity: "2個" },
      { name: "菠菜", quantity: "80g" },
      { name: "洋蔥", quantity: "20g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "將雞胸切成絲狀",
      "炒蛋白至半熟",
      "加入雞肉絲和菠菜炒勻",
      "用蛋白捲起填充物",
      "繼續煎至蛋白完全凝固"
    ],
    fatLossTips: [
      "菠菜含葉綠素，促進脂肪代謝",
      "蛋白低脂高蛋白，完美減脂食材",
      "雞肉含肌酸，增強肌肉力量"
    ]
  },
  {
    id: "b-c-4",
    name: "雞胸番茄沙律碗",
    protein_type: "chicken",
    category: "breakfast",
    kcal: 300,
    protein: 41,
    fat: 7,
    carbs: 15,
    totalWeight: 350,
    ingredients: [
      { name: "雞胸", quantity: "140g" },
      { name: "番茄", quantity: "100g" },
      { name: "生菜", quantity: "60g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "紅洋蔥", quantity: "20g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "將雞胸煮熟後切成塊狀",
      "番茄、黃瓜切塊，生菜撕碎",
      "將所有蔬菜放入碗中",
      "加入雞肉塊",
      "淋上橄欖油和檸檬汁，調味享用"
    ],
    fatLossTips: [
      "番茄含茄紅素，強效抗氧化",
      "生菜低卡高纖，增加飽腹感",
      "檸檬汁促進消化和脂肪燃燒"
    ]
  },
  {
    id: "b-c-5",
    name: "雞肉藜麥早餐碗",
    protein_type: "chicken",
    category: "breakfast",
    kcal: 350,
    protein: 39,
    fat: 10,
    carbs: 25,
    totalWeight: 400,
    ingredients: [
      { name: "雞胸", quantity: "120g" },
      { name: "藜麥", quantity: "50g" },
      { name: "南瓜", quantity: "60g" },
      { name: "紅椒", quantity: "40g" },
      { name: "洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "藜麥煮熟瀝乾",
      "雞胸切塊，與南瓜、紅椒炒熟",
      "加入洋蔥繼續炒",
      "混合藜麥和炒好的材料",
      "調味後盛碟"
    ],
    fatLossTips: [
      "藜麥含完全蛋白質，營養全面",
      "南瓜低GI，穩定血糖",
      "紅椒含維生素C，促進脂肪氧化"
    ]
  },
  {
    id: "b-c-6",
    name: "雞胸蘑菇炒蛋",
    protein_type: "chicken",
    category: "breakfast",
    kcal: 310,
    protein: 40,
    fat: 9,
    carbs: 14,
    totalWeight: 360,
    ingredients: [
      { name: "雞胸", quantity: "110g" },
      { name: "蛋", quantity: "2個" },
      { name: "蘑菇", quantity: "100g" },
      { name: "洋蔥", quantity: "30g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "雞胸切塊，蘑菇切片",
      "炒雞肉至半熟",
      "加入蘑菇和洋蔥繼續炒",
      "打入蛋液攪拌均勻",
      "炒至蛋液完全凝固即可"
    ],
    fatLossTips: [
      "蘑菇含多糖體，增強免疫力",
      "雞肉搭配蛋，蛋白質互補",
      "低油烹飪方式，減少熱量攝入"
    ]
  },
  {
    id: "b-c-7",
    name: "雞肉低脂芝士三文治",
    protein_type: "chicken",
    category: "breakfast",
    kcal: 340,
    protein: 38,
    fat: 11,
    carbs: 22,
    totalWeight: 380,
    ingredients: [
      { name: "雞胸", quantity: "100g" },
      { name: "全麥麵包", quantity: "2片（60g）" },
      { name: "低脂芝士", quantity: "1片（20g）" },
      { name: "番茄", quantity: "50g" },
      { name: "生菜", quantity: "30g" },
      { name: "黃芥末", quantity: "1茶匙（5g）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "雞胸煮熟切成薄片",
      "全麥麵包輕輕烤一下",
      "在麵包上塗黃芥末",
      "鋪上生菜、雞肉片、番茄和芝士",
      "蓋上另一片麵包即可"
    ],
    fatLossTips: [
      "低脂芝士提供鈣質，不增加脂肪",
      "全麥麵包富含纖維，增加飽腹感",
      "黃芥末無熱量，增加風味"
    ]
  },
  {
    id: "b-c-8",
    name: "雞胸蔬菜卷餅",
    protein_type: "chicken",
    category: "breakfast",
    kcal: 320,
    protein: 39,
    fat: 8,
    carbs: 20,
    totalWeight: 370,
    ingredients: [
      { name: "雞胸", quantity: "120g" },
      { name: "全麥卷餅", quantity: "1張（50g）" },
      { name: "生菜", quantity: "40g" },
      { name: "番茄", quantity: "60g" },
      { name: "黃瓜", quantity: "40g" },
      { name: "紅椒", quantity: "30g" },
      { name: "低脂酸奶", quantity: "2湯匙（30g）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "雞胸煮熟切成絲狀",
      "卷餅平鋪，塗上酸奶",
      "鋪上生菜、番茄、黃瓜和紅椒",
      "加入雞肉絲",
      "捲起即可享用"
    ],
    fatLossTips: [
      "卷餅低脂高纖，便於攜帶",
      "酸奶含益生菌，促進腸道健康",
      "多種蔬菜提供豐富微量元素"
    ]
  },
  {
    id: "b-c-9",
    name: "雞肉燕麥鹹粥",
    protein_type: "chicken",
    category: "breakfast",
    kcal: 330,
    protein: 36,
    fat: 9,
    carbs: 26,
    totalWeight: 390,
    ingredients: [
      { name: "雞胸", quantity: "100g" },
      { name: "燕麥", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "香菇", quantity: "40g" },
      { name: "高湯", quantity: "300ml" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "雞胸切塊，用高湯煮熟",
      "加入燕麥和切碎的蔬菜",
      "煮至燕麥軟爛",
      "調味即可",
      "可根據口味加入黑椒"
    ],
    fatLossTips: [
      "燕麥含β-葡聚糖，降低膽固醇",
      "鹹粥飽腹感強，適合減脂",
      "蔬菜提供纖維，促進消化"
    ]
  },
  {
    id: "b-c-10",
    name: "雞胸青瓜乳酪碗",
    protein_type: "chicken",
    category: "breakfast",
    kcal: 300,
    protein: 41,
    fat: 7,
    carbs: 13,
    totalWeight: 340,
    ingredients: [
      { name: "雞胸", quantity: "130g" },
      { name: "希臘乳酪", quantity: "100g" },
      { name: "黃瓜", quantity: "80g" },
      { name: "番茄", quantity: "50g" },
      { name: "紅洋蔥", quantity: "20g" },
      { name: "檸檬", quantity: "1/2個（15g）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "雞胸煮熟切成塊狀",
      "黃瓜、番茄切塊",
      "將希臘乳酪放入碗中",
      "加入所有蔬菜和雞肉",
      "淋上檸檬汁，調味享用"
    ],
    fatLossTips: [
      "希臘乳酪高蛋白低脂，完美減脂食材",
      "黃瓜含水量高，低卡高纖",
      "檸檬汁促進脂肪分解和代謝"
    ]
  }
];

const breakfastPork: RecipeData[] = [
  {
    id: "b-p-1",
    name: "香煎瘦豬肉蛋白碗",
    protein_type: "pork",
    category: "breakfast",
    kcal: 310,
    protein: 42,
    fat: 8,
    carbs: 16,
    totalWeight: 360,
    ingredients: [
      { name: "瘦豬肉", quantity: "150g" },
      { name: "蛋白", quantity: "2個" },
      { name: "番茄", quantity: "80g" },
      { name: "菠菜", quantity: "50g" },
      { name: "洋蔥", quantity: "30g" },
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
      "瘦豬肉含豐富B族維生素，促進代謝",
      "蛋白高蛋白低脂，完美減脂搭配",
      "菠菜含鐵質，增強耐力"
    ]
  },
  {
    id: "b-p-2",
    name: "豬里肌牛油果吐司",
    protein_type: "pork",
    category: "breakfast",
    kcal: 360,
    protein: 39,
    fat: 11,
    carbs: 26,
    totalWeight: 400,
    ingredients: [
      { name: "豬里肌", quantity: "100g" },
      { name: "全麥吐司", quantity: "2片（60g）" },
      { name: "牛油果", quantity: "1/2個（60g）" },
      { name: "番茄", quantity: "60g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "黑椒", quantity: "0.5g" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "豬里肌煮熟後切成薄片",
      "全麥吐司放入烤麵包機烤至金黃",
      "牛油果切半，用叉子壓成泥狀",
      "在吐司上塗上牛油果泥",
      "放上豬肉片和番茄片，淋上檸檬汁"
    ],
    fatLossTips: [
      "豬里肌是豬肉中最瘦的部分，低脂高蛋白",
      "全麥吐司富含纖維，增加飽腹感",
      "牛油果含健康脂肪，促進脂肪燃燒"
    ]
  },
  {
    id: "b-p-3",
    name: "瘦肉菠菜蛋白炒",
    protein_type: "pork",
    category: "breakfast",
    kcal: 300,
    protein: 41,
    fat: 8,
    carbs: 14,
    totalWeight: 350,
    ingredients: [
      { name: "瘦豬肉", quantity: "120g" },
      { name: "蛋白", quantity: "2個" },
      { name: "菠菜", quantity: "80g" },
      { name: "洋蔥", quantity: "20g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "瘦豬肉切成絲狀",
      "炒蛋白至半熟",
      "加入豬肉絲和菠菜炒勻",
      "用蛋白捲起填充物",
      "繼續煎至蛋白完全凝固"
    ],
    fatLossTips: [
      "瘦豬肉含肌酸，增強肌肉力量",
      "菠菜含葉綠素，促進脂肪代謝",
      "蛋白低脂高蛋白，完美減脂食材"
    ]
  },
  {
    id: "b-p-4",
    name: "豬肉番茄早餐碗",
    protein_type: "pork",
    category: "breakfast",
    kcal: 330,
    protein: 40,
    fat: 9,
    carbs: 17,
    totalWeight: 370,
    ingredients: [
      { name: "瘦豬肉", quantity: "140g" },
      { name: "番茄", quantity: "100g" },
      { name: "生菜", quantity: "60g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "紅洋蔥", quantity: "20g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "瘦豬肉煮熟後切成塊狀",
      "番茄、黃瓜切塊，生菜撕碎",
      "將所有蔬菜放入碗中",
      "加入豬肉塊",
      "淋上橄欖油和檸檬汁，調味享用"
    ],
    fatLossTips: [
      "番茄含茄紅素，強效抗氧化",
      "生菜低卡高纖，增加飽腹感",
      "瘦豬肉提供優質蛋白質"
    ]
  },
  {
    id: "b-p-5",
    name: "豬肉生菜卷",
    protein_type: "pork",
    category: "breakfast",
    kcal: 280,
    protein: 38,
    fat: 7,
    carbs: 12,
    totalWeight: 320,
    ingredients: [
      { name: "瘦豬肉", quantity: "120g" },
      { name: "生菜葉", quantity: "100g" },
      { name: "番茄", quantity: "50g" },
      { name: "黃瓜", quantity: "40g" },
      { name: "紅椒", quantity: "30g" },
      { name: "低脂酸奶", quantity: "2湯匙（30g）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "瘦豬肉煮熟切成絲狀",
      "生菜葉平鋪，塗上酸奶",
      "鋪上番茄、黃瓜和紅椒",
      "加入豬肉絲",
      "捲起即可享用"
    ],
    fatLossTips: [
      "生菜卷低卡高纖，便於攜帶",
      "酸奶含益生菌，促進腸道健康",
      "瘦豬肉含維生素B，促進能量代謝"
    ]
  },
  {
    id: "b-p-6",
    name: "瘦肉粟米蛋白粥",
    protein_type: "pork",
    category: "breakfast",
    kcal: 320,
    protein: 39,
    fat: 8,
    carbs: 22,
    totalWeight: 380,
    ingredients: [
      { name: "瘦豬肉", quantity: "100g" },
      { name: "粟米", quantity: "80g" },
      { name: "洋蔥", quantity: "30g" },
      { name: "紅蘿蔔", quantity: "40g" },
      { name: "高湯", quantity: "300ml" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "瘦豬肉切塊，用高湯煮熟",
      "加入粟米和切碎的蔬菜",
      "煮至粟米軟爛",
      "調味即可",
      "可根據口味加入黑椒"
    ],
    fatLossTips: [
      "粟米含纖維，促進消化",
      "瘦豬肉低脂高蛋白，適合減脂",
      "高湯提供膠原蛋白，滋養肌膚"
    ]
  },
  {
    id: "b-p-7",
    name: "豬肉藜麥早餐碗",
    protein_type: "pork",
    category: "breakfast",
    kcal: 350,
    protein: 38,
    fat: 10,
    carbs: 26,
    totalWeight: 400,
    ingredients: [
      { name: "瘦豬肉", quantity: "120g" },
      { name: "藜麥", quantity: "50g" },
      { name: "南瓜", quantity: "60g" },
      { name: "紅椒", quantity: "40g" },
      { name: "洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "藜麥煮熟瀝乾",
      "瘦豬肉切塊，與南瓜、紅椒炒熟",
      "加入洋蔥繼續炒",
      "混合藜麥和炒好的材料",
      "調味後盛碟"
    ],
    fatLossTips: [
      "藜麥含完全蛋白質，營養全面",
      "南瓜低GI，穩定血糖",
      "瘦豬肉含鋅，增強免疫力"
    ]
  },
  {
    id: "b-p-8",
    name: "豬肉蘑菇炒蛋白",
    protein_type: "pork",
    category: "breakfast",
    kcal: 310,
    protein: 40,
    fat: 9,
    carbs: 14,
    totalWeight: 360,
    ingredients: [
      { name: "瘦豬肉", quantity: "110g" },
      { name: "蛋白", quantity: "2個" },
      { name: "蘑菇", quantity: "100g" },
      { name: "洋蔥", quantity: "30g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "瘦豬肉切塊，蘑菇切片",
      "炒豬肉至半熟",
      "加入蘑菇和洋蔥繼續炒",
      "打入蛋白液攪拌均勻",
      "炒至蛋白完全凝固即可"
    ],
    fatLossTips: [
      "蘑菇含多糖體，增強免疫力",
      "瘦豬肉搭配蛋白，蛋白質互補",
      "低油烹飪方式，減少熱量攝入"
    ]
  },
  {
    id: "b-p-9",
    name: "豬肉全麥三文治",
    protein_type: "pork",
    category: "breakfast",
    kcal: 340,
    protein: 37,
    fat: 11,
    carbs: 24,
    totalWeight: 390,
    ingredients: [
      { name: "瘦豬肉", quantity: "100g" },
      { name: "全麥麵包", quantity: "2片（60g）" },
      { name: "低脂芝士", quantity: "1片（20g）" },
      { name: "番茄", quantity: "50g" },
      { name: "生菜", quantity: "30g" },
      { name: "黃芥末", quantity: "1茶匙（5g）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "瘦豬肉煮熟切成薄片",
      "全麥麵包輕輕烤一下",
      "在麵包上塗黃芥末",
      "鋪上生菜、豬肉片、番茄和芝士",
      "蓋上另一片麵包即可"
    ],
    fatLossTips: [
      "低脂芝士提供鈣質，不增加脂肪",
      "全麥麵包富含纖維，增加飽腹感",
      "瘦豬肉含硒，提升代謝"
    ]
  },
  {
    id: "b-p-10",
    name: "豬肉青瓜乳酪碗",
    protein_type: "pork",
    category: "breakfast",
    kcal: 290,
    protein: 40,
    fat: 7,
    carbs: 13,
    totalWeight: 340,
    ingredients: [
      { name: "瘦豬肉", quantity: "130g" },
      { name: "希臘乳酪", quantity: "100g" },
      { name: "黃瓜", quantity: "80g" },
      { name: "番茄", quantity: "50g" },
      { name: "紅洋蔥", quantity: "20g" },
      { name: "檸檬", quantity: "1/2個（15g）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "瘦豬肉煮熟切成塊狀",
      "黃瓜、番茄切塊",
      "將希臘乳酪放入碗中",
      "加入所有蔬菜和豬肉",
      "淋上檸檬汁，調味享用"
    ],
    fatLossTips: [
      "希臘乳酪高蛋白低脂，完美減脂食材",
      "黃瓜含水量高，低卡高纖",
      "瘦豬肉含維生素B12，促進能量代謝"
    ]
  }
];

// Lunch Recipes (正餐)
const lunchChicken: RecipeData[] = [
  {
    id: "l-c-1",
    name: "香煎雞胸沙律",
    protein_type: "chicken",
    category: "lunch",
    kcal: 380,
    protein: 44,
    fat: 12,
    carbs: 22,
    totalWeight: 450,
    ingredients: [
      { name: "雞胸", quantity: "180g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "番茄", quantity: "80g" },
      { name: "黃瓜", quantity: "60g" },
      { name: "紅椒", quantity: "50g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1.5湯匙（22.5ml）" },
      { name: "鹽", quantity: "1.5g" }
    ],
    steps: [
      "雞胸用中火煎至兩面金黃",
      "切成片狀",
      "混合生菜、番茄、黃瓜、紅椒",
      "放上雞肉片",
      "淋上橄欖油和檸檬汁，調味享用"
    ],
    fatLossTips: [
      "生菜沙律低卡高纖，增加飽腹感",
      "雞胸高蛋白低脂，完美午餐選擇",
      "檸檬汁促進消化和脂肪燃燒"
    ]
  },
  {
    id: "l-c-2",
    name: "雞胸栗米飯",
    protein_type: "chicken",
    category: "lunch",
    kcal: 420,
    protein: 40,
    fat: 10,
    carbs: 38,
    totalWeight: 500,
    ingredients: [
      { name: "雞胸", quantity: "160g" },
      { name: "糙米", quantity: "80g" },
      { name: "粟米", quantity: "60g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "雞胸切塊炒至熟透",
      "加入粟米、紅蘿蔔、洋蔥炒勻",
      "混合糙米",
      "調味後盛碟"
    ],
    fatLossTips: [
      "糙米低GI，穩定血糖",
      "粟米含纖維，促進消化",
      "雞胸提供優質蛋白質"
    ]
  },
  {
    id: "l-c-3",
    name: "蒜香雞胸蔬菜碗",
    protein_type: "chicken",
    category: "lunch",
    kcal: 390,
    protein: 42,
    fat: 11,
    carbs: 28,
    totalWeight: 480,
    ingredients: [
      { name: "雞胸", quantity: "170g" },
      { name: "糙米", quantity: "70g" },
      { name: "西蘭花", quantity: "80g" },
      { name: "紅蘿蔔", quantity: "60g" },
      { name: "大蒜", quantity: "3瓣" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "雞胸切塊，用大蒜爆香後炒熟",
      "加入西蘭花和紅蘿蔔炒勻",
      "混合糙米",
      "調味後盛碟"
    ],
    fatLossTips: [
      "西蘭花含蘿蔔硫素，抗癌防衰老",
      "大蒜含硫化物，促進脂肪燃燒",
      "雞胸搭配蔬菜，營養均衡"
    ]
  },
  {
    id: "l-c-4",
    name: "雞肉黑豆飯",
    protein_type: "chicken",
    category: "lunch",
    kcal: 410,
    protein: 41,
    fat: 9,
    carbs: 40,
    totalWeight: 500,
    ingredients: [
      { name: "雞胸", quantity: "150g" },
      { name: "糙米", quantity: "70g" },
      { name: "黑豆", quantity: "50g" },
      { name: "紅椒", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米和黑豆一起煮熟",
      "雞胸切塊炒至熟透",
      "加入紅椒和洋蔥炒勻",
      "混合米豆混合物",
      "調味後盛碟"
    ],
    fatLossTips: [
      "黑豆含花青素，強效抗氧化",
      "黑豆高纖低GI，穩定血糖",
      "雞肉搭配豆類，蛋白質互補"
    ]
  },
  {
    id: "l-c-5",
    name: "雞胸番茄義大利麵",
    protein_type: "chicken",
    category: "lunch",
    kcal: 400,
    protein: 38,
    fat: 10,
    carbs: 42,
    totalWeight: 500,
    ingredients: [
      { name: "雞胸", quantity: "140g" },
      { name: "全麥義大利麵", quantity: "80g" },
      { name: "番茄醬", quantity: "100g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "全麥義大利麵煮熟瀝乾",
      "雞胸切塊炒至半熟",
      "加入洋蔥和大蒜爆香",
      "加入番茄醬煮勻",
      "混合義大利麵，調味享用"
    ],
    fatLossTips: [
      "全麥義大利麵低GI，營養豐富",
      "番茄含茄紅素，強效抗氧化",
      "雞胸提供優質蛋白質"
    ]
  },
  {
    id: "l-c-6",
    name: "雞肉蔬菜炒飯",
    protein_type: "chicken",
    category: "lunch",
    kcal: 420,
    protein: 39,
    fat: 11,
    carbs: 40,
    totalWeight: 500,
    ingredients: [
      { name: "雞胸", quantity: "150g" },
      { name: "糙米飯", quantity: "150g" },
      { name: "蛋", quantity: "1個" },
      { name: "豌豆", quantity: "50g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" }
    ],
    steps: [
      "雞胸切塊炒至熟透",
      "加入蛋液炒勻",
      "加入豌豆、紅蘿蔔、洋蔥炒勻",
      "加入糙米飯炒散",
      "調味後盛碟"
    ],
    fatLossTips: [
      "糙米飯低GI，穩定血糖",
      "蛋含膽鹼，促進脂肪代謝",
      "豌豆高纖低脂，增加飽腹感"
    ]
  },
  {
    id: "l-c-7",
    name: "雞胸烤蔬菜",
    protein_type: "chicken",
    category: "lunch",
    kcal: 380,
    protein: 43,
    fat: 10,
    carbs: 24,
    totalWeight: 450,
    ingredients: [
      { name: "雞胸", quantity: "180g" },
      { name: "西蘭花", quantity: "100g" },
      { name: "紅椒", quantity: "60g" },
      { name: "洋蔥", quantity: "50g" },
      { name: "蘑菇", quantity: "60g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "雞胸和蔬菜切塊",
      "混合橄欖油、鹽、黑椒",
      "放在烤盤上",
      "200°C烤20-25分鐘至熟透",
      "盛碟享用"
    ],
    fatLossTips: [
      "烤制方式低油低脂，健康烹飪",
      "西蘭花含蘿蔔硫素，促進脂肪燃燒",
      "多種蔬菜提供豐富微量元素"
    ]
  },
  {
    id: "l-c-8",
    name: "雞肉豆腐湯飯",
    protein_type: "chicken",
    category: "lunch",
    kcal: 400,
    protein: 42,
    fat: 9,
    carbs: 36,
    totalWeight: 500,
    ingredients: [
      { name: "雞胸", quantity: "140g" },
      { name: "糙米飯", quantity: "100g" },
      { name: "豆腐", quantity: "150g" },
      { name: "蔥", quantity: "20g" },
      { name: "薑", quantity: "10g" },
      { name: "高湯", quantity: "300ml" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "高湯煮沸",
      "加入雞胸塊煮至熟透",
      "加入豆腐塊",
      "加入蔥和薑調味",
      "盛飯後倒湯享用"
    ],
    fatLossTips: [
      "豆腐高蛋白低脂，完美減脂食材",
      "湯汁幫助消化，增加飽腹感",
      "雞肉搭配豆腐，蛋白質互補"
    ]
  },
  {
    id: "l-c-9",
    name: "雞胸黑米飯",
    protein_type: "chicken",
    category: "lunch",
    kcal: 410,
    protein: 40,
    fat: 10,
    carbs: 40,
    totalWeight: 500,
    ingredients: [
      { name: "雞胸", quantity: "150g" },
      { name: "黑米", quantity: "80g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "豌豆", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "黑米煮熟",
      "雞胸切塊炒至熟透",
      "加入紅蘿蔔、豌豆、洋蔥炒勻",
      "混合黑米",
      "調味後盛碟"
    ],
    fatLossTips: [
      "黑米含花青素，強效抗氧化",
      "黑米低GI，穩定血糖",
      "雞肉提供優質蛋白質"
    ]
  },
  {
    id: "l-c-10",
    name: "雞肉藜麥沙律",
    protein_type: "chicken",
    category: "lunch",
    kcal: 390,
    protein: 41,
    fat: 11,
    carbs: 30,
    totalWeight: 480,
    ingredients: [
      { name: "雞胸", quantity: "160g" },
      { name: "藜麥", quantity: "60g" },
      { name: "混合生菜", quantity: "80g" },
      { name: "番茄", quantity: "60g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1.5湯匙（22.5ml）" },
      { name: "鹽", quantity: "1.5g" }
    ],
    steps: [
      "藜麥煮熟",
      "雞胸煮熟切成塊狀",
      "混合生菜、番茄、黃瓜",
      "加入藜麥和雞肉",
      "淋上橄欖油和檸檬汁，調味享用"
    ],
    fatLossTips: [
      "藜麥含完全蛋白質，營養全面",
      "沙律低卡高纖，增加飽腹感",
      "雞肉搭配藜麥，蛋白質互補"
    ]
  }
];

// Salad Recipes (沙律)
const saladChicken: RecipeData[] = [
  {
    id: "s-c-1",
    name: "雞胸凱撒沙律",
    protein_type: "chicken",
    category: "salad",
    kcal: 350,
    protein: 40,
    fat: 11,
    carbs: 20,
    totalWeight: 420,
    ingredients: [
      { name: "雞胸", quantity: "160g" },
      { name: "羅馬生菜", quantity: "120g" },
      { name: "帕瑪森芝士", quantity: "20g" },
      { name: "全麥麵包丁", quantity: "30g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "雞胸煮熟切成塊狀",
      "羅馬生菜撕碎",
      "混合生菜、雞肉、麵包丁",
      "淋上橄欖油和檸檬汁",
      "撒上帕瑪森芝士，調味享用"
    ],
    fatLossTips: [
      "羅馬生菜低卡高纖，增加飽腹感",
      "帕瑪森芝士提供鈣質，不過量",
      "全麥麵包丁增加纖維，促進消化"
    ]
  },
  {
    id: "s-c-2",
    name: "雞肉番茄沙律",
    protein_type: "chicken",
    category: "salad",
    kcal: 320,
    protein: 38,
    fat: 9,
    carbs: 18,
    totalWeight: 400,
    ingredients: [
      { name: "雞胸", quantity: "150g" },
      { name: "番茄", quantity: "150g" },
      { name: "紅洋蔥", quantity: "40g" },
      { name: "香芹", quantity: "20g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "雞胸煮熟切成塊狀",
      "番茄切塊，紅洋蔥切絲",
      "混合所有材料",
      "淋上橄欖油和檸檬汁",
      "撒上香芹，調味享用"
    ],
    fatLossTips: [
      "番茄含茄紅素，強效抗氧化",
      "香芹含香豆素，促進脂肪燃燒",
      "低油沙律，健康減脂選擇"
    ]
  },
  {
    id: "s-c-3",
    name: "雞胸蘋果核桃沙律",
    protein_type: "chicken",
    category: "salad",
    kcal: 380,
    protein: 36,
    fat: 14,
    carbs: 26,
    totalWeight: 450,
    ingredients: [
      { name: "雞胸", quantity: "140g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "蘋果", quantity: "80g" },
      { name: "核桃", quantity: "20g" },
      { name: "紅葡萄", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "蘋果醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "雞胸煮熟切成塊狀",
      "蘋果切塊，核桃切碎",
      "混合生菜、雞肉、蘋果、葡萄",
      "淋上橄欖油和蘋果醋",
      "撒上核桃，調味享用"
    ],
    fatLossTips: [
      "蘋果含果膠，促進消化",
      "核桃含Omega-3，促進脂肪燃燒",
      "蘋果醋幫助消化，加快代謝"
    ]
  },
  {
    id: "s-c-4",
    name: "雞肉黑莓沙律",
    protein_type: "chicken",
    category: "salad",
    kcal: 340,
    protein: 39,
    fat: 10,
    carbs: 22,
    totalWeight: 430,
    ingredients: [
      { name: "雞胸", quantity: "150g" },
      { name: "菠菜", quantity: "100g" },
      { name: "黑莓", quantity: "60g" },
      { name: "山羊芝士", quantity: "30g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "黑莓醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "雞胸煮熟切成塊狀",
      "菠菜洗淨",
      "混合菠菜、雞肉、黑莓、洋蔥",
      "淋上橄欖油和黑莓醋",
      "撒上山羊芝士，調味享用"
    ],
    fatLossTips: [
      "黑莓含花青素，強效抗氧化",
      "菠菜含葉綠素，促進脂肪代謝",
      "山羊芝士提供益生菌，促進消化"
    ]
  },
  {
    id: "s-c-5",
    name: "雞胸地中海沙律",
    protein_type: "chicken",
    category: "salad",
    kcal: 360,
    protein: 38,
    fat: 12,
    carbs: 24,
    totalWeight: 450,
    ingredients: [
      { name: "雞胸", quantity: "150g" },
      { name: "番茄", quantity: "100g" },
      { name: "黃瓜", quantity: "80g" },
      { name: "黑橄欖", quantity: "30g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "羊乳酪", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" }
    ],
    steps: [
      "雞胸煮熟切成塊狀",
      "番茄、黃瓜切塊，洋蔥切絲",
      "混合所有蔬菜和雞肉",
      "加入黑橄欖和羊乳酪",
      "淋上橄欖油和檸檬汁享用"
    ],
    fatLossTips: [
      "黑橄欖含單不飽和脂肪，促進脂肪燃燒",
      "羊乳酪含益生菌，促進腸道健康",
      "地中海飲食，健康長壽飲食模式"
    ]
  },
  {
    id: "s-c-6",
    name: "雞肉蔓越莓沙律",
    protein_type: "chicken",
    category: "salad",
    kcal: 350,
    protein: 37,
    fat: 11,
    carbs: 26,
    totalWeight: 440,
    ingredients: [
      { name: "雞胸", quantity: "140g" },
      { name: "混合生菜", quantity: "110g" },
      { name: "蔓越莓乾", quantity: "30g" },
      { name: "核桃", quantity: "20g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "蘋果醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "雞胸煮熟切成塊狀",
      "核桃切碎",
      "混合生菜、雞肉、蔓越莓、洋蔥",
      "淋上橄欖油和蘋果醋",
      "撒上核桃，調味享用"
    ],
    fatLossTips: [
      "蔓越莓含原花青素，預防尿道感染",
      "核桃含Omega-3，促進脂肪燃燒",
      "蘋果醋幫助消化，加快代謝"
    ]
  },
  {
    id: "s-c-7",
    name: "雞胸菠蘿沙律",
    protein_type: "chicken",
    category: "salad",
    kcal: 340,
    protein: 38,
    fat: 9,
    carbs: 28,
    totalWeight: 450,
    ingredients: [
      { name: "雞胸", quantity: "150g" },
      { name: "菠蘿", quantity: "100g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "紅椒", quantity: "40g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "雞胸煮熟切成塊狀",
      "菠蘿切塊",
      "混合生菜、雞肉、菠蘿、紅椒、洋蔥",
      "淋上橄欖油和檸檬汁",
      "調味享用"
    ],
    fatLossTips: [
      "菠蘿含菠蘿酶，促進蛋白質消化",
      "菠蘿低卡高纖，增加飽腹感",
      "熱帶水果提供豐富維生素"
    ]
  },
  {
    id: "s-c-8",
    name: "雞肉芒果沙律",
    protein_type: "chicken",
    category: "salad",
    kcal: 360,
    protein: 37,
    fat: 10,
    carbs: 30,
    totalWeight: 460,
    ingredients: [
      { name: "雞胸", quantity: "140g" },
      { name: "芒果", quantity: "100g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "紅椒", quantity: "40g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "萊姆汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "雞胸煮熟切成塊狀",
      "芒果切塊",
      "混合生菜、雞肉、芒果、紅椒、洋蔥",
      "淋上橄欖油和萊姆汁",
      "調味享用"
    ],
    fatLossTips: [
      "芒果含酵素，促進消化",
      "芒果低卡高纖，增加飽腹感",
      "萊姆汁促進脂肪燃燒"
    ]
  },
  {
    id: "s-c-9",
    name: "雞胸石榴沙律",
    protein_type: "chicken",
    category: "salad",
    kcal: 350,
    protein: 38,
    fat: 10,
    carbs: 26,
    totalWeight: 440,
    ingredients: [
      { name: "雞胸", quantity: "150g" },
      { name: "石榴籽", quantity: "80g" },
      { name: "菠菜", quantity: "100g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "核桃", quantity: "20g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "石榴醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "雞胸煮熟切成塊狀",
      "核桃切碎",
      "混合菠菜、雞肉、石榴籽、洋蔥",
      "淋上橄欖油和石榴醋",
      "撒上核桃，調味享用"
    ],
    fatLossTips: [
      "石榴籽含鞣花酸，強效抗氧化",
      "石榴促進血液循環，改善代謝",
      "核桃含Omega-3，促進脂肪燃燒"
    ]
  },
  {
    id: "s-c-10",
    name: "雞肉草莓沙律",
    protein_type: "chicken",
    category: "salad",
    kcal: 330,
    protein: 39,
    fat: 9,
    carbs: 22,
    totalWeight: 420,
    ingredients: [
      { name: "雞胸", quantity: "150g" },
      { name: "草莓", quantity: "100g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "杏仁", quantity: "20g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "雞胸煮熟切成塊狀",
      "草莓切半，杏仁切碎",
      "混合生菜、雞肉、草莓、洋蔥",
      "淋上橄欖油和檸檬汁",
      "撒上杏仁，調味享用"
    ],
    fatLossTips: [
      "草莓含維生素C，促進脂肪氧化",
      "草莓低卡高纖，增加飽腹感",
      "杏仁含維生素E，抗衰老"
    ]
  }
];

// Create the main recipes object
export const recipes: Record<string, Record<string, RecipeData[]>> = {
  breakfast: {
    chicken: breakfastChicken,
    pork: breakfastPork,
    beef: [], // To be filled
    seafood: [], // To be filled
    egg: [], // To be filled
    vegetarian: [] // To be filled
  },
  lunch: {
    chicken: lunchChicken,
    pork: [], // To be filled
    beef: [], // To be filled
    seafood: [], // To be filled
    egg: [], // To be filled
    vegetarian: [] // To be filled
  },
  dinner: {
    chicken: [], // To be filled
    pork: [], // To be filled
    beef: [], // To be filled
    seafood: [], // To be filled
    egg: [], // To be filled
    vegetarian: [] // To be filled
  },
  salad: {
    chicken: saladChicken,
    pork: [], // To be filled
    beef: [], // To be filled
    seafood: [], // To be filled
    egg: [], // To be filled
    vegetarian: [] // To be filled
  },
  snack: {
    chicken: [], // To be filled
    pork: [], // To be filled
    beef: [], // To be filled
    seafood: [], // To be filled
    egg: [], // To be filled
    vegetarian: [] // To be filled
  },
  soup: {
    chicken: [], // To be filled
    pork: [], // To be filled
    beef: [], // To be filled
    seafood: [], // To be filled
    egg: [], // To be filled
    vegetarian: [] // To be filled
  }
};

// Helper function to get recipes by meal type and protein type
export function getRecipesByMealAndProtein(mealType: string, proteinType: string): RecipeData[] {
  const mealTypeKey = mealType as keyof typeof recipes;
  const proteinTypeKey = proteinType as keyof (typeof recipes)[typeof mealTypeKey];
  
  if (recipes[mealTypeKey] && recipes[mealTypeKey][proteinTypeKey]) {
    return recipes[mealTypeKey][proteinTypeKey];
  }
  
  return [];
}

// Helper function to get a recipe by ID
export function getRecipeById(recipeId: string): RecipeData | undefined {
  for (const mealType in recipes) {
    for (const proteinType in recipes[mealType as keyof typeof recipes]) {
      const recipeList = recipes[mealType as keyof typeof recipes][proteinType as keyof (typeof recipes)[typeof mealType]];
      const recipe = recipeList.find(r => r.id === recipeId);
      if (recipe) {
        return recipe;
      }
    }
  }
  return undefined;
}
