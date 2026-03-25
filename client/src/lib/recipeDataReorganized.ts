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

const breakfastBeef: RecipeData[] = [
  {
    id: "b-b-1",
    name: "香煎牛肉蛋白早餐碗",
    protein_type: "beef",
    category: "breakfast",
    kcal: 330,
    protein: 44,
    fat: 9,
    carbs: 17,
    totalWeight: 380,
    ingredients: [
      { name: "瘦牛肉", quantity: "150g" },
      { name: "蛋白", quantity: "2個" },
      { name: "番茄", quantity: "80g" },
      { name: "菠菜", quantity: "50g" },
      { name: "洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "瘦牛肉切成小塊，用中火煎至半熟",
      "加入蛋白攪拌均勻",
      "加入番茄、菠菜和洋蔥",
      "繼續煎至牛肉熟透，蛋白凝固",
      "調味後盛碟享用"
    ],
    fatLossTips: [
      "瘦牛肉含肌酸，增強肌肉力量",
      "蛋白高蛋白低脂，完美減脂搭配",
      "菠菜含鐵質，提升新陳代謝"
    ]
  },
  {
    id: "b-b-2",
    name: "牛肉牛油果全麥吐司",
    protein_type: "beef",
    category: "breakfast",
    kcal: 390,
    protein: 40,
    fat: 13,
    carbs: 29,
    totalWeight: 430,
    ingredients: [
      { name: "瘦牛肉", quantity: "100g" },
      { name: "全麥吐司", quantity: "2片（60g）" },
      { name: "牛油果", quantity: "1/2個（60g）" },
      { name: "番茄", quantity: "60g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "黑椒", quantity: "0.5g" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "瘦牛肉煮熟後切成薄片",
      "全麥吐司放入烤麵包機烤至金黃",
      "牛油果切半，用叉子壓成泥狀",
      "在吐司上塗上牛油果泥",
      "放上牛肉片和番茄片，淋上檸檬汁"
    ],
    fatLossTips: [
      "全麥吐司富含纖維，增加飽腹感",
      "牛油果含健康脂肪，促進脂肪燃燒",
      "瘦牛肉含鋅，提升免疫力"
    ]
  },
  {
    id: "b-b-3",
    name: "牛肉菠菜蛋白炒",
    protein_type: "beef",
    category: "breakfast",
    kcal: 320,
    protein: 42,
    fat: 10,
    carbs: 15,
    totalWeight: 360,
    ingredients: [
      { name: "瘦牛肉", quantity: "120g" },
      { name: "菠菜", quantity: "100g" },
      { name: "蛋白", quantity: "2個" },
      { name: "洋蔥", quantity: "40g" },
      { name: "大蒜", quantity: "2瓣（10g）" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "瘦牛肉切成薄片",
      "用中火炒牛肉至半熟",
      "加入洋蔥和大蒜炒香",
      "加入菠菜繼續炒",
      "打入蛋白液，炒至蛋白完全凝固"
    ],
    fatLossTips: [
      "菠菜含葉綠素，促進脂肪分解",
      "牛肉含肉鹼，加速脂肪代謝",
      "蛋白高蛋白低脂，增加飽腹感"
    ]
  },
  {
    id: "b-b-4",
    name: "牛肉番茄早餐碗",
    protein_type: "beef",
    category: "breakfast",
    kcal: 310,
    protein: 41,
    fat: 8,
    carbs: 18,
    totalWeight: 370,
    ingredients: [
      { name: "瘦牛肉", quantity: "140g" },
      { name: "番茄", quantity: "120g" },
      { name: "洋蔥", quantity: "50g" },
      { name: "大蒜", quantity: "2瓣（10g）" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "香草", quantity: "1g" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "瘦牛肉切成小塊",
      "番茄切成塊狀",
      "用中火炒牛肉至半熟",
      "加入洋蔥、大蒜和番茄",
      "燉至牛肉軟嫩，番茄出汁"
    ],
    fatLossTips: [
      "番茄含番茄紅素，抗氧化效果強",
      "瘦牛肉搭配番茄，營養互補",
      "低油烹飪方式，減少熱量攝入"
    ]
  },
  {
    id: "b-b-5",
    name: "牛肉生菜卷",
    protein_type: "beef",
    category: "breakfast",
    kcal: 300,
    protein: 39,
    fat: 9,
    carbs: 14,
    totalWeight: 340,
    ingredients: [
      { name: "瘦牛肉", quantity: "110g" },
      { name: "生菜葉", quantity: "4片（80g）" },
      { name: "番茄", quantity: "60g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "紅洋蔥", quantity: "20g" },
      { name: "檸檬汁", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "瘦牛肉煮熟後切成薄片",
      "生菜葉洗淨瀝乾",
      "番茄和黃瓜切成條狀",
      "在生菜葉上鋪上牛肉、蔬菜",
      "淋上檸檬汁，捲起享用"
    ],
    fatLossTips: [
      "生菜低卡高纖，增加飽腹感",
      "牛肉含維生素B12，促進能量代謝",
      "檸檬汁幫助消化，加快代謝"
    ]
  },
  {
    id: "b-b-6",
    name: "牛肉燕麥鹹粥",
    protein_type: "beef",
    category: "breakfast",
    kcal: 340,
    protein: 38,
    fat: 10,
    carbs: 32,
    totalWeight: 420,
    ingredients: [
      { name: "瘦牛肉", quantity: "100g" },
      { name: "燕麥", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "香菇", quantity: "40g" },
      { name: "高湯", quantity: "300ml" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "瘦牛肉切塊，用高湯煮熟",
      "加入燕麥和切碎的蔬菜",
      "煮至燕麥軟爛",
      "調味即可",
      "可根據口味加入黑椒"
    ],
    fatLossTips: [
      "燕麥含β-葡聚糖，降低膽固醇",
      "鹹粥飽腹感強，適合減脂",
      "牛肉提供優質蛋白，促進肌肉生長"
    ]
  },
  {
    id: "b-b-7",
    name: "牛肉藜麥早餐碗",
    protein_type: "beef",
    category: "breakfast",
    kcal: 360,
    protein: 41,
    fat: 11,
    carbs: 28,
    totalWeight: 410,
    ingredients: [
      { name: "瘦牛肉", quantity: "120g" },
      { name: "藜麥", quantity: "50g" },
      { name: "番茄", quantity: "80g" },
      { name: "黃瓜", quantity: "60g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "檸檬汁", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "藜麥煮熟後冷卻",
      "瘦牛肉煮熟切成塊狀",
      "蔬菜切成小塊",
      "將所有材料混合",
      "淋上檸檬汁，調味享用"
    ],
    fatLossTips: [
      "藜麥含完整蛋白質，營養豐富",
      "牛肉搭配藜麥，蛋白質互補",
      "檸檬汁促進脂肪分解和代謝"
    ]
  },
  {
    id: "b-b-8",
    name: "牛肉蘑菇炒蛋白",
    protein_type: "beef",
    category: "breakfast",
    kcal: 320,
    protein: 43,
    fat: 9,
    carbs: 14,
    totalWeight: 360,
    ingredients: [
      { name: "瘦牛肉", quantity: "120g" },
      { name: "蘑菇", quantity: "100g" },
      { name: "蛋白", quantity: "2個" },
      { name: "洋蔥", quantity: "40g" },
      { name: "大蒜", quantity: "2瓣（10g）" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "瘦牛肉切塊，蘑菇切片",
      "炒牛肉至半熟",
      "加入蘑菇和洋蔥繼續炒",
      "打入蛋白液攪拌均勻",
      "炒至蛋白完全凝固即可"
    ],
    fatLossTips: [
      "蘑菇含多糖體，增強免疫力",
      "牛肉搭配蛋白，蛋白質互補",
      "低油烹飪方式，減少熱量攝入"
    ]
  },
  {
    id: "b-b-9",
    name: "牛肉全麥三文治",
    protein_type: "beef",
    category: "breakfast",
    kcal: 350,
    protein: 39,
    fat: 12,
    carbs: 25,
    totalWeight: 400,
    ingredients: [
      { name: "瘦牛肉", quantity: "100g" },
      { name: "全麥麵包", quantity: "2片（60g）" },
      { name: "低脂芝士", quantity: "1片（20g）" },
      { name: "番茄", quantity: "50g" },
      { name: "生菜", quantity: "30g" },
      { name: "黃芥末", quantity: "1茶匙（5g）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "瘦牛肉煮熟切成薄片",
      "全麥麵包輕輕烤一下",
      "在麵包上塗黃芥末",
      "鋪上生菜、牛肉片、番茄和芝士",
      "蓋上另一片麵包即可"
    ],
    fatLossTips: [
      "低脂芝士提供鈣質，不增加脂肪",
      "全麥麵包富含纖維，增加飽腹感",
      "牛肉含硒，提升代謝"
    ]
  },
  {
    id: "b-b-10",
    name: "牛肉青瓜乳酪碗",
    protein_type: "beef",
    category: "breakfast",
    kcal: 310,
    protein: 42,
    fat: 8,
    carbs: 14,
    totalWeight: 350,
    ingredients: [
      { name: "瘦牛肉", quantity: "130g" },
      { name: "希臘乳酪", quantity: "100g" },
      { name: "黃瓜", quantity: "80g" },
      { name: "番茄", quantity: "50g" },
      { name: "紅洋蔥", quantity: "20g" },
      { name: "檸檬", quantity: "1/2個（15g）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "瘦牛肉煮熟切成塊狀",
      "黃瓜、番茄切塊",
      "將希臘乳酪放入碗中",
      "加入所有蔬菜和牛肉",
      "淋上檸檬汁，調味享用"
    ],
    fatLossTips: [
      "希臘乳酪高蛋白低脂，完美減脂食材",
      "黃瓜含水量高，低卡高纖",
      "牛肉含維生素B12，促進能量代謝"
    ]
  }
];

const breakfastSeafood: RecipeData[] = [
  {
    id: "b-s-1",
    name: "三文魚牛油果早餐碗",
    protein_type: "seafood",
    category: "breakfast",
    kcal: 340,
    protein: 40,
    fat: 12,
    carbs: 16,
    totalWeight: 380,
    ingredients: [
      { name: "三文魚", quantity: "120g" },
      { name: "牛油果", quantity: "1/2個（60g）" },
      { name: "番茄", quantity: "80g" },
      { name: "菠菜", quantity: "50g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "三文魚煮熟或蒸熟後切成塊狀",
      "牛油果切半，用叉子壓成泥狀",
      "番茄和菠菜切成適當大小",
      "將所有材料放入碗中",
      "淋上檸檬汁和橄欖油，調味享用"
    ],
    fatLossTips: [
      "三文魚含Omega-3脂肪酸，促進脂肪燃燒",
      "牛油果含健康脂肪，增加飽腹感",
      "菠菜含鐵質，提升新陳代謝"
    ]
  },
  {
    id: "b-s-2",
    name: "蝦仁蛋白炒菠菜",
    protein_type: "seafood",
    category: "breakfast",
    kcal: 300,
    protein: 41,
    fat: 8,
    carbs: 12,
    totalWeight: 340,
    ingredients: [
      { name: "蝦仁", quantity: "120g" },
      { name: "蛋白", quantity: "2個" },
      { name: "菠菜", quantity: "100g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "大蒜", quantity: "2瓣（10g）" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "蝦仁洗淨瀝乾",
      "用中火炒蝦仁至變紅",
      "加入洋蔥和大蒜炒香",
      "加入菠菜繼續炒",
      "打入蛋白液，炒至蛋白完全凝固"
    ],
    fatLossTips: [
      "蝦仁低脂高蛋白，完美減脂食材",
      "菠菜含葉綠素，促進脂肪分解",
      "蛋白高蛋白低脂，增加飽腹感"
    ]
  },
  {
    id: "b-s-3",
    name: "三文魚全麥吐司",
    protein_type: "seafood",
    category: "breakfast",
    kcal: 370,
    protein: 38,
    fat: 11,
    carbs: 27,
    totalWeight: 410,
    ingredients: [
      { name: "三文魚", quantity: "100g" },
      { name: "全麥吐司", quantity: "2片（60g）" },
      { name: "低脂乳酪", quantity: "2湯匙（30g）" },
      { name: "番茄", quantity: "60g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "三文魚煮熟或蒸熟後切成薄片",
      "全麥吐司放入烤麵包機烤至金黃",
      "在吐司上塗上低脂乳酪",
      "放上三文魚片、番茄和黃瓜",
      "淋上檸檬汁即可"
    ],
    fatLossTips: [
      "全麥吐司富含纖維，增加飽腹感",
      "三文魚含Omega-3，促進脂肪燃燒",
      "低脂乳酪提供鈣質，不增加脂肪"
    ]
  },
  {
    id: "b-s-4",
    name: "蝦仁藜麥早餐碗",
    protein_type: "seafood",
    category: "breakfast",
    kcal: 350,
    protein: 39,
    fat: 10,
    carbs: 26,
    totalWeight: 400,
    ingredients: [
      { name: "蝦仁", quantity: "120g" },
      { name: "藜麥", quantity: "50g" },
      { name: "番茄", quantity: "80g" },
      { name: "黃瓜", quantity: "60g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "檸檬汁", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "藜麥煮熟後冷卻",
      "蝦仁炒至變紅",
      "蔬菜切成小塊",
      "將所有材料混合",
      "淋上檸檬汁，調味享用"
    ],
    fatLossTips: [
      "藜麥含完整蛋白質，營養豐富",
      "蝦仁搭配藜麥，蛋白質互補",
      "檸檬汁促進脂肪分解和代謝"
    ]
  },
  {
    id: "b-s-5",
    name: "吞拿魚蛋白沙律",
    protein_type: "seafood",
    category: "breakfast",
    kcal: 310,
    protein: 42,
    fat: 9,
    carbs: 13,
    totalWeight: 360,
    ingredients: [
      { name: "吞拿魚罐頭（水浸）", quantity: "100g" },
      { name: "蛋白", quantity: "2個" },
      { name: "混合生菜", quantity: "80g" },
      { name: "番茄", quantity: "60g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "檸檬汁", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "吞拿魚罐頭瀝乾",
      "蛋白煮熟後切成塊狀",
      "生菜洗淨瀝乾",
      "番茄和黃瓜切成塊",
      "將所有材料混合，淋上檸檬汁"
    ],
    fatLossTips: [
      "吞拿魚低脂高蛋白，完美減脂食材",
      "蛋白高蛋白低脂，增加飽腹感",
      "檸檬汁幫助消化，加快代謝"
    ]
  },
  {
    id: "b-s-6",
    name: "蝦仁番茄早餐碗",
    protein_type: "seafood",
    category: "breakfast",
    kcal: 320,
    protein: 40,
    fat: 8,
    carbs: 17,
    totalWeight: 370,
    ingredients: [
      { name: "蝦仁", quantity: "130g" },
      { name: "番茄", quantity: "120g" },
      { name: "洋蔥", quantity: "50g" },
      { name: "大蒜", quantity: "2瓣（10g）" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "香草", quantity: "1g" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "蝦仁洗淨瀝乾",
      "番茄切成塊狀",
      "用中火炒蝦仁至變紅",
      "加入洋蔥、大蒜和番茄",
      "燉至蝦仁熟透，番茄出汁"
    ],
    fatLossTips: [
      "番茄含番茄紅素，抗氧化效果強",
      "蝦仁搭配番茄，營養互補",
      "低油烹飪方式，減少熱量攝入"
    ]
  },
  {
    id: "b-s-7",
    name: "三文魚乳酪碗",
    protein_type: "seafood",
    category: "breakfast",
    kcal: 330,
    protein: 39,
    fat: 11,
    carbs: 15,
    totalWeight: 370,
    ingredients: [
      { name: "三文魚", quantity: "110g" },
      { name: "希臘乳酪", quantity: "100g" },
      { name: "黃瓜", quantity: "80g" },
      { name: "番茄", quantity: "50g" },
      { name: "紅洋蔥", quantity: "20g" },
      { name: "檸檬", quantity: "1/2個（15g）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "三文魚煮熟或蒸熟後切成塊狀",
      "黃瓜、番茄切塊",
      "將希臘乳酪放入碗中",
      "加入所有蔬菜和三文魚",
      "淋上檸檬汁，調味享用"
    ],
    fatLossTips: [
      "希臘乳酪高蛋白低脂，完美減脂食材",
      "黃瓜含水量高，低卡高纖",
      "三文魚含Omega-3，促進脂肪燃燒"
    ]
  },
  {
    id: "b-s-8",
    name: "蝦仁燕麥鹹粥",
    protein_type: "seafood",
    category: "breakfast",
    kcal: 340,
    protein: 37,
    fat: 9,
    carbs: 31,
    totalWeight: 410,
    ingredients: [
      { name: "蝦仁", quantity: "100g" },
      { name: "燕麥", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "香菇", quantity: "40g" },
      { name: "高湯", quantity: "300ml" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "蝦仁洗淨瀝乾",
      "用高湯煮蝦仁至變紅",
      "加入燕麥和切碎的蔬菜",
      "煮至燕麥軟爛",
      "調味即可"
    ],
    fatLossTips: [
      "燕麥含β-葡聚糖，降低膽固醇",
      "鹹粥飽腹感強，適合減脂",
      "蝦仁提供優質蛋白，促進肌肉生長"
    ]
  },
  {
    id: "b-s-9",
    name: "吞拿魚卷餅",
    protein_type: "seafood",
    category: "breakfast",
    kcal: 330,
    protein: 38,
    fat: 10,
    carbs: 22,
    totalWeight: 380,
    ingredients: [
      { name: "吞拿魚罐頭（水浸）", quantity: "100g" },
      { name: "全麥卷餅", quantity: "1張（50g）" },
      { name: "生菜", quantity: "50g" },
      { name: "番茄", quantity: "60g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "低脂乳酪", quantity: "2湯匙（30g）" },
      { name: "檸檬汁", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "吞拿魚罐頭瀝乾",
      "全麥卷餅鋪平",
      "在卷餅上塗上低脂乳酪",
      "鋪上生菜、吞拿魚、番茄和黃瓜",
      "淋上檸檬汁，捲起享用"
    ],
    fatLossTips: [
      "全麥卷餅富含纖維，增加飽腹感",
      "吞拿魚低脂高蛋白，完美減脂食材",
      "檸檬汁幫助消化，加快代謝"
    ]
  },
  {
    id: "b-s-10",
    name: "三文魚菠菜蛋卷",
    protein_type: "seafood",
    category: "breakfast",
    kcal: 340,
    protein: 40,
    fat: 12,
    carbs: 14,
    totalWeight: 370,
    ingredients: [
      { name: "三文魚", quantity: "100g" },
      { name: "蛋", quantity: "2個" },
      { name: "菠菜", quantity: "80g" },
      { name: "洋蔥", quantity: "30g" },
      { name: "大蒜", quantity: "1瓣（5g）" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "三文魚切成小塊",
      "菠菜洗淨瀝乾",
      "用中火炒三文魚至半熟",
      "加入菠菜和洋蔥炒香",
      "打入蛋液，卷起後炒至蛋液完全凝固"
    ],
    fatLossTips: [
      "菠菜含葉綠素，促進脂肪分解",
      "三文魚含Omega-3，促進脂肪燃燒",
      "蛋含膽鹼，增強大腦功能"
    ]
  }
];

const breakfastEgg: RecipeData[] = [
  {
    id: "b-e-1",
    name: "蛋白菠菜早餐碗",
    protein_type: "egg",
    category: "breakfast",
    kcal: 280,
    protein: 38,
    fat: 7,
    carbs: 14,
    totalWeight: 340,
    ingredients: [
      { name: "蛋白", quantity: "3個" },
      { name: "菠菜", quantity: "100g" },
      { name: "番茄", quantity: "80g" },
      { name: "洋蔥", quantity: "30g" },
      { name: "大蒜", quantity: "2瓣（10g）" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "菠菜洗淨瀝乾",
      "番茄切成塊狀",
      "用中火炒洋蔥和大蒜",
      "加入菠菜和番茄炒香",
      "打入蛋白液，炒至完全凝固"
    ],
    fatLossTips: [
      "蛋白低脂高蛋白，完美減脂食材",
      "菠菜含鐵質，提升新陳代謝",
      "番茄低卡高纖，促進消化"
    ]
  },
  {
    id: "b-e-2",
    name: "蛋白牛油果吐司",
    protein_type: "egg",
    category: "breakfast",
    kcal: 320,
    protein: 36,
    fat: 10,
    carbs: 24,
    totalWeight: 380,
    ingredients: [
      { name: "蛋白", quantity: "2個" },
      { name: "全麥吐司", quantity: "2片（60g）" },
      { name: "牛油果", quantity: "1/2個（60g）" },
      { name: "番茄", quantity: "60g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "黑椒", quantity: "0.5g" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "蛋白煮熟後切成片狀",
      "全麥吐司放入烤麵包機烤至金黃",
      "牛油果切半，用叉子壓成泥狀",
      "在吐司上塗上牛油果泥",
      "放上蛋白片和番茄片，淋上檸檬汁"
    ],
    fatLossTips: [
      "全麥吐司富含纖維，增加飽腹感",
      "牛油果含健康脂肪，促進脂肪燃燒",
      "蛋白低脂高蛋白，增加飽腹感"
    ]
  },
  {
    id: "b-e-3",
    name: "雙蛋白藜麥碗",
    protein_type: "egg",
    category: "breakfast",
    kcal: 310,
    protein: 40,
    fat: 8,
    carbs: 22,
    totalWeight: 370,
    ingredients: [
      { name: "蛋白", quantity: "3個" },
      { name: "藜麥", quantity: "50g" },
      { name: "番茄", quantity: "80g" },
      { name: "黃瓜", quantity: "60g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "檸檬汁", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "藜麥煮熟後冷卻",
      "蛋白煮熟後切成塊狀",
      "蔬菜切成小塊",
      "將所有材料混合",
      "淋上檸檬汁，調味享用"
    ],
    fatLossTips: [
      "藜麥含完整蛋白質，營養豐富",
      "蛋白搭配藜麥，蛋白質互補",
      "檸檬汁促進脂肪分解和代謝"
    ]
  },
  {
    id: "b-e-4",
    name: "番茄蛋白早餐碗",
    protein_type: "egg",
    category: "breakfast",
    kcal: 290,
    protein: 39,
    fat: 7,
    carbs: 15,
    totalWeight: 360,
    ingredients: [
      { name: "蛋白", quantity: "3個" },
      { name: "番茄", quantity: "120g" },
      { name: "洋蔥", quantity: "50g" },
      { name: "大蒜", quantity: "2瓣（10g）" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "香草", quantity: "1g" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "番茄切成塊狀",
      "用中火炒洋蔥和大蒜",
      "加入番茄燉至出汁",
      "打入蛋白液攪拌均勻",
      "炒至蛋白完全凝固"
    ],
    fatLossTips: [
      "番茄含番茄紅素，抗氧化效果強",
      "蛋白搭配番茄，營養互補",
      "低油烹飪方式，減少熱量攝入"
    ]
  },
  {
    id: "b-e-5",
    name: "蛋白生菜卷",
    protein_type: "egg",
    category: "breakfast",
    kcal: 270,
    protein: 37,
    fat: 7,
    carbs: 12,
    totalWeight: 330,
    ingredients: [
      { name: "蛋白", quantity: "2個" },
      { name: "生菜葉", quantity: "4片（80g）" },
      { name: "番茄", quantity: "60g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "紅洋蔥", quantity: "20g" },
      { name: "檸檬汁", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "蛋白煮熟後切成片狀",
      "生菜葉洗淨瀝乾",
      "番茄和黃瓜切成條狀",
      "在生菜葉上鋪上蛋白、蔬菜",
      "淋上檸檬汁，捲起享用"
    ],
    fatLossTips: [
      "生菜低卡高纖，增加飽腹感",
      "蛋白低脂高蛋白，完美減脂食材",
      "檸檬汁幫助消化，加快代謝"
    ]
  },
  {
    id: "b-e-6",
    name: "蛋白燕麥粥",
    protein_type: "egg",
    category: "breakfast",
    kcal: 300,
    protein: 36,
    fat: 7,
    carbs: 28,
    totalWeight: 380,
    ingredients: [
      { name: "蛋白", quantity: "2個" },
      { name: "燕麥", quantity: "50g" },
      { name: "牛奶（低脂）", quantity: "200ml" },
      { name: "香蕉", quantity: "1/2根（50g）" },
      { name: "藍莓", quantity: "30g" },
      { name: "蜂蜜", quantity: "1茶匙（5g）" },
      { name: "鹽", quantity: "0.5g" }
    ],
    steps: [
      "燕麥加入牛奶煮至軟爛",
      "蛋白煮熟後切成小塊",
      "香蕉切成片狀",
      "將燕麥粥倒入碗中",
      "加入蛋白、香蕉、藍莓和蜂蜜"
    ],
    fatLossTips: [
      "燕麥含β-葡聚糖，降低膽固醇",
      "蛋白低脂高蛋白，增加飽腹感",
      "藍莓含抗氧化物，促進脂肪分解"
    ]
  },
  {
    id: "b-e-7",
    name: "蛋白乳酪碗",
    protein_type: "egg",
    category: "breakfast",
    kcal: 310,
    protein: 40,
    fat: 9,
    carbs: 13,
    totalWeight: 360,
    ingredients: [
      { name: "蛋白", quantity: "3個" },
      { name: "希臘乳酪", quantity: "100g" },
      { name: "黃瓜", quantity: "80g" },
      { name: "番茄", quantity: "50g" },
      { name: "紅洋蔥", quantity: "20g" },
      { name: "檸檬", quantity: "1/2個（15g）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "蛋白煮熟後切成塊狀",
      "黃瓜、番茄切塊",
      "將希臘乳酪放入碗中",
      "加入所有蔬菜和蛋白",
      "淋上檸檬汁，調味享用"
    ],
    fatLossTips: [
      "希臘乳酪高蛋白低脂，完美減脂食材",
      "黃瓜含水量高，低卡高纖",
      "蛋白低脂高蛋白，增加飽腹感"
    ]
  },
  {
    id: "b-e-8",
    name: "蘑菇蛋白炒",
    protein_type: "egg",
    category: "breakfast",
    kcal: 290,
    protein: 39,
    fat: 8,
    carbs: 12,
    totalWeight: 350,
    ingredients: [
      { name: "蛋白", quantity: "3個" },
      { name: "蘑菇", quantity: "100g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "大蒜", quantity: "2瓣（10g）" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "蘑菇切片",
      "用中火炒洋蔥和大蒜",
      "加入蘑菇繼續炒",
      "打入蛋白液攪拌均勻",
      "炒至蛋白完全凝固即可"
    ],
    fatLossTips: [
      "蘑菇含多糖體，增強免疫力",
      "蛋白搭配蘑菇，蛋白質互補",
      "低油烹飪方式，減少熱量攝入"
    ]
  },
  {
    id: "b-e-9",
    name: "蛋白全麥三文治",
    protein_type: "egg",
    category: "breakfast",
    kcal: 320,
    protein: 37,
    fat: 10,
    carbs: 23,
    totalWeight: 380,
    ingredients: [
      { name: "蛋白", quantity: "2個" },
      { name: "全麥麵包", quantity: "2片（60g）" },
      { name: "低脂芝士", quantity: "1片（20g）" },
      { name: "番茄", quantity: "50g" },
      { name: "生菜", quantity: "30g" },
      { name: "黃芥末", quantity: "1茶匙（5g）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "蛋白煮熟後切成片狀",
      "全麥麵包輕輕烤一下",
      "在麵包上塗黃芥末",
      "鋪上生菜、蛋白片、番茄和芝士",
      "蓋上另一片麵包即可"
    ],
    fatLossTips: [
      "低脂芝士提供鈣質，不增加脂肪",
      "全麥麵包富含纖維，增加飽腹感",
      "蛋白低脂高蛋白，完美減脂食材"
    ]
  },
  {
    id: "b-e-10",
    name: "蛋白蔬菜卷餅",
    protein_type: "egg",
    category: "breakfast",
    kcal: 300,
    protein: 38,
    fat: 8,
    carbs: 20,
    totalWeight: 360,
    ingredients: [
      { name: "蛋白", quantity: "2個" },
      { name: "全麥卷餅", quantity: "1張（50g）" },
      { name: "生菜", quantity: "50g" },
      { name: "番茄", quantity: "60g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "低脂乳酪", quantity: "2湯匙（30g）" },
      { name: "檸檬汁", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "蛋白煮熟後切成片狀",
      "全麥卷餅鋪平",
      "在卷餅上塗上低脂乳酪",
      "鋪上生菜、蛋白、番茄和黃瓜",
      "淋上檸檬汁，捲起享用"
    ],
    fatLossTips: [
      "全麥卷餅富含纖維，增加飽腹感",
      "蛋白低脂高蛋白，完美減脂食材",
      "檸檬汁幫助消化，加快代謝"
    ]
  }
];

const breakfastVegetarian: RecipeData[] = [
  {
    id: "b-v-1",
    name: "牛油果藜麥早餐碗",
    protein_type: "vegetarian",
    category: "breakfast",
    kcal: 340,
    protein: 12,
    fat: 14,
    carbs: 38,
    totalWeight: 400,
    ingredients: [
      { name: "牛油果", quantity: "1個（120g）" },
      { name: "藜麥", quantity: "60g" },
      { name: "番茄", quantity: "80g" },
      { name: "黃瓜", quantity: "60g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "檸檬汁", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "藜麥煮熟後冷卻",
      "牛油果切半，用叉子壓成泥狀",
      "蔬菜切成小塊",
      "將所有材料混合",
      "淋上檸檬汁，調味享用"
    ],
    fatLossTips: [
      "藜麥含完整蛋白質，營養豐富",
      "牛油果含健康脂肪，促進脂肪燃燒",
      "檸檬汁促進脂肪分解和代謝"
    ]
  },
  {
    id: "b-v-2",
    name: "燕麥堅果碗",
    protein_type: "vegetarian",
    category: "breakfast",
    kcal: 330,
    protein: 11,
    fat: 13,
    carbs: 40,
    totalWeight: 390,
    ingredients: [
      { name: "燕麥", quantity: "60g" },
      { name: "牛奶（低脂）", quantity: "200ml" },
      { name: "杏仁", quantity: "20g" },
      { name: "核桃", quantity: "15g" },
      { name: "藍莓", quantity: "50g" },
      { name: "蜂蜜", quantity: "1茶匙（5g）" },
      { name: "肉桂粉", quantity: "0.5g" }
    ],
    steps: [
      "燕麥加入牛奶煮至軟爛",
      "堅果切碎",
      "將燕麥粥倒入碗中",
      "加入堅果、藍莓和蜂蜜",
      "灑上肉桂粉即可"
    ],
    fatLossTips: [
      "燕麥含β-葡聚糖，降低膽固醇",
      "堅果含健康脂肪，增加飽腹感",
      "藍莓含抗氧化物，促進脂肪分解"
    ]
  },
  {
    id: "b-v-3",
    name: "菠菜蘑菇植物蛋早餐碗",
    protein_type: "vegetarian",
    category: "breakfast",
    kcal: 310,
    protein: 13,
    fat: 10,
    carbs: 35,
    totalWeight: 380,
    ingredients: [
      { name: "植物蛋", quantity: "100g" },
      { name: "菠菜", quantity: "80g" },
      { name: "蘑菇", quantity: "100g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "大蒜", quantity: "2瓣（10g）" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "植物蛋切成塊狀",
      "蘑菇切片",
      "用中火炒洋蔥和大蒜",
      "加入蘑菇、菠菜和植物蛋",
      "炒至所有材料熟透即可"
    ],
    fatLossTips: [
      "植物蛋低脂高蛋白，完美素食選擇",
      "菠菜含鐵質，提升新陳代謝",
      "蘑菇含多糖體，增強免疫力"
    ]
  },
  {
    id: "b-v-4",
    name: "豆腐蔬菜碗",
    protein_type: "vegetarian",
    category: "breakfast",
    kcal: 300,
    protein: 14,
    fat: 9,
    carbs: 32,
    totalWeight: 370,
    ingredients: [
      { name: "豆腐", quantity: "150g" },
      { name: "番茄", quantity: "80g" },
      { name: "黃瓜", quantity: "60g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "大蒜", quantity: "2瓣（10g）" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "豆腐切成塊狀",
      "番茄和黃瓜切成小塊",
      "用中火炒洋蔥和大蒜",
      "加入豆腐和蔬菜",
      "炒至所有材料熟透即可"
    ],
    fatLossTips: [
      "豆腐低脂高蛋白，完美素食蛋白",
      "番茄含番茄紅素，抗氧化效果強",
      "低油烹飪方式，減少熱量攝入"
    ]
  },
  {
    id: "b-v-5",
    name: "藜麥沙律碗",
    protein_type: "vegetarian",
    category: "breakfast",
    kcal: 320,
    protein: 11,
    fat: 11,
    carbs: 38,
    totalWeight: 390,
    ingredients: [
      { name: "藜麥", quantity: "60g" },
      { name: "混合生菜", quantity: "80g" },
      { name: "番茄", quantity: "80g" },
      { name: "黃瓜", quantity: "60g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "檸檬汁", quantity: "1茶匙（5ml）" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "藜麥煮熟後冷卻",
      "生菜洗淨瀝乾",
      "蔬菜切成適當大小",
      "將所有材料混合",
      "淋上檸檬汁和橄欖油，調味享用"
    ],
    fatLossTips: [
      "藜麥含完整蛋白質，營養豐富",
      "生菜低卡高纖，增加飽腹感",
      "檸檬汁促進脂肪分解和代謝"
    ]
  },
  {
    id: "b-v-6",
    name: "牛油果全麥吐司",
    protein_type: "vegetarian",
    category: "breakfast",
    kcal: 330,
    protein: 10,
    fat: 12,
    carbs: 36,
    totalWeight: 380,
    ingredients: [
      { name: "牛油果", quantity: "1/2個（60g）" },
      { name: "全麥吐司", quantity: "2片（60g）" },
      { name: "番茄", quantity: "80g" },
      { name: "生菜", quantity: "30g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "黑椒", quantity: "0.5g" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "全麥吐司放入烤麵包機烤至金黃",
      "牛油果切半，用叉子壓成泥狀",
      "番茄切成片狀",
      "在吐司上塗上牛油果泥",
      "放上生菜和番茄片，淋上檸檬汁"
    ],
    fatLossTips: [
      "全麥吐司富含纖維，增加飽腹感",
      "牛油果含健康脂肪，促進脂肪燃燒",
      "檸檬汁幫助消化，加快代謝"
    ]
  },
  {
    id: "b-v-7",
    name: "豆腐番茄早餐碗",
    protein_type: "vegetarian",
    category: "breakfast",
    kcal: 310,
    protein: 13,
    fat: 9,
    carbs: 34,
    totalWeight: 380,
    ingredients: [
      { name: "豆腐", quantity: "150g" },
      { name: "番茄", quantity: "120g" },
      { name: "洋蔥", quantity: "50g" },
      { name: "大蒜", quantity: "2瓣（10g）" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "香草", quantity: "1g" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "豆腐切成塊狀",
      "番茄切成塊狀",
      "用中火炒洋蔥和大蒜",
      "加入豆腐和番茄",
      "燉至番茄出汁，豆腐吸收味道"
    ],
    fatLossTips: [
      "豆腐低脂高蛋白，完美素食蛋白",
      "番茄含番茄紅素，抗氧化效果強",
      "低油烹飪方式，減少熱量攝入"
    ]
  },
  {
    id: "b-v-8",
    name: "植物蛋白早餐卷",
    protein_type: "vegetarian",
    category: "breakfast",
    kcal: 320,
    protein: 12,
    fat: 10,
    carbs: 36,
    totalWeight: 380,
    ingredients: [
      { name: "植物蛋", quantity: "100g" },
      { name: "全麥卷餅", quantity: "1張（50g）" },
      { name: "生菜", quantity: "50g" },
      { name: "番茄", quantity: "60g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "低脂乳酪", quantity: "2湯匙（30g）" },
      { name: "檸檬汁", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "植物蛋煮熟後切成片狀",
      "全麥卷餅鋪平",
      "在卷餅上塗上低脂乳酪",
      "鋪上生菜、植物蛋、番茄和黃瓜",
      "淋上檸檬汁，捲起享用"
    ],
    fatLossTips: [
      "全麥卷餅富含纖維，增加飽腹感",
      "植物蛋低脂高蛋白，完美素食選擇",
      "檸檬汁幫助消化，加快代謝"
    ]
  },
  {
    id: "b-v-9",
    name: "蔬菜燕麥粥",
    protein_type: "vegetarian",
    category: "breakfast",
    kcal: 300,
    protein: 10,
    fat: 8,
    carbs: 42,
    totalWeight: 400,
    ingredients: [
      { name: "燕麥", quantity: "60g" },
      { name: "牛奶（低脂）", quantity: "200ml" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "玉米", quantity: "40g" },
      { name: "豌豆", quantity: "40g" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "燕麥加入牛奶煮至軟爛",
      "蔬菜切成小塊",
      "加入蔬菜繼續煮",
      "煮至蔬菜軟熟",
      "調味後盛碟享用"
    ],
    fatLossTips: [
      "燕麥含β-葡聚糖，降低膽固醇",
      "蔬菜低卡高纖，增加飽腹感",
      "鹹粥飽腹感強，適合減脂"
    ]
  },
  {
    id: "b-v-10",
    name: "鷹嘴豆早餐碗",
    protein_type: "vegetarian",
    category: "breakfast",
    kcal: 330,
    protein: 12,
    fat: 11,
    carbs: 40,
    totalWeight: 390,
    ingredients: [
      { name: "鷹嘴豆", quantity: "100g" },
      { name: "番茄", quantity: "80g" },
      { name: "黃瓜", quantity: "60g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "香菜", quantity: "10g" },
      { name: "檸檬汁", quantity: "1茶匙（5ml）" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "鷹嘴豆煮熟或使用罐頭鷹嘴豆",
      "蔬菜切成小塊",
      "將所有材料混合",
      "淋上檸檬汁和橄欖油",
      "調味享用"
    ],
    fatLossTips: [
      "鷹嘴豆含豐富纖維，增加飽腹感",
      "植物蛋白質完整，營養豐富",
      "低脂高纖，完美素食選擇"
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

const lunchPork: RecipeData[] = [
  {
    id: "l-p-1",
    name: "香煎豬扒配糙米飯",
    protein_type: "pork",
    category: "lunch",
    kcal: 420,
    protein: 42,
    fat: 14,
    carbs: 32,
    totalWeight: 520,
    ingredients: [
      { name: "豬里肌", quantity: "180g" },
      { name: "糙米", quantity: "80g" },
      { name: "西蘭花", quantity: "70g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "豬里肌用中火煎至兩面金黃",
      "西蘭花和紅蘿蔔炒熟",
      "將豬肉切成片狀",
      "盛碟並調味享用"
    ],
    fatLossTips: [
      "豬里肌是瘦肉，蛋白質豐富",
      "糙米低GI，穩定血糖",
      "西蘭花含硫化物，促進脂肪燃燒"
    ]
  },
  {
    id: "l-p-2",
    name: "豬肉蔬菜炒飯",
    protein_type: "pork",
    category: "lunch",
    kcal: 410,
    protein: 40,
    fat: 13,
    carbs: 35,
    totalWeight: 500,
    ingredients: [
      { name: "豬里肌", quantity: "160g" },
      { name: "糙米", quantity: "80g" },
      { name: "紅椒", quantity: "60g" },
      { name: "豌豆", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1.5g" }
    ],
    steps: [
      "豬肉切塊炒至熟透",
      "加入紅椒、豌豆、洋蔥炒勻",
      "加入糙米混合",
      "加入大蒜調味",
      "盛碟享用"
    ],
    fatLossTips: [
      "豬里肌低脂高蛋白",
      "彩色蔬菜含多種維生素",
      "炒飯易於消化吸收"
    ]
  },
  {
    id: "l-p-3",
    name: "豬肉黑豆飯",
    protein_type: "pork",
    category: "lunch",
    kcal: 430,
    protein: 41,
    fat: 12,
    carbs: 38,
    totalWeight: 530,
    ingredients: [
      { name: "豬里肌", quantity: "170g" },
      { name: "糙米", quantity: "80g" },
      { name: "黑豆", quantity: "60g" },
      { name: "紅椒", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米和黑豆一起煮熟",
      "豬肉切塊炒至熟透",
      "加入紅椒和洋蔥炒勻",
      "混合米豆混合物",
      "調味後盛碟"
    ],
    fatLossTips: [
      "黑豆含花青素，強效抗氧化",
      "黑豆高纖低GI，穩定血糖",
      "豬肉搭配豆類，蛋白質互補"
    ]
  },
  {
    id: "l-p-4",
    name: "蒜香豬里肌蔬菜碗",
    protein_type: "pork",
    category: "lunch",
    kcal: 400,
    protein: 42,
    fat: 11,
    carbs: 30,
    totalWeight: 490,
    ingredients: [
      { name: "豬里肌", quantity: "170g" },
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
      "豬肉切塊炒至熟透",
      "加入大蒜爆香",
      "加入西蘭花和紅蘿蔔炒勻",
      "混合糙米，調味盛碟"
    ],
    fatLossTips: [
      "大蒜含硫化物，促進脂肪燃燒",
      "豬里肌蛋白質高，飽腹感強",
      "蔬菜富含纖維，促進消化"
    ]
  },
  {
    id: "l-p-5",
    name: "豬肉番茄意粉",
    protein_type: "pork",
    category: "lunch",
    kcal: 420,
    protein: 39,
    fat: 12,
    carbs: 40,
    totalWeight: 500,
    ingredients: [
      { name: "豬里肌", quantity: "150g" },
      { name: "全麥意粉", quantity: "80g" },
      { name: "番茄罐頭", quantity: "200g" },
      { name: "洋蔥", quantity: "50g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "全麥意粉煮至半熟",
      "豬肉切塊炒至熟透",
      "加入洋蔥和大蒜爆香",
      "加入番茄罐頭燉煮",
      "混合意粉，調味享用"
    ],
    fatLossTips: [
      "全麥意粉富含纖維，增加飽腹感",
      "番茄含茄紅素，抗氧化",
      "豬肉提供優質蛋白質"
    ]
  },
  {
    id: "l-p-6",
    name: "豬肉藜麥飯碗",
    protein_type: "pork",
    category: "lunch",
    kcal: 410,
    protein: 41,
    fat: 11,
    carbs: 36,
    totalWeight: 510,
    ingredients: [
      { name: "豬里肌", quantity: "160g" },
      { name: "藜麥", quantity: "80g" },
      { name: "紅椒", quantity: "60g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1.5g" }
    ],
    steps: [
      "藜麥煮熟",
      "豬肉切塊炒至熟透",
      "混合紅椒、黃瓜、洋蔥",
      "加入豬肉和藜麥",
      "淋上橄欖油和檸檬汁，調味享用"
    ],
    fatLossTips: [
      "藜麥含完全蛋白質，營養全面",
      "檸檬汁促進消化和脂肪燃燒",
      "豬肉搭配藜麥，蛋白質互補"
    ]
  },
  {
    id: "l-p-7",
    name: "豬肉西蘭花糙米飯",
    protein_type: "pork",
    category: "lunch",
    kcal: 400,
    protein: 41,
    fat: 10,
    carbs: 34,
    totalWeight: 500,
    ingredients: [
      { name: "豬里肌", quantity: "160g" },
      { name: "糙米", quantity: "80g" },
      { name: "西蘭花", quantity: "100g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" },
      { name: "檸檬汁", quantity: "0.5湯匙（7.5ml）" }
    ],
    steps: [
      "糙米煮熟",
      "豬肉切塊炒至熟透",
      "加入大蒜爆香",
      "加入西蘭花炒至熟透",
      "混合糙米，淋上檸檬汁調味"
    ],
    fatLossTips: [
      "西蘭花含硫化物，促進脂肪燃燒",
      "糙米低GI，穩定血糖",
      "豬肉高蛋白，增加飽腹感"
    ]
  },
  {
    id: "l-p-8",
    name: "低脂叉燒飯",
    protein_type: "pork",
    category: "lunch",
    kcal: 430,
    protein: 40,
    fat: 13,
    carbs: 38,
    totalWeight: 520,
    ingredients: [
      { name: "豬里肌", quantity: "170g" },
      { name: "糙米", quantity: "80g" },
      { name: "紅蘿蔔", quantity: "60g" },
      { name: "豌豆", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "蜂蜜", quantity: "1茶匙（5g）" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1.5g" }
    ],
    steps: [
      "豬肉切塊，用蜂蜜醃製",
      "炒至焦香",
      "加入紅蘿蔔、豌豆、洋蔥炒勻",
      "混合糙米",
      "調味後盛碟"
    ],
    fatLossTips: [
      "低脂叉燒，蛋白質豐富",
      "蜂蜜提供天然甜味，低卡",
      "彩色蔬菜營養全面"
    ]
  },
  {
    id: "l-p-9",
    name: "豬肉彩椒炒飯",
    protein_type: "pork",
    category: "lunch",
    kcal: 420,
    protein: 40,
    fat: 12,
    carbs: 36,
    totalWeight: 510,
    ingredients: [
      { name: "豬里肌", quantity: "160g" },
      { name: "糙米", quantity: "80g" },
      { name: "紅椒", quantity: "50g" },
      { name: "黃椒", quantity: "50g" },
      { name: "青椒", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" }
    ],
    steps: [
      "豬肉切塊炒至熟透",
      "加入彩椒和洋蔥炒勻",
      "加入糙米混合",
      "調味後盛碟",
      "享用彩色營養飯"
    ],
    fatLossTips: [
      "彩椒含多種維生素和礦物質",
      "豬肉高蛋白，增加飽腹感",
      "彩色食材，營養更全面"
    ]
  },
  {
    id: "l-p-10",
    name: "豬肉生菜飯卷",
    protein_type: "pork",
    category: "lunch",
    kcal: 380,
    protein: 42,
    fat: 9,
    carbs: 28,
    totalWeight: 450,
    ingredients: [
      { name: "豬里肌", quantity: "150g" },
      { name: "糙米", quantity: "70g" },
      { name: "生菜葉", quantity: "100g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "豬肉切塊炒至熟透",
      "紅蘿蔔和黃瓜切絲",
      "用生菜葉包裹糙米、豬肉和蔬菜",
      "調味享用"
    ],
    fatLossTips: [
      "生菜低卡高纖，增加飽腹感",
      "豬肉提供優質蛋白質",
      "蔬菜豐富，營養全面"
    ]
  }
];

const lunchBeef: RecipeData[] = [
  {
    id: "l-b-1",
    name: "黑椒牛肉糙米飯",
    protein_type: "beef",
    category: "lunch",
    kcal: 440,
    protein: 44,
    fat: 14,
    carbs: 32,
    totalWeight: 530,
    ingredients: [
      { name: "牛肉", quantity: "180g" },
      { name: "糙米", quantity: "80g" },
      { name: "黑椒", quantity: "1g" },
      { name: "洋蔥", quantity: "50g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "檸檬汁", quantity: "0.5湯匙（7.5ml）" }
    ],
    steps: [
      "糙米煮熟",
      "牛肉切塊，用黑椒醃製",
      "用中火煎至兩面焦香",
      "加入洋蔥和大蒜爆香",
      "混合糙米，淋上檸檬汁調味"
    ],
    fatLossTips: [
      "黑椒含胡椒鹼，促進脂肪燃燒",
      "牛肉含鐵質，增強體力",
      "糙米低GI，穩定血糖"
    ]
  },
  {
    id: "l-b-2",
    name: "牛肉西蘭花飯碗",
    protein_type: "beef",
    category: "lunch",
    kcal: 430,
    protein: 43,
    fat: 12,
    carbs: 34,
    totalWeight: 520,
    ingredients: [
      { name: "牛肉", quantity: "170g" },
      { name: "糙米", quantity: "80g" },
      { name: "西蘭花", quantity: "100g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "牛肉切塊炒至熟透",
      "加入大蒜爆香",
      "加入西蘭花和紅蘿蔔炒勻",
      "混合糙米，調味盛碟"
    ],
    fatLossTips: [
      "西蘭花含硫化物，促進脂肪燃燒",
      "牛肉高蛋白，增加飽腹感",
      "蔬菜富含纖維，促進消化"
    ]
  },
  {
    id: "l-b-3",
    name: "牛肉番茄意粉",
    protein_type: "beef",
    category: "lunch",
    kcal: 440,
    protein: 41,
    fat: 13,
    carbs: 40,
    totalWeight: 520,
    ingredients: [
      { name: "牛肉", quantity: "160g" },
      { name: "全麥意粉", quantity: "80g" },
      { name: "番茄罐頭", quantity: "200g" },
      { name: "洋蔥", quantity: "50g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "全麥意粉煮至半熟",
      "牛肉切塊炒至熟透",
      "加入洋蔥和大蒜爆香",
      "加入番茄罐頭燉煮",
      "混合意粉，調味享用"
    ],
    fatLossTips: [
      "全麥意粉富含纖維，增加飽腹感",
      "番茄含茄紅素，抗氧化",
      "牛肉提供優質蛋白質"
    ]
  },
  {
    id: "l-b-4",
    name: "蒜香牛肉蔬菜碗",
    protein_type: "beef",
    category: "lunch",
    kcal: 420,
    protein: 44,
    fat: 11,
    carbs: 30,
    totalWeight: 510,
    ingredients: [
      { name: "牛肉", quantity: "180g" },
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
      "牛肉切塊炒至熟透",
      "加入大蒜爆香",
      "加入西蘭花和紅蘿蔔炒勻",
      "混合糙米，調味盛碟"
    ],
    fatLossTips: [
      "大蒜含硫化物，促進脂肪燃燒",
      "牛肉蛋白質高，飽腹感強",
      "蔬菜富含纖維，促進消化"
    ]
  },
  {
    id: "l-b-5",
    name: "牛肉黑豆飯",
    protein_type: "beef",
    category: "lunch",
    kcal: 450,
    protein: 43,
    fat: 12,
    carbs: 38,
    totalWeight: 540,
    ingredients: [
      { name: "牛肉", quantity: "180g" },
      { name: "糙米", quantity: "80g" },
      { name: "黑豆", quantity: "60g" },
      { name: "紅椒", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米和黑豆一起煮熟",
      "牛肉切塊炒至熟透",
      "加入紅椒和洋蔥炒勻",
      "混合米豆混合物",
      "調味後盛碟"
    ],
    fatLossTips: [
      "黑豆含花青素，強效抗氧化",
      "黑豆高纖低GI，穩定血糖",
      "牛肉搭配豆類，蛋白質互補"
    ]
  },
  {
    id: "l-b-6",
    name: "牛肉藜麥飯",
    protein_type: "beef",
    category: "lunch",
    kcal: 430,
    protein: 43,
    fat: 11,
    carbs: 36,
    totalWeight: 520,
    ingredients: [
      { name: "牛肉", quantity: "170g" },
      { name: "藜麥", quantity: "80g" },
      { name: "紅椒", quantity: "60g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1.5g" }
    ],
    steps: [
      "藜麥煮熟",
      "牛肉切塊炒至熟透",
      "混合紅椒、黃瓜、洋蔥",
      "加入牛肉和藜麥",
      "淋上橄欖油和檸檬汁，調味享用"
    ],
    fatLossTips: [
      "藜麥含完全蛋白質，營養全面",
      "檸檬汁促進消化和脂肪燃燒",
      "牛肉搭配藜麥，蛋白質互補"
    ]
  },
  {
    id: "l-b-7",
    name: "牛肉彩椒炒飯",
    protein_type: "beef",
    category: "lunch",
    kcal: 440,
    protein: 42,
    fat: 12,
    carbs: 36,
    totalWeight: 520,
    ingredients: [
      { name: "牛肉", quantity: "170g" },
      { name: "糙米", quantity: "80g" },
      { name: "紅椒", quantity: "50g" },
      { name: "黃椒", quantity: "50g" },
      { name: "青椒", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" }
    ],
    steps: [
      "牛肉切塊炒至熟透",
      "加入彩椒和洋蔥炒勻",
      "加入糙米混合",
      "調味後盛碟",
      "享用彩色營養飯"
    ],
    fatLossTips: [
      "彩椒含多種維生素和礦物質",
      "牛肉高蛋白，增加飽腹感",
      "彩色食材，營養更全面"
    ]
  },
  {
    id: "l-b-8",
    name: "牛肉蘑菇糙米飯",
    protein_type: "beef",
    category: "lunch",
    kcal: 420,
    protein: 43,
    fat: 10,
    carbs: 34,
    totalWeight: 510,
    ingredients: [
      { name: "牛肉", quantity: "170g" },
      { name: "糙米", quantity: "80g" },
      { name: "蘑菇", quantity: "100g" },
      { name: "洋蔥", quantity: "50g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "牛肉切塊炒至熟透",
      "加入蘑菇、洋蔥和大蒜炒勻",
      "混合糙米",
      "調味後盛碟"
    ],
    fatLossTips: [
      "蘑菇低卡高纖，增加飽腹感",
      "牛肉高蛋白，增加肌肉質量",
      "糙米低GI，穩定血糖"
    ]
  },
  {
    id: "l-b-9",
    name: "牛肉生菜飯卷",
    protein_type: "beef",
    category: "lunch",
    kcal: 400,
    protein: 44,
    fat: 9,
    carbs: 28,
    totalWeight: 460,
    ingredients: [
      { name: "牛肉", quantity: "170g" },
      { name: "糙米", quantity: "70g" },
      { name: "生菜葉", quantity: "100g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "牛肉切塊炒至熟透",
      "紅蘿蔔和黃瓜切絲",
      "用生菜葉包裹糙米、牛肉和蔬菜",
      "調味享用"
    ],
    fatLossTips: [
      "生菜低卡高纖，增加飽腹感",
      "牛肉提供優質蛋白質",
      "蔬菜豐富，營養全面"
    ]
  },
  {
    id: "l-b-10",
    name: "牛肉粟米飯碗",
    protein_type: "beef",
    category: "lunch",
    kcal: 430,
    protein: 42,
    fat: 12,
    carbs: 36,
    totalWeight: 520,
    ingredients: [
      { name: "牛肉", quantity: "170g" },
      { name: "糙米", quantity: "80g" },
      { name: "粟米", quantity: "80g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "牛肉切塊炒至熟透",
      "加入粟米、紅蘿蔔、洋蔥炒勻",
      "混合糙米",
      "調味後盛碟"
    ],
    fatLossTips: [
      "粟米含纖維，促進消化",
      "牛肉高蛋白，增加飽腹感",
      "糙米低GI，穩定血糖"
    ]
  }
];

const lunchSeafood: RecipeData[] = [
  {
    id: "l-s-1",
    name: "三文魚糙米飯",
    protein_type: "seafood",
    category: "lunch",
    kcal: 420,
    protein: 42,
    fat: 13,
    carbs: 32,
    totalWeight: 520,
    ingredients: [
      { name: "三文魚", quantity: "170g" },
      { name: "糙米", quantity: "80g" },
      { name: "西蘭花", quantity: "80g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "三文魚用中火煎至半熟",
      "加入西蘭花和紅蘿蔔炒勻",
      "混合糙米",
      "淋上檸檬汁調味"
    ],
    fatLossTips: [
      "三文魚含Omega-3，促進脂肪燃燒",
      "西蘭花含硫化物，增強代謝",
      "糙米低GI，穩定血糖"
    ]
  },
  {
    id: "l-s-2",
    name: "蒜蓉蝦藜麥碗",
    protein_type: "seafood",
    category: "lunch",
    kcal: 400,
    protein: 41,
    fat: 10,
    carbs: 34,
    totalWeight: 500,
    ingredients: [
      { name: "蝦仁", quantity: "160g" },
      { name: "藜麥", quantity: "80g" },
      { name: "紅椒", quantity: "60g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "大蒜", quantity: "3瓣" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1.5g" }
    ],
    steps: [
      "藜麥煮熟",
      "大蒜爆香後加入蝦仁炒至變紅",
      "混合紅椒和黃瓜",
      "加入藜麥混合",
      "淋上檸檬汁調味享用"
    ],
    fatLossTips: [
      "蝦仁低脂高蛋白，完美午餐",
      "藜麥含完全蛋白質，營養全面",
      "大蒜促進脂肪燃燒"
    ]
  },
  {
    id: "l-s-3",
    name: "吞拿魚番茄意粉",
    protein_type: "seafood",
    category: "lunch",
    kcal: 410,
    protein: 40,
    fat: 11,
    carbs: 40,
    totalWeight: 510,
    ingredients: [
      { name: "吞拿魚罐頭", quantity: "150g" },
      { name: "全麥意粉", quantity: "80g" },
      { name: "番茄罐頭", quantity: "200g" },
      { name: "洋蔥", quantity: "50g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "全麥意粉煮至半熟",
      "洋蔥和大蒜爆香",
      "加入番茄罐頭和吞拿魚燉煮",
      "混合意粉",
      "調味享用"
    ],
    fatLossTips: [
      "吞拿魚高蛋白低脂",
      "全麥意粉富含纖維",
      "番茄含茄紅素，抗氧化"
    ]
  },
  {
    id: "l-s-4",
    name: "三文魚西蘭花飯碗",
    protein_type: "seafood",
    category: "lunch",
    kcal: 430,
    protein: 43,
    fat: 12,
    carbs: 34,
    totalWeight: 520,
    ingredients: [
      { name: "三文魚", quantity: "170g" },
      { name: "糙米", quantity: "80g" },
      { name: "西蘭花", quantity: "100g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "三文魚用中火煎至熟透",
      "加入大蒜爆香",
      "加入西蘭花和紅蘿蔔炒勻",
      "混合糙米，調味盛碟"
    ],
    fatLossTips: [
      "三文魚含Omega-3，促進脂肪燃燒",
      "西蘭花含硫化物，增強代謝",
      "蔬菜富含纖維，促進消化"
    ]
  },
  {
    id: "l-s-5",
    name: "蝦仁彩椒炒飯",
    protein_type: "seafood",
    category: "lunch",
    kcal: 410,
    protein: 40,
    fat: 11,
    carbs: 36,
    totalWeight: 510,
    ingredients: [
      { name: "蝦仁", quantity: "160g" },
      { name: "糙米", quantity: "80g" },
      { name: "紅椒", quantity: "50g" },
      { name: "黃椒", quantity: "50g" },
      { name: "青椒", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" }
    ],
    steps: [
      "蝦仁炒至變紅",
      "加入彩椒和洋蔥炒勻",
      "加入糙米混合",
      "調味後盛碟",
      "享用彩色營養飯"
    ],
    fatLossTips: [
      "彩椒含多種維生素和礦物質",
      "蝦仁高蛋白低脂",
      "彩色食材，營養更全面"
    ]
  },
  {
    id: "l-s-6",
    name: "海鮮黑豆飯",
    protein_type: "seafood",
    category: "lunch",
    kcal: 420,
    protein: 41,
    fat: 11,
    carbs: 38,
    totalWeight: 520,
    ingredients: [
      { name: "蝦仁", quantity: "150g" },
      { name: "糙米", quantity: "80g" },
      { name: "黑豆", quantity: "60g" },
      { name: "紅椒", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米和黑豆一起煮熟",
      "蝦仁炒至變紅",
      "加入紅椒和洋蔥炒勻",
      "混合米豆混合物",
      "調味後盛碟"
    ],
    fatLossTips: [
      "黑豆含花青素，強效抗氧化",
      "黑豆高纖低GI，穩定血糖",
      "蝦仁搭配豆類，蛋白質互補"
    ]
  },
  {
    id: "l-s-7",
    name: "三文魚粟米飯",
    protein_type: "seafood",
    category: "lunch",
    kcal: 430,
    protein: 42,
    fat: 12,
    carbs: 36,
    totalWeight: 530,
    ingredients: [
      { name: "三文魚", quantity: "170g" },
      { name: "糙米", quantity: "80g" },
      { name: "粟米", quantity: "80g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "三文魚用中火煎至熟透",
      "加入粟米、紅蘿蔔、洋蔥炒勻",
      "混合糙米",
      "調味後盛碟"
    ],
    fatLossTips: [
      "三文魚含Omega-3，促進脂肪燃燒",
      "粟米含纖維，促進消化",
      "糙米低GI，穩定血糖"
    ]
  },
  {
    id: "l-s-8",
    name: "蒜香蝦仁糙米飯",
    protein_type: "seafood",
    category: "lunch",
    kcal: 410,
    protein: 41,
    fat: 10,
    carbs: 34,
    totalWeight: 510,
    ingredients: [
      { name: "蝦仁", quantity: "160g" },
      { name: "糙米", quantity: "80g" },
      { name: "西蘭花", quantity: "80g" },
      { name: "紅蘿蔔", quantity: "60g" },
      { name: "大蒜", quantity: "3瓣" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "大蒜爆香後加入蝦仁炒至變紅",
      "加入西蘭花和紅蘿蔔炒勻",
      "混合糙米",
      "調味盛碟"
    ],
    fatLossTips: [
      "大蒜含硫化物，促進脂肪燃燒",
      "蝦仁蛋白質高，飽腹感強",
      "蔬菜富含纖維，促進消化"
    ]
  },
  {
    id: "l-s-9",
    name: "吞拿魚生菜飯卷",
    protein_type: "seafood",
    category: "lunch",
    kcal: 390,
    protein: 42,
    fat: 8,
    carbs: 28,
    totalWeight: 450,
    ingredients: [
      { name: "吞拿魚罐頭", quantity: "150g" },
      { name: "糙米", quantity: "70g" },
      { name: "生菜葉", quantity: "100g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "紅蘿蔔和黃瓜切絲",
      "用生菜葉包裹糙米、吞拿魚和蔬菜",
      "調味享用",
      "完美午餐便當"
    ],
    fatLossTips: [
      "生菜低卡高纖，增加飽腹感",
      "吞拿魚高蛋白低脂",
      "蔬菜豐富，營養全面"
    ]
  },
  {
    id: "l-s-10",
    name: "海鮮蔬菜碗",
    protein_type: "seafood",
    category: "lunch",
    kcal: 400,
    protein: 41,
    fat: 10,
    carbs: 32,
    totalWeight: 500,
    ingredients: [
      { name: "蝦仁", quantity: "150g" },
      { name: "糙米", quantity: "70g" },
      { name: "西蘭花", quantity: "80g" },
      { name: "紅蘿蔔", quantity: "60g" },
      { name: "玉米粒", quantity: "50g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "蝦仁炒至變紅",
      "加入西蘭花、紅蘿蔔、玉米粒炒勻",
      "混合糙米",
      "調味後盛碟"
    ],
    fatLossTips: [
      "蝦仁低脂高蛋白",
      "彩色蔬菜營養全面",
      "玉米粒含纖維，促進消化"
    ]
  }
];

const lunchEgg: RecipeData[] = [
  {
    id: "l-e-1",
    name: "番茄滑蛋糙米飯",
    protein_type: "egg",
    category: "lunch",
    kcal: 380,
    protein: 38,
    fat: 11,
    carbs: 34,
    totalWeight: 480,
    ingredients: [
      { name: "蛋", quantity: "3個" },
      { name: "糙米", quantity: "80g" },
      { name: "番茄", quantity: "100g" },
      { name: "洋蔥", quantity: "50g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "番茄切塊，洋蔥切絲",
      "大蒜爆香後加入番茄和洋蔥",
      "倒入打好的蛋液，輕輕攪拌至滑蛋",
      "混合糙米調味盛碟"
    ],
    fatLossTips: [
      "蛋含完全蛋白質，營養全面",
      "番茄含茄紅素，抗氧化",
      "糙米低GI，穩定血糖"
    ]
  },
  {
    id: "l-e-2",
    name: "菠菜蛋白飯碗",
    protein_type: "egg",
    category: "lunch",
    kcal: 390,
    protein: 39,
    fat: 10,
    carbs: 36,
    totalWeight: 490,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "糙米", quantity: "80g" },
      { name: "菠菜", quantity: "100g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "蛋白炒至半熟",
      "加入菠菜、紅蘿蔔、洋蔥炒勻",
      "混合糙米",
      "調味後盛碟"
    ],
    fatLossTips: [
      "蛋白低脂高蛋白",
      "菠菜含鐵質，提升新陳代謝",
      "蔬菜富含纖維，促進消化"
    ]
  },
  {
    id: "l-e-3",
    name: "蘑菇炒蛋藜麥飯",
    protein_type: "egg",
    category: "lunch",
    kcal: 400,
    protein: 38,
    fat: 11,
    carbs: 38,
    totalWeight: 500,
    ingredients: [
      { name: "蛋", quantity: "3個" },
      { name: "藜麥", quantity: "80g" },
      { name: "蘑菇", quantity: "100g" },
      { name: "洋蔥", quantity: "50g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "藜麥煮熟",
      "蘑菇切片，洋蔥切絲",
      "大蒜爆香後加入蘑菇和洋蔥炒勻",
      "倒入打好的蛋液，輕輕攪拌",
      "混合藜麥調味盛碟"
    ],
    fatLossTips: [
      "蘑菇低卡高纖，增加飽腹感",
      "蛋含完全蛋白質",
      "藜麥含完全蛋白質，營養全面"
    ]
  },
  {
    id: "l-e-4",
    name: "蛋白彩椒炒飯",
    protein_type: "egg",
    category: "lunch",
    kcal: 380,
    protein: 37,
    fat: 10,
    carbs: 36,
    totalWeight: 490,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "糙米", quantity: "80g" },
      { name: "紅椒", quantity: "50g" },
      { name: "黃椒", quantity: "50g" },
      { name: "青椒", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" }
    ],
    steps: [
      "蛋白炒至熟透",
      "加入彩椒和洋蔥炒勻",
      "加入糙米混合",
      "調味後盛碟",
      "享用彩色營養飯"
    ],
    fatLossTips: [
      "彩椒含多種維生素和礦物質",
      "蛋白低脂高蛋白",
      "彩色食材，營養更全面"
    ]
  },
  {
    id: "l-e-5",
    name: "雙蛋白黑豆飯",
    protein_type: "egg",
    category: "lunch",
    kcal: 410,
    protein: 39,
    fat: 11,
    carbs: 38,
    totalWeight: 510,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "糙米", quantity: "80g" },
      { name: "黑豆", quantity: "60g" },
      { name: "紅椒", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米和黑豆一起煮熟",
      "蛋白炒至熟透",
      "加入紅椒和洋蔥炒勻",
      "混合米豆混合物",
      "調味後盛碟"
    ],
    fatLossTips: [
      "黑豆含花青素，強效抗氧化",
      "黑豆高纖低GI，穩定血糖",
      "蛋白搭配豆類，蛋白質互補"
    ]
  },
  {
    id: "l-e-6",
    name: "粟米蛋飯碗",
    protein_type: "egg",
    category: "lunch",
    kcal: 400,
    protein: 38,
    fat: 11,
    carbs: 36,
    totalWeight: 500,
    ingredients: [
      { name: "蛋", quantity: "3個" },
      { name: "糙米", quantity: "80g" },
      { name: "粟米", quantity: "80g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "蛋炒至熟透",
      "加入粟米、紅蘿蔔、洋蔥炒勻",
      "混合糙米",
      "調味後盛碟"
    ],
    fatLossTips: [
      "粟米含纖維，促進消化",
      "蛋含完全蛋白質",
      "糙米低GI，穩定血糖"
    ]
  },
  {
    id: "l-e-7",
    name: "滑蛋蔬菜意粉",
    protein_type: "egg",
    category: "lunch",
    kcal: 390,
    protein: 37,
    fat: 10,
    carbs: 40,
    totalWeight: 500,
    ingredients: [
      { name: "蛋", quantity: "3個" },
      { name: "全麥意粉", quantity: "80g" },
      { name: "番茄", quantity: "80g" },
      { name: "洋蔥", quantity: "50g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "全麥意粉煮至半熟",
      "番茄切塊，洋蔥切絲",
      "大蒜爆香後加入番茄和洋蔥",
      "倒入打好的蛋液，輕輕攪拌至滑蛋",
      "混合意粉調味享用"
    ],
    fatLossTips: [
      "全麥意粉富含纖維，增加飽腹感",
      "番茄含茄紅素，抗氧化",
      "蛋含完全蛋白質"
    ]
  },
  {
    id: "l-e-8",
    name: "菠菜蛋白糙米飯",
    protein_type: "egg",
    category: "lunch",
    kcal: 380,
    protein: 38,
    fat: 9,
    carbs: 34,
    totalWeight: 490,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "糙米", quantity: "80g" },
      { name: "菠菜", quantity: "100g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "蛋白炒至半熟",
      "加入大蒜爆香",
      "加入菠菜和紅蘿蔔炒勻",
      "混合糙米，調味盛碟"
    ],
    fatLossTips: [
      "菠菜含鐵質，提升新陳代謝",
      "蛋白低脂高蛋白",
      "蔬菜富含纖維，促進消化"
    ]
  },
  {
    id: "l-e-9",
    name: "番茄蛋白飯卷",
    protein_type: "egg",
    category: "lunch",
    kcal: 370,
    protein: 37,
    fat: 8,
    carbs: 28,
    totalWeight: 450,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "糙米", quantity: "70g" },
      { name: "番茄", quantity: "80g" },
      { name: "生菜葉", quantity: "80g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "蛋白炒至熟透",
      "番茄和黃瓜切片",
      "用生菜葉包裹糙米、蛋白和蔬菜",
      "調味享用"
    ],
    fatLossTips: [
      "生菜低卡高纖，增加飽腹感",
      "番茄含茄紅素，抗氧化",
      "蛋白低脂高蛋白"
    ]
  },
  {
    id: "l-e-10",
    name: "蛋白生菜飯碗",
    protein_type: "egg",
    category: "lunch",
    kcal: 380,
    protein: 39,
    fat: 9,
    carbs: 32,
    totalWeight: 490,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "糙米", quantity: "70g" },
      { name: "生菜", quantity: "100g" },
      { name: "番茄", quantity: "60g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "紅蘿蔔", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" }
    ],
    steps: [
      "糙米煮熟",
      "蛋白炒至熟透",
      "混合生菜、番茄、黃瓜、紅蘿蔔",
      "加入蛋白和糙米",
      "調味享用"
    ],
    fatLossTips: [
      "生菜低卡高纖，增加飽腹感",
      "蛋白低脂高蛋白",
      "蔬菜豐富，營養全面"
    ]
  }
];

const lunchVegetarian: RecipeData[] = [
  {
    id: "l-v-1",
    name: "豆腐藜麥飯碗",
    protein_type: "vegetarian",
    category: "lunch",
    kcal: 400,
    protein: 36,
    fat: 11,
    carbs: 38,
    totalWeight: 500,
    ingredients: [
      { name: "豆腐", quantity: "150g" },
      { name: "藜麥", quantity: "80g" },
      { name: "紅椒", quantity: "60g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1.5g" }
    ],
    steps: [
      "藜麥煮熟",
      "豆腐切塊炒至金黃",
      "混合紅椒、黃瓜、洋蔥",
      "加入豆腐和藜麥",
      "淋上橄欖油和檸檬汁，調味享用"
    ],
    fatLossTips: [
      "豆腐低脂高蛋白",
      "藜麥含完全蛋白質，營養全面",
      "檸檬汁促進消化和脂肪燃燒"
    ]
  },
  {
    id: "l-v-2",
    name: "鷹嘴豆糙米飯",
    protein_type: "vegetarian",
    category: "lunch",
    kcal: 410,
    protein: 35,
    fat: 10,
    carbs: 40,
    totalWeight: 510,
    ingredients: [
      { name: "鷹嘴豆罐頭", quantity: "150g" },
      { name: "糙米", quantity: "80g" },
      { name: "紅椒", quantity: "60g" },
      { name: "洋蔥", quantity: "50g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "大蒜爆香後加入鷹嘴豆",
      "加入紅椒和洋蔥炒勻",
      "混合糙米",
      "調味後盛碟"
    ],
    fatLossTips: [
      "鷹嘴豆高蛋白高纖",
      "糙米低GI，穩定血糖",
      "豆類搭配穀物，蛋白質互補"
    ]
  },
  {
    id: "l-v-3",
    name: "雜菜黑豆飯",
    protein_type: "vegetarian",
    category: "lunch",
    kcal: 400,
    protein: 34,
    fat: 9,
    carbs: 40,
    totalWeight: 510,
    ingredients: [
      { name: "黑豆罐頭", quantity: "150g" },
      { name: "糙米", quantity: "80g" },
      { name: "紅椒", quantity: "50g" },
      { name: "玉米粒", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米和黑豆一起煮熟",
      "加入紅椒、玉米粒、洋蔥炒勻",
      "混合米豆混合物",
      "調味後盛碟",
      "享用彩色營養飯"
    ],
    fatLossTips: [
      "黑豆含花青素，強效抗氧化",
      "黑豆高纖低GI，穩定血糖",
      "彩色蔬菜營養全面"
    ]
  },
  {
    id: "l-v-4",
    name: "豆腐番茄意粉",
    protein_type: "vegetarian",
    category: "lunch",
    kcal: 410,
    protein: 33,
    fat: 10,
    carbs: 42,
    totalWeight: 520,
    ingredients: [
      { name: "豆腐", quantity: "140g" },
      { name: "全麥意粉", quantity: "80g" },
      { name: "番茄罐頭", quantity: "200g" },
      { name: "洋蔥", quantity: "50g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "全麥意粉煮至半熟",
      "豆腐切塊炒至金黃",
      "加入洋蔥和大蒜爆香",
      "加入番茄罐頭燉煮",
      "混合意粉，調味享用"
    ],
    fatLossTips: [
      "全麥意粉富含纖維，增加飽腹感",
      "番茄含茄紅素，抗氧化",
      "豆腐低脂高蛋白"
    ]
  },
  {
    id: "l-v-5",
    name: "牛油果藜麥飯",
    protein_type: "vegetarian",
    category: "lunch",
    kcal: 420,
    protein: 35,
    fat: 13,
    carbs: 36,
    totalWeight: 520,
    ingredients: [
      { name: "牛油果", quantity: "1個（120g）" },
      { name: "藜麥", quantity: "80g" },
      { name: "紅椒", quantity: "60g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "番茄", quantity: "50g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1.5g" }
    ],
    steps: [
      "藜麥煮熟",
      "牛油果切半，用叉子壓成泥狀",
      "混合紅椒、黃瓜、番茄",
      "加入藜麥和牛油果泥",
      "淋上橄欖油和檸檬汁，調味享用"
    ],
    fatLossTips: [
      "牛油果含健康脂肪，促進脂肪燃燒",
      "藜麥含完全蛋白質，營養全面",
      "檸檬汁促進消化"
    ]
  },
  {
    id: "l-v-6",
    name: "豆腐西蘭花糙米飯",
    protein_type: "vegetarian",
    category: "lunch",
    kcal: 400,
    protein: 34,
    fat: 10,
    carbs: 36,
    totalWeight: 510,
    ingredients: [
      { name: "豆腐", quantity: "150g" },
      { name: "糙米", quantity: "80g" },
      { name: "西蘭花", quantity: "100g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "豆腐切塊炒至金黃",
      "加入大蒜爆香",
      "加入西蘭花和紅蘿蔔炒勻",
      "混合糙米，調味盛碟"
    ],
    fatLossTips: [
      "西蘭花含硫化物，促進脂肪燃燒",
      "豆腐低脂高蛋白",
      "蔬菜富含纖維，促進消化"
    ]
  },
  {
    id: "l-v-7",
    name: "雜菜彩椒炒飯",
    protein_type: "vegetarian",
    category: "lunch",
    kcal: 390,
    protein: 33,
    fat: 10,
    carbs: 38,
    totalWeight: 510,
    ingredients: [
      { name: "豌豆", quantity: "60g" },
      { name: "玉米粒", quantity: "60g" },
      { name: "糙米", quantity: "80g" },
      { name: "紅椒", quantity: "50g" },
      { name: "黃椒", quantity: "50g" },
      { name: "青椒", quantity: "50g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" }
    ],
    steps: [
      "加入豌豆和玉米粒炒勻",
      "加入彩椒和洋蔥炒勻",
      "加入糙米混合",
      "調味後盛碟",
      "享用彩色營養飯"
    ],
    fatLossTips: [
      "彩椒含多種維生素和礦物質",
      "豌豆和玉米粒高蛋白高纖",
      "彩色食材，營養更全面"
    ]
  },
  {
    id: "l-v-8",
    name: "鷹嘴豆蔬菜碗",
    protein_type: "vegetarian",
    category: "lunch",
    kcal: 410,
    protein: 34,
    fat: 11,
    carbs: 38,
    totalWeight: 520,
    ingredients: [
      { name: "鷹嘴豆罐頭", quantity: "150g" },
      { name: "糙米", quantity: "70g" },
      { name: "西蘭花", quantity: "80g" },
      { name: "紅蘿蔔", quantity: "60g" },
      { name: "玉米粒", quantity: "50g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "加入西蘭花、紅蘿蔔、玉米粒炒勻",
      "混合鷹嘴豆和糙米",
      "調味後盛碟",
      "享用營養豐富的蔬菜碗"
    ],
    fatLossTips: [
      "鷹嘴豆高蛋白高纖",
      "彩色蔬菜營養全面",
      "豆類搭配穀物，蛋白質互補"
    ]
  },
  {
    id: "l-v-9",
    name: "豆腐生菜飯卷",
    protein_type: "vegetarian",
    category: "lunch",
    kcal: 380,
    protein: 32,
    fat: 9,
    carbs: 30,
    totalWeight: 480,
    ingredients: [
      { name: "豆腐", quantity: "140g" },
      { name: "糙米", quantity: "70g" },
      { name: "生菜葉", quantity: "100g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "橄欖油", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "糙米煮熟",
      "豆腐切塊炒至金黃",
      "紅蘿蔔和黃瓜切絲",
      "用生菜葉包裹糙米、豆腐和蔬菜",
      "調味享用"
    ],
    fatLossTips: [
      "生菜低卡高纖，增加飽腹感",
      "豆腐低脂高蛋白",
      "蔬菜豐富，營養全面"
    ]
  },
  {
    id: "l-v-10",
    name: "南瓜藜麥飯碗",
    protein_type: "vegetarian",
    category: "lunch",
    kcal: 400,
    protein: 33,
    fat: 10,
    carbs: 40,
    totalWeight: 510,
    ingredients: [
      { name: "南瓜", quantity: "150g" },
      { name: "藜麥", quantity: "80g" },
      { name: "紅椒", quantity: "60g" },
      { name: "洋蔥", quantity: "50g" },
      { name: "大蒜", quantity: "2瓣" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1.5g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "藜麥煮熟",
      "南瓜切塊，大蒜爆香",
      "加入南瓜、紅椒、洋蔥炒勻",
      "混合藜麥",
      "調味後盛碟"
    ],
    fatLossTips: [
      "南瓜低卡高纖，增加飽腹感",
      "藜麥含完全蛋白質，營養全面",
      "南瓜含β-胡蘿蔔素，抗氧化"
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

// Salad Recipes - Pork (溫沙律 / 日式風格)
const saladPork: RecipeData[] = [
  {
    id: "s-p-1",
    name: "低脂叉燒生菜沙律",
    protein_type: "pork",
    category: "salad",
    kcal: 340,
    protein: 42,
    fat: 10,
    carbs: 18,
    totalWeight: 420,
    ingredients: [
      { name: "低脂叉燒", quantity: "160g" },
      { name: "生菜", quantity: "120g" },
      { name: "黃瓜", quantity: "80g" },
      { name: "紅蘿蔔", quantity: "40g" },
      { name: "芝麻", quantity: "1湯匙（10g）" },
      { name: "日式醬油", quantity: "1湯匙（15ml）" },
      { name: "米醋", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "低脂叉燒切成薄片",
      "生菜撕碎，黃瓜和紅蘿蔔切絲",
      "混合所有蔬菜和叉燒",
      "淋上日式醬油和米醋",
      "撒上芝麻享用"
    ],
    fatLossTips: [
      "低脂叉燒蛋白質豐富，飽腹感強",
      "芝麻含鈣質，促進骨骼健康",
      "日式調味低鹽，健康減脂"
    ]
  },
  {
    id: "s-p-2",
    name: "豬里肌芝麻菠菜沙律",
    protein_type: "pork",
    category: "salad",
    kcal: 360,
    protein: 44,
    fat: 11,
    carbs: 20,
    totalWeight: 440,
    ingredients: [
      { name: "豬里肌", quantity: "170g" },
      { name: "菠菜", quantity: "100g" },
      { name: "黑芝麻", quantity: "1.5湯匙（15g）" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "日式醬油", quantity: "1湯匙（15ml）" },
      { name: "米醋", quantity: "1茶匙（5ml）" },
      { name: "芝麻油", quantity: "0.5茶匙（2.5ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "豬里肌煮熟切成薄片",
      "菠菜焯水後冷卻",
      "混合菠菜、豬肉、洋蔥",
      "淋上日式醬油、米醋和芝麻油",
      "撒上黑芝麻享用"
    ],
    fatLossTips: [
      "菠菜含鐵質，提升新陳代謝",
      "黑芝麻含鈣質和Omega-3",
      "豬里肌低脂高蛋白，完美減脂食材"
    ]
  },
  {
    id: "s-p-3",
    name: "燒豬肉溫沙律碗",
    protein_type: "pork",
    category: "salad",
    kcal: 380,
    protein: 43,
    fat: 13,
    carbs: 22,
    totalWeight: 460,
    ingredients: [
      { name: "燒豬肉", quantity: "160g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "甜菜根", quantity: "60g" },
      { name: "核桃", quantity: "20g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "紅酒醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "燒豬肉切成塊狀",
      "甜菜根煮熟切塊",
      "核桃切碎",
      "混合生菜、豬肉、甜菜根、洋蔥",
      "淋上橄欖油和紅酒醋，撒上核桃"
    ],
    fatLossTips: [
      "甜菜根含硝酸鹽，促進血液循環",
      "核桃含Omega-3，促進脂肪燃燒",
      "溫沙律增加飽腹感，更易控制食量"
    ]
  },
  {
    id: "s-p-4",
    name: "豬肉青瓜日式沙律",
    protein_type: "pork",
    category: "salad",
    kcal: 320,
    protein: 40,
    fat: 9,
    carbs: 16,
    totalWeight: 400,
    ingredients: [
      { name: "豬肉", quantity: "150g" },
      { name: "青瓜", quantity: "150g" },
      { name: "海帶", quantity: "20g" },
      { name: "紅蘿蔔", quantity: "30g" },
      { name: "日式醬油", quantity: "1湯匙（15ml）" },
      { name: "米醋", quantity: "1茶匙（5ml）" },
      { name: "白芝麻", quantity: "1茶匙（5g）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "豬肉煮熟切成薄片",
      "青瓜切成薄片",
      "海帶泡軟切絲",
      "混合所有材料",
      "淋上日式醬油和米醋，撒上白芝麻"
    ],
    fatLossTips: [
      "青瓜低卡高水分，增加飽腹感",
      "海帶含碘質，促進甲狀腺代謝",
      "日式調味清淡，適合減脂"
    ]
  },
  {
    id: "s-p-5",
    name: "豬肉藜麥溫沙律",
    protein_type: "pork",
    category: "salad",
    kcal: 390,
    protein: 42,
    fat: 12,
    carbs: 28,
    totalWeight: 480,
    ingredients: [
      { name: "豬肉", quantity: "140g" },
      { name: "藜麥", quantity: "80g" },
      { name: "菠菜", quantity: "80g" },
      { name: "紅椒", quantity: "50g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "藜麥煮熟",
      "豬肉煮熟切成塊狀",
      "菠菜焯水",
      "混合藜麥、豬肉、菠菜、紅椒、洋蔥",
      "淋上橄欖油和檸檬汁享用"
    ],
    fatLossTips: [
      "藜麥含完全蛋白質，營養豐富",
      "菠菜含鐵質，提升新陳代謝",
      "溫沙律易消化，適合晚餐"
    ]
  },
  {
    id: "s-p-6",
    name: "豬肉番茄芝麻沙律",
    protein_type: "pork",
    category: "salad",
    kcal: 350,
    protein: 41,
    fat: 10,
    carbs: 20,
    totalWeight: 430,
    ingredients: [
      { name: "豬肉", quantity: "150g" },
      { name: "番茄", quantity: "120g" },
      { name: "生菜", quantity: "100g" },
      { name: "黑芝麻", quantity: "1湯匙（10g）" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "米醋", quantity: "1茶匙（5ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "豬肉煮熟切成塊狀",
      "番茄切塊，生菜撕碎",
      "混合所有蔬菜和豬肉",
      "淋上橄欖油和米醋",
      "撒上黑芝麻享用"
    ],
    fatLossTips: [
      "番茄含茄紅素，強效抗氧化",
      "黑芝麻含鈣質，促進骨骼健康",
      "低油沙律，健康減脂選擇"
    ]
  },
  {
    id: "s-p-7",
    name: "豬肉西蘭花蒜香沙律",
    protein_type: "pork",
    category: "salad",
    kcal: 370,
    protein: 43,
    fat: 11,
    carbs: 19,
    totalWeight: 450,
    ingredients: [
      { name: "豬肉", quantity: "160g" },
      { name: "西蘭花", quantity: "120g" },
      { name: "生菜", quantity: "80g" },
      { name: "大蒜", quantity: "3瓣（10g）" },
      { name: "紅椒", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "豬肉煮熟切成塊狀",
      "西蘭花焯水後冷卻",
      "大蒜切碎",
      "混合西蘭花、豬肉、生菜、紅椒",
      "淋上蒜香橄欖油和檸檬汁"
    ],
    fatLossTips: [
      "西蘭花含蘿蔔硫素，促進脂肪燃燒",
      "大蒜含硫化物，增強免疫力",
      "蒜香低油沙律，健康減脂"
    ]
  },
  {
    id: "s-p-8",
    name: "豬肉蘋果清爽沙律",
    protein_type: "pork",
    category: "salad",
    kcal: 360,
    protein: 40,
    fat: 10,
    carbs: 26,
    totalWeight: 450,
    ingredients: [
      { name: "豬肉", quantity: "140g" },
      { name: "蘋果", quantity: "100g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "核桃", quantity: "20g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "蘋果醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "豬肉煮熟切成塊狀",
      "蘋果切塊，核桃切碎",
      "混合生菜、豬肉、蘋果、洋蔥",
      "淋上橄欖油和蘋果醋",
      "撒上核桃享用"
    ],
    fatLossTips: [
      "蘋果含果膠，促進消化",
      "核桃含Omega-3，促進脂肪燃燒",
      "蘋果醋幫助消化，加快代謝"
    ]
  },
  {
    id: "s-p-9",
    name: "豬肉蛋白凱撒沙律",
    protein_type: "pork",
    category: "salad",
    kcal: 380,
    protein: 44,
    fat: 12,
    carbs: 18,
    totalWeight: 440,
    ingredients: [
      { name: "豬肉", quantity: "160g" },
      { name: "羅馬生菜", quantity: "120g" },
      { name: "帕瑪森芝士", quantity: "20g" },
      { name: "全麥麵包丁", quantity: "30g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "豬肉煮熟切成塊狀",
      "羅馬生菜撕碎",
      "混合生菜、豬肉、麵包丁",
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
    id: "s-p-10",
    name: "豬肉生菜卷沙律碗",
    protein_type: "pork",
    category: "salad",
    kcal: 340,
    protein: 42,
    fat: 9,
    carbs: 20,
    totalWeight: 420,
    ingredients: [
      { name: "豬肉", quantity: "150g" },
      { name: "生菜", quantity: "150g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "紅椒", quantity: "30g" },
      { name: "日式醬油", quantity: "1湯匙（15ml）" },
      { name: "米醋", quantity: "1茶匙（5ml）" },
      { name: "白芝麻", quantity: "1茶匙（5g）" }
    ],
    steps: [
      "豬肉煮熟切成薄片",
      "蔬菜切成條狀",
      "用生菜葉包裹豬肉和蔬菜",
      "淋上日式醬油和米醋",
      "撒上白芝麻享用"
    ],
    fatLossTips: [
      "生菜卷低卡高纖，增加飽腹感",
      "多彩蔬菜提供豐富營養",
      "日式調味清淡，適合減脂"
    ]
  }
];

// Salad Recipes - Beef (牛排沙律 / 西方風格)
const saladBeef: RecipeData[] = [
  {
    id: "s-b-1",
    name: "黑椒牛肉凱撒沙律",
    protein_type: "beef",
    category: "salad",
    kcal: 400,
    protein: 45,
    fat: 14,
    carbs: 20,
    totalWeight: 460,
    ingredients: [
      { name: "黑椒牛肉", quantity: "180g" },
      { name: "羅馬生菜", quantity: "120g" },
      { name: "帕瑪森芝士", quantity: "25g" },
      { name: "全麥麵包丁", quantity: "30g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "1g" }
    ],
    steps: [
      "牛肉煎至半熟，撒上黑椒",
      "靜置5分鐘後切成薄片",
      "羅馬生菜撕碎",
      "混合生菜、牛肉、麵包丁",
      "淋上橄欖油和檸檬汁，撒上帕瑪森芝士"
    ],
    fatLossTips: [
      "黑椒牛肉高蛋白，肌肉合成效率高",
      "羅馬生菜低卡高纖，增加飽腹感",
      "帕瑪森芝士提供鈣質，不過量"
    ]
  },
  {
    id: "s-b-2",
    name: "牛排牛油果沙律",
    protein_type: "beef",
    category: "salad",
    kcal: 420,
    protein: 46,
    fat: 16,
    carbs: 18,
    totalWeight: 480,
    ingredients: [
      { name: "牛排", quantity: "170g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "牛油果", quantity: "1/2個（60g）" },
      { name: "番茄", quantity: "80g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "2茶匙（10ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "牛排煎至喜歡的熟度",
      "靜置5分鐘後切成薄片",
      "牛油果切半，用叉子壓成泥狀",
      "混合生菜、番茄、洋蔥",
      "放上牛肉和牛油果泥，淋上橄欖油和檸檬汁"
    ],
    fatLossTips: [
      "牛排高蛋白高鐵，適合減脂增肌",
      "牛油果含健康脂肪，促進脂肪燃燒",
      "檸檬汁幫助消化，加快代謝"
    ]
  },
  {
    id: "s-b-3",
    name: "牛肉藜麥能量沙律",
    protein_type: "beef",
    category: "salad",
    kcal: 410,
    protein: 44,
    fat: 13,
    carbs: 28,
    totalWeight: 500,
    ingredients: [
      { name: "牛肉", quantity: "160g" },
      { name: "藜麥", quantity: "80g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "紅椒", quantity: "50g" },
      { name: "黑豆", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "藜麥煮熟",
      "牛肉煮熟切成塊狀",
      "黑豆瀝乾",
      "混合藜麥、牛肉、生菜、紅椒、黑豆",
      "淋上橄欖油和檸檬汁享用"
    ],
    fatLossTips: [
      "藜麥含完全蛋白質，營養豐富",
      "黑豆含纖維，促進消化",
      "能量沙律適合運動後補充"
    ]
  },
  {
    id: "s-b-4",
    name: "牛肉菠菜蛋白沙律",
    protein_type: "beef",
    category: "salad",
    kcal: 390,
    protein: 46,
    fat: 12,
    carbs: 16,
    totalWeight: 450,
    ingredients: [
      { name: "牛肉", quantity: "170g" },
      { name: "菠菜", quantity: "120g" },
      { name: "蛋白", quantity: "2個" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "核桃", quantity: "20g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "紅酒醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "牛肉煮熟切成塊狀",
      "菠菜焯水後冷卻",
      "蛋白煮熟切半",
      "核桃切碎",
      "混合菠菜、牛肉、蛋白、洋蔥，淋上橄欖油和紅酒醋，撒上核桃"
    ],
    fatLossTips: [
      "菠菜含鐵質，提升新陳代謝",
      "蛋白高蛋白低脂，完美減脂食材",
      "核桃含Omega-3，促進脂肪燃燒"
    ]
  },
  {
    id: "s-b-5",
    name: "牛肉番茄羅勒沙律",
    protein_type: "beef",
    category: "salad",
    kcal: 380,
    protein: 43,
    fat: 11,
    carbs: 20,
    totalWeight: 460,
    ingredients: [
      { name: "牛肉", quantity: "160g" },
      { name: "番茄", quantity: "150g" },
      { name: "新鮮羅勒", quantity: "20g" },
      { name: "莫薩里拉芝士", quantity: "30g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "巴薩米克醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "牛肉煮熟切成薄片",
      "番茄切塊",
      "莫薩里拉芝士撕碎",
      "混合牛肉、番茄、洋蔥、羅勒",
      "淋上橄欖油和巴薩米克醋，撒上莫薩里拉芝士"
    ],
    fatLossTips: [
      "番茄含茄紅素，強效抗氧化",
      "羅勒含抗氧化物，促進脂肪燃燒",
      "莫薩里拉芝士提供鈣質，不過量"
    ]
  },
  {
    id: "s-b-6",
    name: "牛肉西蘭花橄欖油沙律",
    protein_type: "beef",
    category: "salad",
    kcal: 400,
    protein: 45,
    fat: 13,
    carbs: 18,
    totalWeight: 470,
    ingredients: [
      { name: "牛肉", quantity: "170g" },
      { name: "西蘭花", quantity: "120g" },
      { name: "生菜", quantity: "80g" },
      { name: "紅椒", quantity: "40g" },
      { name: "大蒜", quantity: "3瓣（10g）" },
      { name: "橄欖油", quantity: "2茶匙（10ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "牛肉煮熟切成塊狀",
      "西蘭花焯水後冷卻",
      "大蒜切碎",
      "混合西蘭花、牛肉、生菜、紅椒",
      "淋上蒜香橄欖油和檸檬汁"
    ],
    fatLossTips: [
      "西蘭花含蘿蔔硫素，促進脂肪燃燒",
      "大蒜含硫化物，增強免疫力",
      "橄欖油含單不飽和脂肪，健康選擇"
    ]
  },
  {
    id: "s-b-7",
    name: "牛肉青瓜優格沙律",
    protein_type: "beef",
    category: "salad",
    kcal: 370,
    protein: 44,
    fat: 10,
    carbs: 20,
    totalWeight: 450,
    ingredients: [
      { name: "牛肉", quantity: "160g" },
      { name: "青瓜", quantity: "150g" },
      { name: "希臘優格", quantity: "60g" },
      { name: "生菜", quantity: "80g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "牛肉煮熟切成塊狀",
      "青瓜切成薄片",
      "希臘優格混合檸檬汁",
      "混合生菜、牛肉、青瓜、洋蔥",
      "淋上優格醬，調味享用"
    ],
    fatLossTips: [
      "青瓜低卡高水分，增加飽腹感",
      "希臘優格高蛋白低脂，完美減脂食材",
      "優格含益生菌，促進消化"
    ]
  },
  {
    id: "s-b-8",
    name: "牛肉彩椒暖沙律",
    protein_type: "beef",
    category: "salad",
    kcal: 390,
    protein: 44,
    fat: 12,
    carbs: 22,
    totalWeight: 470,
    ingredients: [
      { name: "牛肉", quantity: "160g" },
      { name: "紅椒", quantity: "60g" },
      { name: "黃椒", quantity: "60g" },
      { name: "綠椒", quantity: "60g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "紅酒醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "牛肉煮熟切成塊狀",
      "彩椒和洋蔥切成條狀",
      "用橄欖油炒彩椒和洋蔥至軟",
      "混合牛肉和炒好的蔬菜",
      "淋上紅酒醋享用"
    ],
    fatLossTips: [
      "彩椒含維生素C，促進脂肪氧化",
      "多彩蔬菜提供豐富營養",
      "暖沙律易消化，適合晚餐"
    ]
  },
  {
    id: "s-b-9",
    name: "牛肉蘑菇沙律碗",
    protein_type: "beef",
    category: "salad",
    kcal: 380,
    protein: 43,
    fat: 11,
    carbs: 20,
    totalWeight: 460,
    ingredients: [
      { name: "牛肉", quantity: "160g" },
      { name: "蘑菇", quantity: "120g" },
      { name: "生菜", quantity: "100g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "大蒜", quantity: "2瓣（7g）" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "紅酒醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "牛肉煮熟切成塊狀",
      "蘑菇切片",
      "用橄欖油炒蘑菇和大蒜",
      "混合生菜、牛肉、炒好的蘑菇、洋蔥",
      "淋上紅酒醋享用"
    ],
    fatLossTips: [
      "蘑菇含多糖體，增強免疫力",
      "蘑菇低卡高纖，增加飽腹感",
      "暖沙律易消化，適合晚餐"
    ]
  },
  {
    id: "s-b-10",
    name: "牛肉芝士輕食沙律",
    protein_type: "beef",
    category: "salad",
    kcal: 400,
    protein: 45,
    fat: 13,
    carbs: 18,
    totalWeight: 460,
    ingredients: [
      { name: "牛肉", quantity: "170g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "切達芝士", quantity: "30g" },
      { name: "番茄", quantity: "80g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "牛肉煮熟切成薄片",
      "切達芝士切成小塊",
      "混合生菜、牛肉、番茄、洋蔥",
      "撒上切達芝士",
      "淋上橄欖油和檸檬汁享用"
    ],
    fatLossTips: [
      "牛肉高蛋白高鐵，適合減脂增肌",
      "切達芝士提供鈣質，不過量",
      "輕食沙律易消化，適合午餐"
    ]
  }
];

// Salad Recipes - Seafood (清爽冷沙律 / 清新風格)
const saladSeafood: RecipeData[] = [
  {
    id: "s-sf-1",
    name: "三文魚牛油果沙律",
    protein_type: "seafood",
    category: "salad",
    kcal: 380,
    protein: 40,
    fat: 14,
    carbs: 18,
    totalWeight: 450,
    ingredients: [
      { name: "三文魚", quantity: "150g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "牛油果", quantity: "1/2個（60g）" },
      { name: "番茄", quantity: "80g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "三文魚煮熟切成塊狀",
      "牛油果切半，用叉子壓成泥狀",
      "混合生菜、番茄、洋蔥",
      "放上三文魚和牛油果泥",
      "淋上橄欖油和檸檬汁享用"
    ],
    fatLossTips: [
      "三文魚含Omega-3，促進脂肪燃燒",
      "牛油果含健康脂肪，促進代謝",
      "清爽沙律低卡高營養，完美減脂"
    ]
  },
  {
    id: "s-sf-2",
    name: "蒜香蝦仁沙律碗",
    protein_type: "seafood",
    category: "salad",
    kcal: 320,
    protein: 38,
    fat: 9,
    carbs: 16,
    totalWeight: 420,
    ingredients: [
      { name: "蝦仁", quantity: "160g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "大蒜", quantity: "4瓣（12g）" },
      { name: "紅椒", quantity: "50g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "白葡萄酒醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "大蒜切碎",
      "用橄欖油炒大蒜和蝦仁",
      "蝦仁炒至變紅後冷卻",
      "混合生菜、炒好的蝦仁、紅椒",
      "淋上白葡萄酒醋和檸檬汁"
    ],
    fatLossTips: [
      "蝦仁高蛋白低脂，完美減脂食材",
      "大蒜含硫化物，增強免疫力",
      "清爽沙律易消化，適合午餐"
    ]
  },
  {
    id: "s-sf-3",
    name: "吞拿魚蛋白沙律",
    protein_type: "seafood",
    category: "salad",
    kcal: 340,
    protein: 42,
    fat: 10,
    carbs: 14,
    totalWeight: 420,
    ingredients: [
      { name: "吞拿魚", quantity: "150g" },
      { name: "蛋白", quantity: "2個" },
      { name: "生菜", quantity: "100g" },
      { name: "番茄", quantity: "80g" },
      { name: "黃瓜", quantity: "60g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "吞拿魚瀝乾",
      "蛋白煮熟切半",
      "混合生菜、吞拿魚、蛋白、番茄、黃瓜",
      "淋上橄欖油和檸檬汁",
      "調味享用"
    ],
    fatLossTips: [
      "吞拿魚高蛋白低脂，完美減脂食材",
      "蛋白高蛋白低脂，增加飽腹感",
      "清爽沙律低卡高營養"
    ]
  },
  {
    id: "s-sf-4",
    name: "三文魚菠菜清爽沙律",
    protein_type: "seafood",
    category: "salad",
    kcal: 360,
    protein: 39,
    fat: 12,
    carbs: 18,
    totalWeight: 450,
    ingredients: [
      { name: "三文魚", quantity: "140g" },
      { name: "菠菜", quantity: "120g" },
      { name: "混合生菜", quantity: "80g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "白葡萄酒醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "三文魚煮熟切成塊狀",
      "菠菜焯水後冷卻",
      "混合菠菜、生菜、三文魚、洋蔥",
      "淋上橄欖油、白葡萄酒醋和檸檬汁",
      "調味享用"
    ],
    fatLossTips: [
      "三文魚含Omega-3，促進脂肪燃燒",
      "菠菜含鐵質，提升新陳代謝",
      "清爽沙律低卡高營養"
    ]
  },
  {
    id: "s-sf-5",
    name: "蝦仁藜麥冷沙律",
    protein_type: "seafood",
    category: "salad",
    kcal: 370,
    protein: 40,
    fat: 11,
    carbs: 24,
    totalWeight: 480,
    ingredients: [
      { name: "蝦仁", quantity: "150g" },
      { name: "藜麥", quantity: "80g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "紅椒", quantity: "50g" },
      { name: "黃瓜", quantity: "60g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "藜麥煮熟後冷卻",
      "蝦仁煮熟冷卻",
      "混合藜麥、蝦仁、生菜、紅椒、黃瓜",
      "淋上橄欖油和檸檬汁",
      "調味享用"
    ],
    fatLossTips: [
      "蝦仁高蛋白低脂，完美減脂食材",
      "藜麥含完全蛋白質，營養豐富",
      "冷沙律清爽低卡，適合夏季"
    ]
  },
  {
    id: "s-sf-6",
    name: "海鮮混合沙律碗",
    protein_type: "seafood",
    category: "salad",
    kcal: 350,
    protein: 41,
    fat: 10,
    carbs: 16,
    totalWeight: 440,
    ingredients: [
      { name: "蝦仁", quantity: "80g" },
      { name: "吞拿魚", quantity: "80g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "番茄", quantity: "80g" },
      { name: "黃瓜", quantity: "60g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "蝦仁和吞拿魚瀝乾",
      "混合生菜、蝦仁、吞拿魚、番茄、黃瓜",
      "淋上橄欖油和檸檬汁",
      "調味享用"
    ],
    fatLossTips: [
      "海鮮混合高蛋白低脂，營養豐富",
      "多種海鮮提供不同營養",
      "清爽沙律低卡高營養"
    ]
  },
  {
    id: "s-sf-7",
    name: "三文魚番茄沙律",
    protein_type: "seafood",
    category: "salad",
    kcal: 360,
    protein: 38,
    fat: 12,
    carbs: 20,
    totalWeight: 460,
    ingredients: [
      { name: "三文魚", quantity: "140g" },
      { name: "番茄", quantity: "150g" },
      { name: "新鮮羅勒", quantity: "20g" },
      { name: "莫薩里拉芝士", quantity: "30g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "巴薩米克醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "三文魚煮熟切成塊狀",
      "番茄切塊",
      "莫薩里拉芝士撕碎",
      "混合三文魚、番茄、洋蔥、羅勒",
      "淋上橄欖油和巴薩米克醋，撒上莫薩里拉芝士"
    ],
    fatLossTips: [
      "三文魚含Omega-3，促進脂肪燃燒",
      "番茄含茄紅素，強效抗氧化",
      "羅勒含抗氧化物，促進脂肪燃燒"
    ]
  },
  {
    id: "s-sf-8",
    name: "蝦仁青瓜優格沙律",
    protein_type: "seafood",
    category: "salad",
    kcal: 330,
    protein: 39,
    fat: 8,
    carbs: 18,
    totalWeight: 430,
    ingredients: [
      { name: "蝦仁", quantity: "150g" },
      { name: "青瓜", quantity: "150g" },
      { name: "希臘優格", quantity: "60g" },
      { name: "生菜", quantity: "80g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "蝦仁煮熟冷卻",
      "青瓜切成薄片",
      "希臘優格混合檸檬汁",
      "混合生菜、蝦仁、青瓜、洋蔥",
      "淋上優格醬，調味享用"
    ],
    fatLossTips: [
      "蝦仁高蛋白低脂，完美減脂食材",
      "青瓜低卡高水分，增加飽腹感",
      "希臘優格含益生菌，促進消化"
    ]
  },
  {
    id: "s-sf-9",
    name: "吞拿魚粟米沙律",
    protein_type: "seafood",
    category: "salad",
    kcal: 350,
    protein: 40,
    fat: 10,
    carbs: 22,
    totalWeight: 450,
    ingredients: [
      { name: "吞拿魚", quantity: "150g" },
      { name: "粟米", quantity: "80g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "紅椒", quantity: "50g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "吞拿魚瀝乾",
      "混合生菜、吞拿魚、粟米、紅椒、洋蔥",
      "淋上橄欖油和檸檬汁",
      "調味享用"
    ],
    fatLossTips: [
      "吞拿魚高蛋白低脂，完美減脂食材",
      "粟米含纖維，促進消化",
      "清爽沙律低卡高營養"
    ]
  },
  {
    id: "s-sf-10",
    name: "三文魚凱撒沙律",
    protein_type: "seafood",
    category: "salad",
    kcal: 390,
    protein: 41,
    fat: 13,
    carbs: 20,
    totalWeight: 470,
    ingredients: [
      { name: "三文魚", quantity: "150g" },
      { name: "羅馬生菜", quantity: "120g" },
      { name: "帕瑪森芝士", quantity: "20g" },
      { name: "全麥麵包丁", quantity: "30g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "三文魚煮熟切成塊狀",
      "羅馬生菜撕碎",
      "混合生菜、三文魚、麵包丁",
      "淋上橄欖油和檸檬汁",
      "撒上帕瑪森芝士，調味享用"
    ],
    fatLossTips: [
      "三文魚含Omega-3，促進脂肪燃燒",
      "羅馬生菜低卡高纖，增加飽腹感",
      "全麥麵包丁增加纖維，促進消化"
    ]
  }
];

// Salad Recipes - Egg (簡單高蛋白沙律)
const saladEgg: RecipeData[] = [
  {
    id: "s-e-1",
    name: "蛋白凱撒沙律",
    protein_type: "egg",
    category: "salad",
    kcal: 300,
    protein: 38,
    fat: 8,
    carbs: 18,
    totalWeight: 410,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "羅馬生菜", quantity: "120g" },
      { name: "帕瑪森芝士", quantity: "20g" },
      { name: "全麥麵包丁", quantity: "30g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "蛋白煮熟切半",
      "羅馬生菜撕碎",
      "混合生菜、蛋白、麵包丁",
      "淋上橄欖油和檸檬汁",
      "撒上帕瑪森芝士，調味享用"
    ],
    fatLossTips: [
      "蛋白高蛋白低脂，完美減脂食材",
      "羅馬生菜低卡高纖，增加飽腹感",
      "全麥麵包丁增加纖維，促進消化"
    ]
  },
  {
    id: "s-e-2",
    name: "菠菜蛋白沙律碗",
    protein_type: "egg",
    category: "salad",
    kcal: 310,
    protein: 39,
    fat: 9,
    carbs: 16,
    totalWeight: 420,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "菠菜", quantity: "120g" },
      { name: "混合生菜", quantity: "80g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "核桃", quantity: "20g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "紅酒醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "蛋白煮熟切半",
      "菠菜焯水後冷卻",
      "核桃切碎",
      "混合菠菜、生菜、蛋白、洋蔥",
      "淋上橄欖油和紅酒醋，撒上核桃"
    ],
    fatLossTips: [
      "菠菜含鐵質，提升新陳代謝",
      "蛋白高蛋白低脂，增加飽腹感",
      "核桃含Omega-3，促進脂肪燃燒"
    ]
  },
  {
    id: "s-e-3",
    name: "雙蛋白藜麥沙律",
    protein_type: "egg",
    category: "salad",
    kcal: 340,
    protein: 40,
    fat: 10,
    carbs: 24,
    totalWeight: 460,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "藜麥", quantity: "80g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "紅椒", quantity: "50g" },
      { name: "黑豆", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "藜麥煮熟",
      "蛋白煮熟切半",
      "黑豆瀝乾",
      "混合藜麥、蛋白、生菜、紅椒、黑豆",
      "淋上橄欖油和檸檬汁享用"
    ],
    fatLossTips: [
      "藜麥含完全蛋白質，營養豐富",
      "蛋白高蛋白低脂，完美減脂食材",
      "黑豆含纖維，促進消化"
    ]
  },
  {
    id: "s-e-4",
    name: "番茄蛋白沙律",
    protein_type: "egg",
    category: "salad",
    kcal: 290,
    protein: 38,
    fat: 8,
    carbs: 16,
    totalWeight: 410,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "番茄", quantity: "150g" },
      { name: "生菜", quantity: "100g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "香芹", quantity: "20g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "蛋白煮熟切半",
      "番茄切塊",
      "混合生菜、蛋白、番茄、洋蔥",
      "淋上橄欖油和檸檬汁",
      "撒上香芹，調味享用"
    ],
    fatLossTips: [
      "番茄含茄紅素，強效抗氧化",
      "蛋白高蛋白低脂，完美減脂食材",
      "香芹含香豆素，促進脂肪燃燒"
    ]
  },
  {
    id: "s-e-5",
    name: "蛋白牛油果沙律",
    protein_type: "egg",
    category: "salad",
    kcal: 330,
    protein: 37,
    fat: 12,
    carbs: 18,
    totalWeight: 430,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "混合生菜", quantity: "100g" },
      { name: "牛油果", quantity: "1/2個（60g）" },
      { name: "番茄", quantity: "80g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "蛋白煮熟切半",
      "牛油果切半，用叉子壓成泥狀",
      "混合生菜、番茄、洋蔥",
      "放上蛋白和牛油果泥",
      "淋上橄欖油和檸檬汁享用"
    ],
    fatLossTips: [
      "蛋白高蛋白低脂，完美減脂食材",
      "牛油果含健康脂肪，促進代謝",
      "檸檬汁幫助消化，加快代謝"
    ]
  },
  {
    id: "s-e-6",
    name: "蛋白青瓜優格沙律",
    protein_type: "egg",
    category: "salad",
    kcal: 280,
    protein: 38,
    fat: 7,
    carbs: 16,
    totalWeight: 410,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "青瓜", quantity: "150g" },
      { name: "希臘優格", quantity: "60g" },
      { name: "生菜", quantity: "80g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "蛋白煮熟切半",
      "青瓜切成薄片",
      "希臘優格混合檸檬汁",
      "混合生菜、蛋白、青瓜、洋蔥",
      "淋上優格醬，調味享用"
    ],
    fatLossTips: [
      "蛋白高蛋白低脂，完美減脂食材",
      "青瓜低卡高水分，增加飽腹感",
      "希臘優格含益生菌，促進消化"
    ]
  },
  {
    id: "s-e-7",
    name: "蛋白粟米沙律",
    protein_type: "egg",
    category: "salad",
    kcal: 310,
    protein: 38,
    fat: 9,
    carbs: 20,
    totalWeight: 430,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "粟米", quantity: "80g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "紅椒", quantity: "50g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "蛋白煮熟切半",
      "混合生菜、蛋白、粟米、紅椒、洋蔥",
      "淋上橄欖油和檸檬汁",
      "調味享用"
    ],
    fatLossTips: [
      "蛋白高蛋白低脂，完美減脂食材",
      "粟米含纖維，促進消化",
      "清爽沙律低卡高營養"
    ]
  },
  {
    id: "s-e-8",
    name: "蛋白西蘭花沙律",
    protein_type: "egg",
    category: "salad",
    kcal: 300,
    protein: 39,
    fat: 8,
    carbs: 14,
    totalWeight: 410,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "西蘭花", quantity: "120g" },
      { name: "生菜", quantity: "80g" },
      { name: "大蒜", quantity: "3瓣（10g）" },
      { name: "紅椒", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "蛋白煮熟切半",
      "西蘭花焯水後冷卻",
      "大蒜切碎",
      "混合西蘭花、蛋白、生菜、紅椒",
      "淋上蒜香橄欖油和檸檬汁"
    ],
    fatLossTips: [
      "西蘭花含蘿蔔硫素，促進脂肪燃燒",
      "蛋白高蛋白低脂，完美減脂食材",
      "大蒜含硫化物，增強免疫力"
    ]
  },
  {
    id: "s-e-9",
    name: "蛋白混合蔬菜沙律",
    protein_type: "egg",
    category: "salad",
    kcal: 320,
    protein: 38,
    fat: 10,
    carbs: 18,
    totalWeight: 440,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "混合生菜", quantity: "100g" },
      { name: "番茄", quantity: "80g" },
      { name: "黃瓜", quantity: "60g" },
      { name: "紅椒", quantity: "40g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" }
    ],
    steps: [
      "蛋白煮熟切半",
      "所有蔬菜切成適當大小",
      "混合所有材料",
      "淋上橄欖油和檸檬汁",
      "調味享用"
    ],
    fatLossTips: [
      "蛋白高蛋白低脂，完美減脂食材",
      "多彩蔬菜提供豐富營養",
      "清爽沙律低卡高營養"
    ]
  },
  {
    id: "s-e-10",
    name: "蛋白生菜沙律碗",
    protein_type: "egg",
    category: "salad",
    kcal: 290,
    protein: 38,
    fat: 8,
    carbs: 16,
    totalWeight: 420,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "生菜", quantity: "150g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "黃瓜", quantity: "50g" },
      { name: "紅椒", quantity: "30g" },
      { name: "日式醬油", quantity: "1湯匙（15ml）" },
      { name: "米醋", quantity: "1茶匙（5ml）" },
      { name: "白芝麻", quantity: "1茶匙（5g）" }
    ],
    steps: [
      "蛋白煮熟切半",
      "蔬菜切成條狀",
      "用生菜葉包裹蛋白和蔬菜",
      "淋上日式醬油和米醋",
      "撒上白芝麻享用"
    ],
    fatLossTips: [
      "生菜卷低卡高纖，增加飽腹感",
      "蛋白高蛋白低脂，完美減脂食材",
      "日式調味清淡，適合減脂"
    ]
  }
];

// Salad Recipes - Vegetarian (植物蛋白沙律碗)
const saladVegetarian: RecipeData[] = [
  {
    id: "s-v-1",
    name: "牛油果藜麥沙律",
    protein_type: "vegetarian",
    category: "salad",
    kcal: 360,
    protein: 12,
    fat: 14,
    carbs: 42,
    totalWeight: 480,
    ingredients: [
      { name: "藜麥", quantity: "100g" },
      { name: "牛油果", quantity: "1/2個（60g）" },
      { name: "混合生菜", quantity: "100g" },
      { name: "番茄", quantity: "80g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "藜麥煮熟後冷卻",
      "牛油果切半，用叉子壓成泥狀",
      "混合生菜、番茄、洋蔥",
      "放上藜麥和牛油果泥",
      "淋上橄欖油和檸檬汁享用"
    ],
    fatLossTips: [
      "藜麥含完全蛋白質，營養豐富",
      "牛油果含健康脂肪，促進代謝",
      "植物蛋白沙律低卡高營養"
    ]
  },
  {
    id: "s-v-2",
    name: "鷹嘴豆混合沙律",
    protein_type: "vegetarian",
    category: "salad",
    kcal: 340,
    protein: 14,
    fat: 11,
    carbs: 38,
    totalWeight: 460,
    ingredients: [
      { name: "鷹嘴豆", quantity: "100g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "番茄", quantity: "80g" },
      { name: "黃瓜", quantity: "60g" },
      { name: "紅椒", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "鷹嘴豆瀝乾",
      "混合生菜、番茄、黃瓜、紅椒",
      "加入鷹嘴豆",
      "淋上橄欖油和檸檬汁",
      "調味享用"
    ],
    fatLossTips: [
      "鷹嘴豆含植物蛋白和纖維",
      "多彩蔬菜提供豐富營養",
      "植物蛋白沙律低卡高營養"
    ]
  },
  {
    id: "s-v-3",
    name: "豆腐蔬菜沙律碗",
    protein_type: "vegetarian",
    category: "salad",
    kcal: 320,
    protein: 16,
    fat: 10,
    carbs: 32,
    totalWeight: 450,
    ingredients: [
      { name: "豆腐", quantity: "150g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "番茄", quantity: "80g" },
      { name: "黃瓜", quantity: "60g" },
      { name: "紅椒", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "日式醬油", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "豆腐切成塊狀",
      "混合生菜、番茄、黃瓜、紅椒",
      "放上豆腐塊",
      "淋上橄欖油和日式醬油",
      "調味享用"
    ],
    fatLossTips: [
      "豆腐含植物蛋白，低脂高營養",
      "多彩蔬菜提供豐富營養",
      "植物蛋白沙律低卡高營養"
    ]
  },
  {
    id: "s-v-4",
    name: "菠菜堅果沙律",
    protein_type: "vegetarian",
    category: "salad",
    kcal: 350,
    protein: 13,
    fat: 15,
    carbs: 34,
    totalWeight: 440,
    ingredients: [
      { name: "菠菜", quantity: "120g" },
      { name: "混合生菜", quantity: "80g" },
      { name: "堅果混合", quantity: "40g" },
      { name: "番茄", quantity: "80g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "紅酒醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "菠菜焯水後冷卻",
      "堅果切碎",
      "混合菠菜、生菜、番茄、洋蔥",
      "淋上橄欖油和紅酒醋",
      "撒上堅果享用"
    ],
    fatLossTips: [
      "菠菜含鐵質，提升新陳代謝",
      "堅果含Omega-3，促進脂肪燃燒",
      "植物蛋白沙律低卡高營養"
    ]
  },
  {
    id: "s-v-5",
    name: "番茄青瓜沙律",
    protein_type: "vegetarian",
    category: "salad",
    kcal: 280,
    protein: 8,
    fat: 9,
    carbs: 36,
    totalWeight: 420,
    ingredients: [
      { name: "番茄", quantity: "150g" },
      { name: "青瓜", quantity: "150g" },
      { name: "新鮮羅勒", quantity: "20g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "巴薩米克醋", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "番茄切塊",
      "青瓜切成薄片",
      "混合番茄、青瓜、洋蔥、羅勒",
      "淋上橄欖油和巴薩米克醋",
      "調味享用"
    ],
    fatLossTips: [
      "番茄含茄紅素，強效抗氧化",
      "青瓜低卡高水分，增加飽腹感",
      "清爽沙律低卡高營養"
    ]
  },
  {
    id: "s-v-6",
    name: "雜菜健康沙律碗",
    protein_type: "vegetarian",
    category: "salad",
    kcal: 330,
    protein: 12,
    fat: 11,
    carbs: 40,
    totalWeight: 480,
    ingredients: [
      { name: "混合生菜", quantity: "100g" },
      { name: "番茄", quantity: "80g" },
      { name: "黃瓜", quantity: "60g" },
      { name: "紅椒", quantity: "50g" },
      { name: "紅蘿蔔", quantity: "50g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "所有蔬菜切成適當大小",
      "混合所有材料",
      "淋上橄欖油和檸檬汁",
      "調味享用"
    ],
    fatLossTips: [
      "多彩蔬菜提供豐富營養",
      "低卡高纖，增加飽腹感",
      "健康沙律低卡高營養"
    ]
  },
  {
    id: "s-v-7",
    name: "南瓜藜麥沙律",
    protein_type: "vegetarian",
    category: "salad",
    kcal: 340,
    protein: 11,
    fat: 10,
    carbs: 44,
    totalWeight: 470,
    ingredients: [
      { name: "南瓜", quantity: "120g" },
      { name: "藜麥", quantity: "80g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "紅椒", quantity: "40g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "南瓜烤熟冷卻",
      "藜麥煮熟",
      "混合生菜、南瓜、藜麥、紅椒、洋蔥",
      "淋上橄欖油和檸檬汁",
      "調味享用"
    ],
    fatLossTips: [
      "南瓜含β-胡蘿蔔素，抗氧化",
      "藜麥含完全蛋白質，營養豐富",
      "植物蛋白沙律低卡高營養"
    ]
  },
  {
    id: "s-v-8",
    name: "牛油果粟米沙律",
    protein_type: "vegetarian",
    category: "salad",
    kcal: 350,
    protein: 10,
    fat: 14,
    carbs: 40,
    totalWeight: 460,
    ingredients: [
      { name: "牛油果", quantity: "1/2個（60g）" },
      { name: "粟米", quantity: "80g" },
      { name: "混合生菜", quantity: "100g" },
      { name: "紅椒", quantity: "50g" },
      { name: "紅洋蔥", quantity: "30g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "牛油果切塊",
      "混合生菜、粟米、紅椒、洋蔥",
      "放上牛油果塊",
      "淋上橄欖油和檸檬汁",
      "調味享用"
    ],
    fatLossTips: [
      "牛油果含健康脂肪，促進代謝",
      "粟米含纖維，促進消化",
      "植物蛋白沙律低卡高營養"
    ]
  },
  {
    id: "s-v-9",
    name: "豆腐西蘭花沙律",
    protein_type: "vegetarian",
    category: "salad",
    kcal: 310,
    protein: 15,
    fat: 10,
    carbs: 28,
    totalWeight: 440,
    ingredients: [
      { name: "豆腐", quantity: "140g" },
      { name: "西蘭花", quantity: "120g" },
      { name: "生菜", quantity: "80g" },
      { name: "大蒜", quantity: "3瓣（10g）" },
      { name: "紅椒", quantity: "40g" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "檸檬汁", quantity: "1湯匙（15ml）" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "豆腐切成塊狀",
      "西蘭花焯水後冷卻",
      "大蒜切碎",
      "混合西蘭花、豆腐、生菜、紅椒",
      "淋上蒜香橄欖油和檸檬汁"
    ],
    fatLossTips: [
      "豆腐含植物蛋白，低脂高營養",
      "西蘭花含蘿蔔硫素，促進脂肪燃燒",
      "大蒜含硫化物，增強免疫力"
    ]
  },
  {
    id: "s-v-10",
    name: "素食凱撒沙律",
    protein_type: "vegetarian",
    category: "salad",
    kcal: 330,
    protein: 11,
    fat: 12,
    carbs: 36,
    totalWeight: 450,
    ingredients: [
      { name: "羅馬生菜", quantity: "120g" },
      { name: "豆腐", quantity: "100g" },
      { name: "帕瑪森芝士", quantity: "20g" },
      { name: "全麥麵包丁", quantity: "30g" },
      { name: "檸檬", quantity: "1/2個（30g）" },
      { name: "橄欖油", quantity: "1.5茶匙（7.5ml）" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "豆腐切成塊狀",
      "羅馬生菜撕碎",
      "混合生菜、豆腐、麵包丁",
      "淋上橄欖油和檸檬汁",
      "撒上帕瑪森芝士，調味享用"
    ],
    fatLossTips: [
      "豆腐含植物蛋白，低脂高營養",
      "羅馬生菜低卡高纖，增加飽腹感",
      "全麥麵包丁增加纖維，促進消化"
    ]
  }
];

// Snack Recipes
const snackChicken: RecipeData[] = [
  {
    id: "s-c-1",
    name: "香煎雞胸小食盒",
    protein_type: "chicken",
    category: "snack",
    kcal: 240,
    protein: 38,
    fat: 6,
    carbs: 8,
    totalWeight: 280,
    ingredients: [
      { name: "雞胸", quantity: "120g" },
      { name: "蔬菜", quantity: "80g" },
      { name: "橄欖油", quantity: "1茶匙" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "雞胸切片，中火煎至熟",
      "加入蔬菜繼續炒",
      "調味後盛入小盒",
      "冷卻後可帶走食用"
    ],
    fatLossTips: [
      "高蛋白低脂，適合健身後食用",
      "攜帶方便，隨時補充能量",
      "無添加糖分，健康零食選擇"
    ]
  },
  {
    id: "s-c-2",
    name: "雞肉蛋白能量球",
    protein_type: "chicken",
    category: "snack",
    kcal: 180,
    protein: 32,
    fat: 5,
    carbs: 6,
    totalWeight: 200,
    ingredients: [
      { name: "雞胸", quantity: "100g" },
      { name: "燕麥", quantity: "30g" },
      { name: "蛋白", quantity: "1個" },
      { name: "鹽", quantity: "0.5g" }
    ],
    steps: [
      "雞胸煮熟後絞碎",
      "混合燕麥和蛋白",
      "揉成球狀",
      "冷藏後食用"
    ],
    fatLossTips: [
      "方便攜帶的高蛋白小食",
      "燕麥提供持久能量",
      "無油炸，低脂健康"
    ]
  },
  {
    id: "s-c-3",
    name: "雞胸蔬菜串",
    protein_type: "chicken",
    category: "snack",
    kcal: 200,
    protein: 35,
    fat: 4,
    carbs: 10,
    totalWeight: 250,
    ingredients: [
      { name: "雞胸", quantity: "110g" },
      { name: "彩椒", quantity: "60g" },
      { name: "洋蔥", quantity: "40g" },
      { name: "橄欖油", quantity: "1茶匙" }
    ],
    steps: [
      "雞胸切塊",
      "蔬菜切段",
      "串在竹籤上",
      "烤或煎至熟透"
    ],
    fatLossTips: [
      "蛋白質豐富，飽腹感強",
      "蔬菜增加纖維，促進消化",
      "低脂烹飪方式，健康輕食"
    ]
  },
  {
    id: "s-c-4",
    name: "雞肉全麥卷餅",
    protein_type: "chicken",
    category: "snack",
    kcal: 260,
    protein: 36,
    fat: 7,
    carbs: 14,
    totalWeight: 300,
    ingredients: [
      { name: "雞胸", quantity: "100g" },
      { name: "全麥卷餅", quantity: "1張" },
      { name: "生菜", quantity: "40g" },
      { name: "番茄", quantity: "50g" }
    ],
    steps: [
      "雞胸煮熟切絲",
      "全麥卷餅鋪平",
      "加入雞肉、生菜、番茄",
      "捲起享用"
    ],
    fatLossTips: [
      "全麥纖維豐富，血糖穩定",
      "攜帶方便的快手小食",
      "蛋白質與碳水均衡"
    ]
  },
  {
    id: "s-c-5",
    name: "雞肉低脂三文治",
    protein_type: "chicken",
    category: "snack",
    kcal: 280,
    protein: 34,
    fat: 8,
    carbs: 16,
    totalWeight: 320,
    ingredients: [
      { name: "雞胸", quantity: "100g" },
      { name: "全麥麵包", quantity: "2片" },
      { name: "番茄", quantity: "50g" },
      { name: "生菜", quantity: "30g" }
    ],
    steps: [
      "雞胸煮熟切片",
      "全麥麵包烤至微焦",
      "依序放入雞肉、番茄、生菜",
      "對切享用"
    ],
    fatLossTips: [
      "全麥麵包低GI，穩定血糖",
      "新鮮蔬菜增加營養",
      "低脂高蛋白的完美組合"
    ]
  },
  {
    id: "s-c-6",
    name: "雞肉藜麥小碗",
    protein_type: "chicken",
    category: "snack",
    kcal: 220,
    protein: 33,
    fat: 5,
    carbs: 12,
    totalWeight: 260,
    ingredients: [
      { name: "雞胸", quantity: "90g" },
      { name: "藜麥", quantity: "50g" },
      { name: "蔬菜", quantity: "60g" },
      { name: "檸檬汁", quantity: "1茶匙" }
    ],
    steps: [
      "藜麥煮熟",
      "雞胸煮熟切粒",
      "混合藜麥、雞肉、蔬菜",
      "淋上檸檬汁"
    ],
    fatLossTips: [
      "藜麥完全蛋白，營養豐富",
      "低升糖指數，適合減脂",
      "輕盈清爽的能量小食"
    ]
  },
  {
    id: "s-c-7",
    name: "雞肉生菜包",
    protein_type: "chicken",
    category: "snack",
    kcal: 180,
    protein: 32,
    fat: 4,
    carbs: 8,
    totalWeight: 220,
    ingredients: [
      { name: "雞胸", quantity: "100g" },
      { name: "生菜", quantity: "80g" },
      { name: "胡蘿蔔", quantity: "30g" },
      { name: "醬油", quantity: "1茶匙" }
    ],
    steps: [
      "雞胸煮熟切絲",
      "生菜葉鋪平",
      "加入雞肉、胡蘿蔔絲",
      "淋上醬油後包起"
    ],
    fatLossTips: [
      "生菜低卡高纖，增加飽腹感",
      "無澱粉包裝，極低碳水",
      "清爽健康的輕食選擇"
    ]
  },
  {
    id: "s-c-8",
    name: "雞肉蛋白捲",
    protein_type: "chicken",
    category: "snack",
    kcal: 200,
    protein: 36,
    fat: 5,
    carbs: 6,
    totalWeight: 240,
    ingredients: [
      { name: "雞胸", quantity: "100g" },
      { name: "蛋白", quantity: "2個" },
      { name: "蔬菜", quantity: "50g" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "蛋白打成蛋皮",
      "雞胸切絲",
      "蛋皮鋪平放入雞肉和蔬菜",
      "捲起切段"
    ],
    fatLossTips: [
      "蛋白零脂肪，純蛋白質",
      "雞肉增加飽腹感",
      "低卡高營養的完美小食"
    ]
  },
  {
    id: "s-c-9",
    name: "雞肉小沙律盒",
    protein_type: "chicken",
    category: "snack",
    kcal: 210,
    protein: 34,
    fat: 6,
    carbs: 10,
    totalWeight: 280,
    ingredients: [
      { name: "雞胸", quantity: "100g" },
      { name: "混合生菜", quantity: "80g" },
      { name: "番茄", quantity: "40g" },
      { name: "橄欖油醋", quantity: "1湯匙" }
    ],
    steps: [
      "雞胸煮熟切粒",
      "生菜洗淨",
      "混合所有材料",
      "淋上橄欖油醋"
    ],
    fatLossTips: [
      "新鮮蔬菜增加纖維",
      "雞肉提供優質蛋白",
      "低脂健康的沙律小食"
    ]
  },
  {
    id: "s-c-10",
    name: "雞肉乳酪碗",
    protein_type: "chicken",
    category: "snack",
    kcal: 250,
    protein: 37,
    fat: 9,
    carbs: 8,
    totalWeight: 300,
    ingredients: [
      { name: "雞胸", quantity: "100g" },
      { name: "低脂乳酪", quantity: "40g" },
      { name: "蔬菜", quantity: "80g" },
      { name: "堅果", quantity: "15g" }
    ],
    steps: [
      "雞胸煮熟切粒",
      "乳酪切塊",
      "混合雞肉、乳酪、蔬菜",
      "撒上堅果"
    ],
    fatLossTips: [
      "乳酪提供鈣質和蛋白質",
      "堅果增加健康脂肪",
      "營養均衡的能量小食"
    ]
  }
];

const snackPork: RecipeData[] = [
  {
    id: "s-p-1",
    name: "低脂叉燒小食盒",
    protein_type: "pork",
    category: "snack",
    kcal: 260,
    protein: 36,
    fat: 8,
    carbs: 10,
    totalWeight: 300,
    ingredients: [
      { name: "瘦豬肉", quantity: "120g" },
      { name: "蔬菜", quantity: "80g" },
      { name: "醬油", quantity: "1茶匙" },
      { name: "薑", quantity: "5g" }
    ],
    steps: [
      "豬肉切片",
      "用醬油和薑醃製",
      "烤至半熟",
      "配蔬菜盛盒"
    ],
    fatLossTips: [
      "亞洲風味的輕食小食",
      "瘦肉低脂高蛋白",
      "薑提升代謝效果"
    ]
  },
  {
    id: "s-p-2",
    name: "豬肉生菜包",
    protein_type: "pork",
    category: "snack",
    kcal: 200,
    protein: 33,
    fat: 6,
    carbs: 8,
    totalWeight: 260,
    ingredients: [
      { name: "瘦豬肉", quantity: "100g" },
      { name: "生菜", quantity: "80g" },
      { name: "胡蘿蔔", quantity: "40g" },
      { name: "醬油", quantity: "1茶匙" }
    ],
    steps: [
      "豬肉煮熟切絲",
      "生菜葉鋪平",
      "加入豬肉和胡蘿蔔",
      "淋上醬油包起"
    ],
    fatLossTips: [
      "清爽亞洲風味",
      "低碳水高蛋白",
      "生菜增加飽腹感"
    ]
  },
  {
    id: "s-p-3",
    name: "豬里肌三文治",
    protein_type: "pork",
    category: "snack",
    kcal: 280,
    protein: 34,
    fat: 9,
    carbs: 16,
    totalWeight: 320,
    ingredients: [
      { name: "豬里肌", quantity: "100g" },
      { name: "全麥麵包", quantity: "2片" },
      { name: "番茄", quantity: "50g" },
      { name: "生菜", quantity: "30g" }
    ],
    steps: [
      "豬里肌煮熟切片",
      "全麥麵包烤至微焦",
      "依序放入豬肉、番茄、生菜",
      "對切享用"
    ],
    fatLossTips: [
      "豬里肌瘦肉部位",
      "全麥麵包穩定血糖",
      "西方風味的輕食"
    ]
  },
  {
    id: "s-p-4",
    name: "豬肉蛋白捲",
    protein_type: "pork",
    category: "snack",
    kcal: 220,
    protein: 35,
    fat: 7,
    carbs: 8,
    totalWeight: 280,
    ingredients: [
      { name: "瘦豬肉", quantity: "100g" },
      { name: "蛋白", quantity: "2個" },
      { name: "蔬菜", quantity: "50g" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "蛋白打成蛋皮",
      "豬肉切絲",
      "蛋皮鋪平放入豬肉和蔬菜",
      "捲起切段"
    ],
    fatLossTips: [
      "蛋白零脂肪",
      "豬肉提供B族維生素",
      "亞洲風味小食"
    ]
  },
  {
    id: "s-p-5",
    name: "豬肉青瓜小碗",
    protein_type: "pork",
    category: "snack",
    kcal: 190,
    protein: 32,
    fat: 5,
    carbs: 10,
    totalWeight: 260,
    ingredients: [
      { name: "瘦豬肉", quantity: "100g" },
      { name: "青瓜", quantity: "100g" },
      { name: "醬油", quantity: "1茶匙" },
      { name: "芝麻", quantity: "5g" }
    ],
    steps: [
      "豬肉煮熟",
      "青瓜切片",
      "混合豬肉和青瓜",
      "淋上醬油撒芝麻"
    ],
    fatLossTips: [
      "青瓜低卡高水分",
      "清爽開胃",
      "夏季最佳輕食"
    ]
  },
  {
    id: "s-p-6",
    name: "豬肉藜麥小食",
    protein_type: "pork",
    category: "snack",
    kcal: 240,
    protein: 34,
    fat: 7,
    carbs: 14,
    totalWeight: 300,
    ingredients: [
      { name: "瘦豬肉", quantity: "90g" },
      { name: "藜麥", quantity: "50g" },
      { name: "蔬菜", quantity: "60g" },
      { name: "檸檬汁", quantity: "1茶匙" }
    ],
    steps: [
      "藜麥煮熟",
      "豬肉煮熟切粒",
      "混合藜麥、豬肉、蔬菜",
      "淋上檸檬汁"
    ],
    fatLossTips: [
      "藜麥完全蛋白",
      "豬肉提供鐵質",
      "營養均衡的小食"
    ]
  },
  {
    id: "s-p-7",
    name: "豬肉蘋果沙律",
    protein_type: "pork",
    category: "snack",
    kcal: 210,
    protein: 33,
    fat: 6,
    carbs: 12,
    totalWeight: 280,
    ingredients: [
      { name: "瘦豬肉", quantity: "100g" },
      { name: "蘋果", quantity: "80g" },
      { name: "生菜", quantity: "60g" },
      { name: "檸檬汁", quantity: "1茶匙" }
    ],
    steps: [
      "豬肉煮熟切粒",
      "蘋果切丁",
      "混合豬肉、蘋果、生菜",
      "淋上檸檬汁"
    ],
    fatLossTips: [
      "蘋果提供纖維",
      "甜味天然低卡",
      "清爽開胃的組合"
    ]
  },
  {
    id: "s-p-8",
    name: "豬肉芝麻卷",
    protein_type: "pork",
    category: "snack",
    kcal: 270,
    protein: 35,
    fat: 10,
    carbs: 12,
    totalWeight: 300,
    ingredients: [
      { name: "瘦豬肉", quantity: "100g" },
      { name: "全麥卷餅", quantity: "1張" },
      { name: "芝麻醬", quantity: "1茶匙" },
      { name: "蔬菜", quantity: "60g" }
    ],
    steps: [
      "豬肉煮熟切絲",
      "卷餅鋪平",
      "塗上芝麻醬",
      "加入豬肉和蔬菜捲起"
    ],
    fatLossTips: [
      "芝麻醬提供健康脂肪",
      "亞洲風味卷餅",
      "營養豐富的小食"
    ]
  },
  {
    id: "s-p-9",
    name: "豬肉低脂漢堡",
    protein_type: "pork",
    category: "snack",
    kcal: 290,
    protein: 36,
    fat: 10,
    carbs: 18,
    totalWeight: 320,
    ingredients: [
      { name: "瘦豬肉", quantity: "110g" },
      { name: "全麥麵包", quantity: "2片" },
      { name: "番茄", quantity: "50g" },
      { name: "生菜", quantity: "30g" }
    ],
    steps: [
      "豬肉絞碎做成漢堡排",
      "煎至熟透",
      "全麥麵包烤至微焦",
      "組合成漢堡"
    ],
    fatLossTips: [
      "全麥麵包低GI",
      "瘦豬肉低脂",
      "健康版漢堡"
    ]
  },
  {
    id: "s-p-10",
    name: "豬肉飯團",
    protein_type: "pork",
    category: "snack",
    kcal: 250,
    protein: 32,
    fat: 6,
    carbs: 20,
    totalWeight: 300,
    ingredients: [
      { name: "瘦豬肉", quantity: "100g" },
      { name: "糙米飯", quantity: "80g" },
      { name: "海苔", quantity: "1張" },
      { name: "蔬菜", quantity: "40g" }
    ],
    steps: [
      "豬肉煮熟切粒",
      "糙米飯冷卻",
      "混合豬肉和蔬菜",
      "用海苔包裹成團"
    ],
    fatLossTips: [
      "糙米提供纖維",
      "攜帶方便",
      "亞洲經典小食"
    ]
  }
];

const snackBeef: RecipeData[] = [
  {
    id: "s-b-1",
    name: "牛肉能量小碗",
    protein_type: "beef",
    category: "snack",
    kcal: 280,
    protein: 38,
    fat: 10,
    carbs: 10,
    totalWeight: 300,
    ingredients: [
      { name: "瘦牛肉", quantity: "120g" },
      { name: "蔬菜", quantity: "80g" },
      { name: "橄欖油", quantity: "1茶匙" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "牛肉切粒",
      "中火煎至半熟",
      "加入蔬菜",
      "調味盛碗"
    ],
    fatLossTips: [
      "牛肉鐵質豐富",
      "西方風味蛋白小食",
      "能量補充最佳選擇"
    ]
  },
  {
    id: "s-b-2",
    name: "牛肉蛋白卷餅",
    protein_type: "beef",
    category: "snack",
    kcal: 270,
    protein: 36,
    fat: 9,
    carbs: 14,
    totalWeight: 300,
    ingredients: [
      { name: "瘦牛肉", quantity: "100g" },
      { name: "全麥卷餅", quantity: "1張" },
      { name: "蔬菜", quantity: "60g" },
      { name: "醬料", quantity: "1湯匙" }
    ],
    steps: [
      "牛肉煮熟切絲",
      "卷餅鋪平",
      "加入牛肉和蔬菜",
      "淋上醬料捲起"
    ],
    fatLossTips: [
      "西方風味卷餅",
      "全麥纖維豐富",
      "高蛋白低脂"
    ]
  },
  {
    id: "s-b-3",
    name: "牛肉三文治",
    protein_type: "beef",
    category: "snack",
    kcal: 300,
    protein: 37,
    fat: 11,
    carbs: 16,
    totalWeight: 320,
    ingredients: [
      { name: "瘦牛肉", quantity: "110g" },
      { name: "全麥麵包", quantity: "2片" },
      { name: "番茄", quantity: "50g" },
      { name: "生菜", quantity: "30g" }
    ],
    steps: [
      "牛肉煮熟切片",
      "全麥麵包烤至微焦",
      "依序放入牛肉、番茄、生菜",
      "對切享用"
    ],
    fatLossTips: [
      "牛肉蛋白質最豐富",
      "全麥麵包低GI",
      "西方經典小食"
    ]
  },
  {
    id: "s-b-4",
    name: "牛肉藜麥小碗",
    protein_type: "beef",
    category: "snack",
    kcal: 250,
    protein: 35,
    fat: 8,
    carbs: 12,
    totalWeight: 280,
    ingredients: [
      { name: "瘦牛肉", quantity: "100g" },
      { name: "藜麥", quantity: "50g" },
      { name: "蔬菜", quantity: "60g" },
      { name: "檸檬汁", quantity: "1茶匙" }
    ],
    steps: [
      "藜麥煮熟",
      "牛肉煮熟切粒",
      "混合所有材料",
      "淋上檸檬汁"
    ],
    fatLossTips: [
      "藜麥完全蛋白",
      "牛肉提供鐵質",
      "營養均衡小食"
    ]
  },
  {
    id: "s-b-5",
    name: "牛肉芝士小食",
    protein_type: "beef",
    category: "snack",
    kcal: 290,
    protein: 38,
    fat: 12,
    carbs: 8,
    totalWeight: 300,
    ingredients: [
      { name: "瘦牛肉", quantity: "110g" },
      { name: "低脂芝士", quantity: "30g" },
      { name: "蔬菜", quantity: "50g" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "牛肉煮熟",
      "芝士切片",
      "混合牛肉、芝士、蔬菜",
      "冷卻享用"
    ],
    fatLossTips: [
      "芝士提供鈣質",
      "牛肉高蛋白",
      "西方風味組合"
    ]
  },
  {
    id: "s-b-6",
    name: "牛肉生菜包",
    protein_type: "beef",
    category: "snack",
    kcal: 220,
    protein: 35,
    fat: 7,
    carbs: 8,
    totalWeight: 260,
    ingredients: [
      { name: "瘦牛肉", quantity: "100g" },
      { name: "生菜", quantity: "80g" },
      { name: "胡蘿蔔", quantity: "40g" },
      { name: "醬油", quantity: "1茶匙" }
    ],
    steps: [
      "牛肉煮熟切絲",
      "生菜葉鋪平",
      "加入牛肉和胡蘿蔔",
      "淋上醬油包起"
    ],
    fatLossTips: [
      "生菜低卡",
      "牛肉高蛋白",
      "清爽健康"
    ]
  },
  {
    id: "s-b-7",
    name: "牛肉蛋白球",
    protein_type: "beef",
    category: "snack",
    kcal: 240,
    protein: 36,
    fat: 8,
    carbs: 8,
    totalWeight: 280,
    ingredients: [
      { name: "瘦牛肉", quantity: "110g" },
      { name: "燕麥", quantity: "30g" },
      { name: "蛋白", quantity: "1個" },
      { name: "鹽", quantity: "0.5g" }
    ],
    steps: [
      "牛肉煮熟絞碎",
      "混合燕麥和蛋白",
      "揉成球狀",
      "冷藏享用"
    ],
    fatLossTips: [
      "攜帶方便",
      "高蛋白無脂",
      "能量補充最佳"
    ]
  },
  {
    id: "s-b-8",
    name: "牛肉青瓜沙律",
    protein_type: "beef",
    category: "snack",
    kcal: 210,
    protein: 33,
    fat: 6,
    carbs: 10,
    totalWeight: 260,
    ingredients: [
      { name: "瘦牛肉", quantity: "100g" },
      { name: "青瓜", quantity: "100g" },
      { name: "番茄", quantity: "40g" },
      { name: "橄欖油醋", quantity: "1湯匙" }
    ],
    steps: [
      "牛肉煮熟切粒",
      "青瓜切片",
      "混合牛肉、青瓜、番茄",
      "淋上橄欖油醋"
    ],
    fatLossTips: [
      "清爽開胃",
      "低脂高蛋白",
      "夏季最佳小食"
    ]
  },
  {
    id: "s-b-9",
    name: "牛肉飯團",
    protein_type: "beef",
    category: "snack",
    kcal: 270,
    protein: 34,
    fat: 8,
    carbs: 20,
    totalWeight: 300,
    ingredients: [
      { name: "瘦牛肉", quantity: "100g" },
      { name: "糙米飯", quantity: "80g" },
      { name: "海苔", quantity: "1張" },
      { name: "蔬菜", quantity: "40g" }
    ],
    steps: [
      "牛肉煮熟切粒",
      "糙米飯冷卻",
      "混合牛肉和蔬菜",
      "用海苔包裹成團"
    ],
    fatLossTips: [
      "糙米提供纖維",
      "攜帶方便",
      "營養完整"
    ]
  },
  {
    id: "s-b-10",
    name: "牛肉低脂漢堡",
    protein_type: "beef",
    category: "snack",
    kcal: 310,
    protein: 38,
    fat: 12,
    carbs: 18,
    totalWeight: 330,
    ingredients: [
      { name: "瘦牛肉", quantity: "120g" },
      { name: "全麥麵包", quantity: "2片" },
      { name: "番茄", quantity: "50g" },
      { name: "生菜", quantity: "30g" }
    ],
    steps: [
      "牛肉絞碎做成漢堡排",
      "煎至熟透",
      "全麥麵包烤至微焦",
      "組合成漢堡"
    ],
    fatLossTips: [
      "牛肉蛋白最豐富",
      "全麥麵包低GI",
      "健康版漢堡"
    ]
  }
];

const snackSeafood: RecipeData[] = [
  {
    id: "s-s-1",
    name: "三文魚小食盒",
    protein_type: "seafood",
    category: "snack",
    kcal: 250,
    protein: 34,
    fat: 10,
    carbs: 8,
    totalWeight: 280,
    ingredients: [
      { name: "三文魚", quantity: "100g" },
      { name: "蔬菜", quantity: "80g" },
      { name: "檸檬", quantity: "1個" },
      { name: "橄欖油", quantity: "1茶匙" }
    ],
    steps: [
      "三文魚蒸熟",
      "蔬菜切片",
      "混合三文魚和蔬菜",
      "淋上檸檬汁"
    ],
    fatLossTips: [
      "三文魚Omega-3豐富",
      "清爽輕食",
      "冷食最佳"
    ]
  },
  {
    id: "s-s-2",
    name: "蝦仁蛋白碗",
    protein_type: "seafood",
    category: "snack",
    kcal: 200,
    protein: 36,
    fat: 4,
    carbs: 6,
    totalWeight: 240,
    ingredients: [
      { name: "蝦仁", quantity: "120g" },
      { name: "蛋白", quantity: "2個" },
      { name: "蔬菜", quantity: "50g" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "蝦仁煮熟",
      "蛋白煮熟",
      "混合蝦仁、蛋白、蔬菜",
      "冷卻享用"
    ],
    fatLossTips: [
      "蝦仁低脂高蛋白",
      "蛋白零脂肪",
      "極低卡小食"
    ]
  },
  {
    id: "s-s-3",
    name: "吞拿魚三文治",
    protein_type: "seafood",
    category: "snack",
    kcal: 270,
    protein: 33,
    fat: 9,
    carbs: 16,
    totalWeight: 300,
    ingredients: [
      { name: "吞拿魚罐頭", quantity: "100g" },
      { name: "全麥麵包", quantity: "2片" },
      { name: "番茄", quantity: "50g" },
      { name: "生菜", quantity: "30g" }
    ],
    steps: [
      "吞拿魚瀝乾",
      "全麥麵包烤至微焦",
      "依序放入吞拿魚、番茄、生菜",
      "對切享用"
    ],
    fatLossTips: [
      "吞拿魚方便快手",
      "全麥麵包低GI",
      "高蛋白輕食"
    ]
  },
  {
    id: "s-s-4",
    name: "三文魚牛油果卷",
    protein_type: "seafood",
    category: "snack",
    kcal: 280,
    protein: 32,
    fat: 12,
    carbs: 12,
    totalWeight: 300,
    ingredients: [
      { name: "三文魚", quantity: "90g" },
      { name: "牛油果", quantity: "50g" },
      { name: "全麥卷餅", quantity: "1張" },
      { name: "生菜", quantity: "40g" }
    ],
    steps: [
      "三文魚蒸熟",
      "牛油果切片",
      "卷餅鋪平加入所有材料",
      "捲起享用"
    ],
    fatLossTips: [
      "三文魚Omega-3",
      "牛油果健康脂肪",
      "營養完整小食"
    ]
  },
  {
    id: "s-s-5",
    name: "蝦仁藜麥小碗",
    protein_type: "seafood",
    category: "snack",
    kcal: 220,
    protein: 33,
    fat: 5,
    carbs: 12,
    totalWeight: 260,
    ingredients: [
      { name: "蝦仁", quantity: "100g" },
      { name: "藜麥", quantity: "50g" },
      { name: "蔬菜", quantity: "60g" },
      { name: "檸檬汁", quantity: "1茶匙" }
    ],
    steps: [
      "藜麥煮熟",
      "蝦仁煮熟",
      "混合所有材料",
      "淋上檸檬汁"
    ],
    fatLossTips: [
      "藜麥完全蛋白",
      "蝦仁低脂",
      "清爽健康"
    ]
  },
  {
    id: "s-s-6",
    name: "吞拿魚生菜包",
    protein_type: "seafood",
    category: "snack",
    kcal: 190,
    protein: 32,
    fat: 5,
    carbs: 8,
    totalWeight: 240,
    ingredients: [
      { name: "吞拿魚罐頭", quantity: "100g" },
      { name: "生菜", quantity: "80g" },
      { name: "胡蘿蔔", quantity: "40g" },
      { name: "檸檬汁", quantity: "1茶匙" }
    ],
    steps: [
      "吞拿魚瀝乾",
      "生菜葉鋪平",
      "加入吞拿魚和胡蘿蔔",
      "淋上檸檬汁包起"
    ],
    fatLossTips: [
      "吞拿魚方便快手",
      "生菜低卡",
      "極低脂小食"
    ]
  },
  {
    id: "s-s-7",
    name: "三文魚飯團",
    protein_type: "seafood",
    category: "snack",
    kcal: 260,
    protein: 31,
    fat: 8,
    carbs: 20,
    totalWeight: 300,
    ingredients: [
      { name: "三文魚", quantity: "90g" },
      { name: "糙米飯", quantity: "80g" },
      { name: "海苔", quantity: "1張" },
      { name: "蔬菜", quantity: "40g" }
    ],
    steps: [
      "三文魚蒸熟",
      "糙米飯冷卻",
      "混合三文魚和蔬菜",
      "用海苔包裹成團"
    ],
    fatLossTips: [
      "三文魚Omega-3",
      "糙米提供纖維",
      "攜帶方便"
    ]
  },
  {
    id: "s-s-8",
    name: "蝦仁青瓜沙律",
    protein_type: "seafood",
    category: "snack",
    kcal: 180,
    protein: 32,
    fat: 4,
    carbs: 8,
    totalWeight: 240,
    ingredients: [
      { name: "蝦仁", quantity: "100g" },
      { name: "青瓜", quantity: "100g" },
      { name: "番茄", quantity: "40g" },
      { name: "檸檬汁", quantity: "1茶匙" }
    ],
    steps: [
      "蝦仁煮熟",
      "青瓜切片",
      "混合蝦仁、青瓜、番茄",
      "淋上檸檬汁"
    ],
    fatLossTips: [
      "蝦仁低脂",
      "青瓜低卡",
      "清爽開胃"
    ]
  },
  {
    id: "s-s-9",
    name: "海鮮小沙律",
    protein_type: "seafood",
    category: "snack",
    kcal: 210,
    protein: 33,
    fat: 6,
    carbs: 10,
    totalWeight: 280,
    ingredients: [
      { name: "混合海鮮", quantity: "100g" },
      { name: "混合生菜", quantity: "80g" },
      { name: "番茄", quantity: "40g" },
      { name: "橄欖油醋", quantity: "1湯匙" }
    ],
    steps: [
      "海鮮煮熟",
      "生菜洗淨",
      "混合所有材料",
      "淋上橄欖油醋"
    ],
    fatLossTips: [
      "多種海鮮營養豐富",
      "低脂高蛋白",
      "清爽健康"
    ]
  },
  {
    id: "s-s-10",
    name: "吞拿魚乳酪碗",
    protein_type: "seafood",
    category: "snack",
    kcal: 240,
    protein: 35,
    fat: 8,
    carbs: 8,
    totalWeight: 280,
    ingredients: [
      { name: "吞拿魚罐頭", quantity: "100g" },
      { name: "低脂乳酪", quantity: "40g" },
      { name: "蔬菜", quantity: "80g" },
      { name: "堅果", quantity: "10g" }
    ],
    steps: [
      "吞拿魚瀝乾",
      "乳酪切塊",
      "混合吞拿魚、乳酪、蔬菜",
      "撒上堅果"
    ],
    fatLossTips: [
      "吞拿魚方便快手",
      "乳酪提供鈣質",
      "營養均衡"
    ]
  }
];

const snackEgg: RecipeData[] = [
  {
    id: "s-e-1",
    name: "蛋白能量球",
    protein_type: "egg",
    category: "snack",
    kcal: 160,
    protein: 32,
    fat: 2,
    carbs: 6,
    totalWeight: 200,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "燕麥", quantity: "30g" },
      { name: "蜂蜜", quantity: "1茶匙" },
      { name: "鹽", quantity: "0.5g" }
    ],
    steps: [
      "蛋白煮熟",
      "混合燕麥和蜂蜜",
      "揉成球狀",
      "冷藏享用"
    ],
    fatLossTips: [
      "蛋白零脂肪",
      "超低卡高蛋白",
      "方便攜帶"
    ]
  },
  {
    id: "s-e-2",
    name: "雙蛋白小食盒",
    protein_type: "egg",
    category: "snack",
    kcal: 180,
    protein: 34,
    fat: 3,
    carbs: 8,
    totalWeight: 240,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "蔬菜", quantity: "80g" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "蛋白煮熟",
      "蔬菜切片",
      "混合蛋白和蔬菜",
      "調味盛盒"
    ],
    fatLossTips: [
      "蛋白超低脂",
      "蔬菜增加纖維",
      "極低卡小食"
    ]
  },
  {
    id: "s-e-3",
    name: "蛋白牛油果碗",
    protein_type: "egg",
    category: "snack",
    kcal: 220,
    protein: 33,
    fat: 9,
    carbs: 8,
    totalWeight: 260,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "牛油果", quantity: "50g" },
      { name: "番茄", quantity: "50g" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "蛋白煮熟",
      "牛油果切片",
      "混合蛋白、牛油果、番茄",
      "調味享用"
    ],
    fatLossTips: [
      "蛋白高蛋白",
      "牛油果健康脂肪",
      "營養均衡"
    ]
  },
  {
    id: "s-e-4",
    name: "蛋白全麥吐司",
    protein_type: "egg",
    category: "snack",
    kcal: 240,
    protein: 32,
    fat: 6,
    carbs: 16,
    totalWeight: 280,
    ingredients: [
      { name: "蛋白", quantity: "3個" },
      { name: "全麥麵包", quantity: "2片" },
      { name: "番茄", quantity: "50g" },
      { name: "生菜", quantity: "30g" }
    ],
    steps: [
      "蛋白煎成蛋皮",
      "全麥麵包烤至微焦",
      "依序放入蛋白、番茄、生菜",
      "享用"
    ],
    fatLossTips: [
      "全麥麵包低GI",
      "蛋白零脂肪",
      "簡單快手小食"
    ]
  },
  {
    id: "s-e-5",
    name: "蛋白沙律",
    protein_type: "egg",
    category: "snack",
    kcal: 190,
    protein: 33,
    fat: 4,
    carbs: 10,
    totalWeight: 260,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "混合生菜", quantity: "80g" },
      { name: "番茄", quantity: "50g" },
      { name: "檸檬汁", quantity: "1茶匙" }
    ],
    steps: [
      "蛋白煮熟",
      "生菜洗淨",
      "混合蛋白、生菜、番茄",
      "淋上檸檬汁"
    ],
    fatLossTips: [
      "蛋白超低脂",
      "蔬菜增加纖維",
      "清爽開胃"
    ]
  },
  {
    id: "s-e-6",
    name: "蛋白卷餅",
    protein_type: "egg",
    category: "snack",
    kcal: 210,
    protein: 32,
    fat: 5,
    carbs: 14,
    totalWeight: 280,
    ingredients: [
      { name: "蛋白", quantity: "3個" },
      { name: "全麥卷餅", quantity: "1張" },
      { name: "蔬菜", quantity: "60g" },
      { name: "醬料", quantity: "1茶匙" }
    ],
    steps: [
      "蛋白煎成蛋皮",
      "卷餅鋪平",
      "加入蛋白和蔬菜",
      "淋上醬料捲起"
    ],
    fatLossTips: [
      "蛋白零脂肪",
      "全麥纖維豐富",
      "簡單快手"
    ]
  },
  {
    id: "s-e-7",
    name: "蛋白乳酪碗",
    protein_type: "egg",
    category: "snack",
    kcal: 230,
    protein: 35,
    fat: 8,
    carbs: 8,
    totalWeight: 280,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "低脂乳酪", quantity: "40g" },
      { name: "蔬菜", quantity: "60g" },
      { name: "堅果", quantity: "10g" }
    ],
    steps: [
      "蛋白煮熟",
      "乳酪切塊",
      "混合蛋白、乳酪、蔬菜",
      "撒上堅果"
    ],
    fatLossTips: [
      "乳酪提供鈣質",
      "蛋白高蛋白",
      "營養完整"
    ]
  },
  {
    id: "s-e-8",
    name: "蛋白飯團",
    protein_type: "egg",
    category: "snack",
    kcal: 240,
    protein: 31,
    fat: 5,
    carbs: 20,
    totalWeight: 300,
    ingredients: [
      { name: "蛋白", quantity: "3個" },
      { name: "糙米飯", quantity: "80g" },
      { name: "海苔", quantity: "1張" },
      { name: "蔬菜", quantity: "40g" }
    ],
    steps: [
      "蛋白煮熟",
      "糙米飯冷卻",
      "混合蛋白和蔬菜",
      "用海苔包裹成團"
    ],
    fatLossTips: [
      "糙米提供纖維",
      "蛋白高蛋白",
      "攜帶方便"
    ]
  },
  {
    id: "s-e-9",
    name: "蛋白蔬菜碗",
    protein_type: "egg",
    category: "snack",
    kcal: 170,
    protein: 32,
    fat: 3,
    carbs: 10,
    totalWeight: 260,
    ingredients: [
      { name: "蛋白", quantity: "4個" },
      { name: "混合蔬菜", quantity: "100g" },
      { name: "鹽", quantity: "1g" },
      { name: "黑椒", quantity: "0.5g" }
    ],
    steps: [
      "蛋白煮熟",
      "蔬菜切片",
      "混合蛋白和蔬菜",
      "調味享用"
    ],
    fatLossTips: [
      "蛋白超低脂",
      "蔬菜增加纖維",
      "極低卡健康"
    ]
  },
  {
    id: "s-e-10",
    name: "蛋白小三文治",
    protein_type: "egg",
    category: "snack",
    kcal: 220,
    protein: 30,
    fat: 6,
    carbs: 16,
    totalWeight: 280,
    ingredients: [
      { name: "蛋白", quantity: "3個" },
      { name: "全麥麵包", quantity: "2片" },
      { name: "番茄", quantity: "50g" },
      { name: "生菜", quantity: "30g" }
    ],
    steps: [
      "蛋白煎成蛋皮",
      "全麥麵包烤至微焦",
      "依序放入蛋白、番茄、生菜",
      "對切享用"
    ],
    fatLossTips: [
      "全麥麵包低GI",
      "蛋白零脂肪",
      "簡單快手"
    ]
  }
];

const snackVegetarian: RecipeData[] = [
  {
    id: "s-v-1",
    name: "牛油果能量碗",
    protein_type: "vegetarian",
    category: "snack",
    kcal: 240,
    protein: 28,
    fat: 12,
    carbs: 16,
    totalWeight: 280,
    ingredients: [
      { name: "牛油果", quantity: "100g" },
      { name: "藜麥", quantity: "50g" },
      { name: "蔬菜", quantity: "60g" },
      { name: "檸檬汁", quantity: "1茶匙" }
    ],
    steps: [
      "藜麥煮熟",
      "牛油果切粒",
      "混合所有材料",
      "淋上檸檬汁"
    ],
    fatLossTips: [
      "牛油果健康脂肪",
      "藜麥完全蛋白",
      "營養豐富"
    ]
  },
  {
    id: "s-v-2",
    name: "鷹嘴豆小食盒",
    protein_type: "vegetarian",
    category: "snack",
    kcal: 220,
    protein: 26,
    fat: 8,
    carbs: 18,
    totalWeight: 280,
    ingredients: [
      { name: "鷹嘴豆", quantity: "100g" },
      { name: "蔬菜", quantity: "80g" },
      { name: "橄欖油", quantity: "1茶匙" },
      { name: "鹽", quantity: "1g" }
    ],
    steps: [
      "鷹嘴豆煮熟",
      "蔬菜切片",
      "混合鷹嘴豆和蔬菜",
      "淋上橄欖油"
    ],
    fatLossTips: [
      "鷹嘴豆高纖維",
      "植物蛋白豐富",
      "飽腹感強"
    ]
  },
  {
    id: "s-v-3",
    name: "豆腐蔬菜碗",
    protein_type: "vegetarian",
    category: "snack",
    kcal: 200,
    protein: 24,
    fat: 8,
    carbs: 14,
    totalWeight: 260,
    ingredients: [
      { name: "豆腐", quantity: "120g" },
      { name: "混合蔬菜", quantity: "80g" },
      { name: "醬油", quantity: "1茶匙" },
      { name: "薑", quantity: "5g" }
    ],
    steps: [
      "豆腐切塊",
      "蔬菜切片",
      "混合豆腐和蔬菜",
      "淋上醬油"
    ],
    fatLossTips: [
      "豆腐低脂高蛋白",
      "蔬菜增加纖維",
      "清爽健康"
    ]
  },
  {
    id: "s-v-4",
    name: "燕麥堅果碗",
    protein_type: "vegetarian",
    category: "snack",
    kcal: 260,
    protein: 26,
    fat: 11,
    carbs: 20,
    totalWeight: 300,
    ingredients: [
      { name: "燕麥", quantity: "60g" },
      { name: "堅果", quantity: "30g" },
      { name: "水果", quantity: "80g" },
      { name: "蜂蜜", quantity: "1茶匙" }
    ],
    steps: [
      "燕麥煮熟",
      "堅果切碎",
      "水果切粒",
      "混合所有材料淋蜂蜜"
    ],
    fatLossTips: [
      "燕麥高纖維",
      "堅果健康脂肪",
      "能量補充"
    ]
  },
  {
    id: "s-v-5",
    name: "藜麥能量碗",
    protein_type: "vegetarian",
    category: "snack",
    kcal: 230,
    protein: 28,
    fat: 8,
    carbs: 16,
    totalWeight: 280,
    ingredients: [
      { name: "藜麥", quantity: "80g" },
      { name: "蔬菜", quantity: "80g" },
      { name: "豆類", quantity: "40g" },
      { name: "檸檬汁", quantity: "1茶匙" }
    ],
    steps: [
      "藜麥煮熟",
      "豆類煮熟",
      "蔬菜切片",
      "混合所有材料"
    ],
    fatLossTips: [
      "藜麥完全蛋白",
      "豆類高纖維",
      "營養完整"
    ]
  },
  {
    id: "s-v-6",
    name: "素食三文治",
    protein_type: "vegetarian",
    category: "snack",
    kcal: 250,
    protein: 24,
    fat: 9,
    carbs: 18,
    totalWeight: 300,
    ingredients: [
      { name: "全麥麵包", quantity: "2片" },
      { name: "牛油果", quantity: "50g" },
      { name: "番茄", quantity: "60g" },
      { name: "生菜", quantity: "40g" }
    ],
    steps: [
      "全麥麵包烤至微焦",
      "牛油果切片",
      "依序放入牛油果、番茄、生菜",
      "對切享用"
    ],
    fatLossTips: [
      "全麥麵包低GI",
      "牛油果健康脂肪",
      "植物營養豐富"
    ]
  },
  {
    id: "s-v-7",
    name: "豆腐沙律",
    protein_type: "vegetarian",
    category: "snack",
    kcal: 210,
    protein: 22,
    fat: 8,
    carbs: 14,
    totalWeight: 280,
    ingredients: [
      { name: "豆腐", quantity: "120g" },
      { name: "混合生菜", quantity: "80g" },
      { name: "番茄", quantity: "50g" },
      { name: "橄欖油醋", quantity: "1湯匙" }
    ],
    steps: [
      "豆腐切塊",
      "生菜洗淨",
      "混合豆腐、生菜、番茄",
      "淋上橄欖油醋"
    ],
    fatLossTips: [
      "豆腐低脂",
      "蔬菜增加纖維",
      "清爽健康"
    ]
  },
  {
    id: "s-v-8",
    name: "牛油果吐司",
    protein_type: "vegetarian",
    category: "snack",
    kcal: 240,
    protein: 22,
    fat: 11,
    carbs: 18,
    totalWeight: 280,
    ingredients: [
      { name: "全麥麵包", quantity: "2片" },
      { name: "牛油果", quantity: "80g" },
      { name: "番茄", quantity: "50g" },
      { name: "檸檬汁", quantity: "1茶匙" }
    ],
    steps: [
      "全麥麵包烤至微焦",
      "牛油果切片",
      "依序放入牛油果和番茄",
      "淋上檸檬汁"
    ],
    fatLossTips: [
      "全麥麵包低GI",
      "牛油果健康脂肪",
      "簡單快手"
    ]
  },
  {
    id: "s-v-9",
    name: "素食飯團",
    protein_type: "vegetarian",
    category: "snack",
    kcal: 230,
    protein: 20,
    fat: 6,
    carbs: 22,
    totalWeight: 300,
    ingredients: [
      { name: "糙米飯", quantity: "100g" },
      { name: "蔬菜", quantity: "80g" },
      { name: "海苔", quantity: "1張" },
      { name: "醬油", quantity: "1茶匙" }
    ],
    steps: [
      "糙米飯冷卻",
      "蔬菜切片",
      "混合糙米飯和蔬菜",
      "用海苔包裹成團"
    ],
    fatLossTips: [
      "糙米高纖維",
      "蔬菜營養豐富",
      "攜帶方便"
    ]
  },
  {
    id: "s-v-10",
    name: "蔬菜卷餅",
    protein_type: "vegetarian",
    category: "snack",
    kcal: 220,
    protein: 20,
    fat: 8,
    carbs: 18,
    totalWeight: 280,
    ingredients: [
      { name: "全麥卷餅", quantity: "1張" },
      { name: "混合蔬菜", quantity: "100g" },
      { name: "豆腐", quantity: "50g" },
      { name: "醬料", quantity: "1茶匙" }
    ],
    steps: [
      "卷餅鋪平",
      "蔬菜切片",
      "加入蔬菜和豆腐",
      "淋上醬料捲起"
    ],
    fatLossTips: [
      "全麥纖維豐富",
      "蔬菜營養完整",
      "植物蛋白豐富"
    ]
  }
];

// Soup Recipes (湯類)
const soupChicken: RecipeData[] = [
  {
    id: "soup_c1",
    name: "雞肉蔬菜清湯",
    protein_type: "chicken",
    category: "soup",
    kcal: 180,
    protein: 28,
    fat: 3,
    carbs: 8,
    totalWeight: 450,
    ingredients: [
      { name: "雞胸肉", quantity: "150g" },
      { name: "紅蘿蔔", quantity: "80g" },
      { name: "冬瓜", quantity: "100g" },
      { name: "薑", quantity: "3片" },
      { name: "清湯", quantity: "600ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "雞肉切塊焯水",
      "清湯煮沸放入雞肉",
      "加入蔬菜和薑片",
      "中火煮20分鐘",
      "調味即可"
    ],
    fatLossTips: [
      "清湯低脂清爽",
      "蔬菜纖維豐富",
      "雞肉高蛋白"
    ]
  },
  {
    id: "soup_c2",
    name: "雞肉冬瓜湯",
    protein_type: "chicken",
    category: "soup",
    kcal: 160,
    protein: 26,
    fat: 2,
    carbs: 6,
    totalWeight: 500,
    ingredients: [
      { name: "雞胸肉", quantity: "140g" },
      { name: "冬瓜", quantity: "200g" },
      { name: "薏米", quantity: "20g" },
      { name: "清湯", quantity: "700ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "薏米提前浸泡",
      "雞肉切塊焯水",
      "清湯煮沸",
      "加入雞肉、冬瓜、薏米",
      "煮20分鐘調味"
    ],
    fatLossTips: [
      "冬瓜利尿消腫",
      "薏米健脾祛濕",
      "低卡高蛋白"
    ]
  },
  {
    id: "soup_c3",
    name: "雞肉玉米湯",
    protein_type: "chicken",
    category: "soup",
    kcal: 200,
    protein: 27,
    fat: 4,
    carbs: 12,
    totalWeight: 480,
    ingredients: [
      { name: "雞胸肉", quantity: "150g" },
      { name: "玉米", quantity: "100g" },
      { name: "紅蘿蔔", quantity: "60g" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "雞肉切塊焯水",
      "清湯煮沸",
      "加入雞肉和玉米",
      "煮15分鐘",
      "加入紅蘿蔔再煮5分鐘"
    ],
    fatLossTips: [
      "玉米纖維豐富",
      "營養均衡搭配",
      "飽腹感強"
    ]
  },
  {
    id: "soup_c4",
    name: "雞肉香菇湯",
    protein_type: "chicken",
    category: "soup",
    kcal: 170,
    protein: 28,
    fat: 3,
    carbs: 5,
    totalWeight: 420,
    ingredients: [
      { name: "雞胸肉", quantity: "150g" },
      { name: "香菇", quantity: "120g" },
      { name: "薑", quantity: "3片" },
      { name: "清湯", quantity: "600ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "香菇切片",
      "雞肉切塊焯水",
      "清湯煮沸",
      "加入雞肉、香菇、薑片",
      "煮18分鐘調味"
    ],
    fatLossTips: [
      "香菇免疫力強",
      "低脂高蛋白",
      "清淡易消化"
    ]
  },
  {
    id: "soup_c5",
    name: "雞肉番茄湯",
    protein_type: "chicken",
    category: "soup",
    kcal: 190,
    protein: 27,
    fat: 3,
    carbs: 10,
    totalWeight: 460,
    ingredients: [
      { name: "雞胸肉", quantity: "150g" },
      { name: "番茄", quantity: "150g" },
      { name: "洋蔥", quantity: "50g" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "番茄切塊",
      "雞肉切塊焯水",
      "清湯煮沸",
      "加入雞肉、番茄、洋蔥",
      "煮20分鐘調味"
    ],
    fatLossTips: [
      "番茄抗氧化",
      "酸性促消化",
      "低脂營養湯"
    ]
  },
  {
    id: "soup_c6",
    name: "雞肉黑木耳湯",
    protein_type: "chicken",
    category: "soup",
    kcal: 150,
    protein: 26,
    fat: 2,
    carbs: 4,
    totalWeight: 440,
    ingredients: [
      { name: "雞胸肉", quantity: "140g" },
      { name: "黑木耳", quantity: "30g" },
      { name: "紅棗", quantity: "3個" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "黑木耳提前泡軟",
      "紅棗去核",
      "雞肉切塊焯水",
      "清湯煮沸加入所有材料",
      "煮18分鐘調味"
    ],
    fatLossTips: [
      "黑木耳清血管",
      "紅棗補氣血",
      "滋補低脂"
    ]
  },
  {
    id: "soup_c7",
    name: "雞肉絲瓜湯",
    protein_type: "chicken",
    category: "soup",
    kcal: 140,
    protein: 25,
    fat: 2,
    carbs: 3,
    totalWeight: 420,
    ingredients: [
      { name: "雞胸肉", quantity: "130g" },
      { name: "絲瓜", quantity: "150g" },
      { name: "薑", quantity: "2片" },
      { name: "清湯", quantity: "600ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "絲瓜削皮切塊",
      "雞肉切塊焯水",
      "清湯煮沸",
      "加入雞肉和薑片",
      "煮10分鐘加絲瓜再煮5分鐘"
    ],
    fatLossTips: [
      "絲瓜清熱利尿",
      "低卡高纖維",
      "清爽清淡"
    ]
  },
  {
    id: "soup_c8",
    name: "雞肉蘿蔔湯",
    protein_type: "chicken",
    category: "soup",
    kcal: 175,
    protein: 27,
    fat: 3,
    carbs: 7,
    totalWeight: 480,
    ingredients: [
      { name: "雞胸肉", quantity: "150g" },
      { name: "白蘿蔔", quantity: "150g" },
      { name: "薑", quantity: "3片" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "白蘿蔔切塊",
      "雞肉切塊焯水",
      "清湯煮沸",
      "加入雞肉、蘿蔔、薑片",
      "煮22分鐘調味"
    ],
    fatLossTips: [
      "蘿蔔助消化",
      "清熱潤肺",
      "營養清湯"
    ]
  },
  {
    id: "soup_c9",
    name: "雞肉海帶湯",
    protein_type: "chicken",
    category: "soup",
    kcal: 160,
    protein: 27,
    fat: 2,
    carbs: 5,
    totalWeight: 450,
    ingredients: [
      { name: "雞胸肉", quantity: "140g" },
      { name: "海帶", quantity: "40g" },
      { name: "豆腐", quantity: "80g" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "海帶提前泡軟切段",
      "豆腐切塊",
      "雞肉切塊焯水",
      "清湯煮沸加入所有材料",
      "煮20分鐘調味"
    ],
    fatLossTips: [
      "海帶含碘豐富",
      "豆腐植物蛋白",
      "低脂營養湯"
    ]
  },
  {
    id: "soup_c10",
    name: "雞肉薏米湯",
    protein_type: "chicken",
    category: "soup",
    kcal: 185,
    protein: 26,
    fat: 3,
    carbs: 11,
    totalWeight: 500,
    ingredients: [
      { name: "雞胸肉", quantity: "140g" },
      { name: "薏米", quantity: "40g" },
      { name: "紅豆", quantity: "30g" },
      { name: "清湯", quantity: "700ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "薏米和紅豆提前浸泡",
      "雞肉切塊焯水",
      "清湯煮沸",
      "加入薏米、紅豆、雞肉",
      "煮25分鐘調味"
    ],
    fatLossTips: [
      "薏米祛濕健脾",
      "紅豆補血益氣",
      "滋補養生湯"
    ]
  }
];

const soupPork: RecipeData[] = [
  {
    id: "soup_p1",
    name: "豬肉蔬菜湯",
    protein_type: "pork",
    category: "soup",
    kcal: 200,
    protein: 26,
    fat: 6,
    carbs: 9,
    totalWeight: 480,
    ingredients: [
      { name: "豬里肌肉", quantity: "150g" },
      { name: "冬瓜", quantity: "120g" },
      { name: "紅蘿蔔", quantity: "70g" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "豬肉切塊焯水",
      "清湯煮沸",
      "加入豬肉和蔬菜",
      "中火煮20分鐘",
      "調味即可"
    ],
    fatLossTips: [
      "豬肉里肌低脂",
      "蔬菜纖維豐富",
      "清淡營養湯"
    ]
  },
  {
    id: "soup_p2",
    name: "豬肉冬瓜薏米湯",
    protein_type: "pork",
    category: "soup",
    kcal: 190,
    protein: 25,
    fat: 5,
    carbs: 12,
    totalWeight: 520,
    ingredients: [
      { name: "豬里肌肉", quantity: "140g" },
      { name: "冬瓜", quantity: "180g" },
      { name: "薏米", quantity: "30g" },
      { name: "清湯", quantity: "700ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "薏米提前浸泡",
      "豬肉切塊焯水",
      "清湯煮沸",
      "加入豬肉、冬瓜、薏米",
      "煮25分鐘調味"
    ],
    fatLossTips: [
      "冬瓜利尿消腫",
      "薏米祛濕健脾",
      "低脂清爽湯"
    ]
  },
  {
    id: "soup_p3",
    name: "豬肉玉米湯",
    protein_type: "pork",
    category: "soup",
    kcal: 220,
    protein: 26,
    fat: 7,
    carbs: 14,
    totalWeight: 500,
    ingredients: [
      { name: "豬里肌肉", quantity: "150g" },
      { name: "玉米", quantity: "120g" },
      { name: "紅蘿蔔", quantity: "80g" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "豬肉切塊焯水",
      "清湯煮沸",
      "加入豬肉和玉米",
      "煮15分鐘",
      "加入紅蘿蔔再煮6分鐘"
    ],
    fatLossTips: [
      "玉米纖維豐富",
      "營養均衡搭配",
      "飽腹感強"
    ]
  },
  {
    id: "soup_p4",
    name: "豬肉香菇湯",
    protein_type: "pork",
    category: "soup",
    kcal: 210,
    protein: 27,
    fat: 6,
    carbs: 6,
    totalWeight: 460,
    ingredients: [
      { name: "豬里肌肉", quantity: "150g" },
      { name: "香菇", quantity: "130g" },
      { name: "薑", quantity: "3片" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "香菇切片",
      "豬肉切塊焯水",
      "清湯煮沸",
      "加入豬肉、香菇、薑片",
      "煮20分鐘調味"
    ],
    fatLossTips: [
      "香菇免疫力強",
      "豬肉營養豐富",
      "清淡易消化"
    ]
  },
  {
    id: "soup_p5",
    name: "豬肉番茄湯",
    protein_type: "pork",
    category: "soup",
    kcal: 215,
    protein: 26,
    fat: 6,
    carbs: 11,
    totalWeight: 480,
    ingredients: [
      { name: "豬里肌肉", quantity: "150g" },
      { name: "番茄", quantity: "160g" },
      { name: "洋蔥", quantity: "60g" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "番茄切塊",
      "豬肉切塊焯水",
      "清湯煮沸",
      "加入豬肉、番茄、洋蔥",
      "煮22分鐘調味"
    ],
    fatLossTips: [
      "番茄抗氧化",
      "酸性促消化",
      "營養清湯"
    ]
  },
  {
    id: "soup_p6",
    name: "豬肉黑木耳湯",
    protein_type: "pork",
    category: "soup",
    kcal: 195,
    protein: 25,
    fat: 5,
    carbs: 5,
    totalWeight: 460,
    ingredients: [
      { name: "豬里肌肉", quantity: "140g" },
      { name: "黑木耳", quantity: "35g" },
      { name: "紅棗", quantity: "4個" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "黑木耳提前泡軟",
      "紅棗去核",
      "豬肉切塊焯水",
      "清湯煮沸加入所有材料",
      "煮20分鐘調味"
    ],
    fatLossTips: [
      "黑木耳清血管",
      "紅棗補氣血",
      "滋補營養湯"
    ]
  },
  {
    id: "soup_p7",
    name: "豬肉絲瓜湯",
    protein_type: "pork",
    category: "soup",
    kcal: 185,
    protein: 24,
    fat: 5,
    carbs: 4,
    totalWeight: 450,
    ingredients: [
      { name: "豬里肌肉", quantity: "130g" },
      { name: "絲瓜", quantity: "160g" },
      { name: "薑", quantity: "2片" },
      { name: "清湯", quantity: "600ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "絲瓜削皮切塊",
      "豬肉切塊焯水",
      "清湯煮沸",
      "加入豬肉和薑片",
      "煮10分鐘加絲瓜再煮5分鐘"
    ],
    fatLossTips: [
      "絲瓜清熱利尿",
      "低卡高纖維",
      "清爽清淡"
    ]
  },
  {
    id: "soup_p8",
    name: "豬肉蘿蔔湯",
    protein_type: "pork",
    category: "soup",
    kcal: 205,
    protein: 26,
    fat: 6,
    carbs: 8,
    totalWeight: 500,
    ingredients: [
      { name: "豬里肌肉", quantity: "150g" },
      { name: "白蘿蔔", quantity: "160g" },
      { name: "薑", quantity: "3片" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "白蘿蔔切塊",
      "豬肉切塊焯水",
      "清湯煮沸",
      "加入豬肉、蘿蔔、薑片",
      "煮24分鐘調味"
    ],
    fatLossTips: [
      "蘿蔔助消化",
      "清熱潤肺",
      "營養清湯"
    ]
  },
  {
    id: "soup_p9",
    name: "豬肉海帶湯",
    protein_type: "pork",
    category: "soup",
    kcal: 200,
    protein: 26,
    fat: 5,
    carbs: 6,
    totalWeight: 480,
    ingredients: [
      { name: "豬里肌肉", quantity: "140g" },
      { name: "海帶", quantity: "45g" },
      { name: "豆腐", quantity: "90g" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "海帶提前泡軟切段",
      "豆腐切塊",
      "豬肉切塊焯水",
      "清湯煮沸加入所有材料",
      "煮22分鐘調味"
    ],
    fatLossTips: [
      "海帶含碘豐富",
      "豆腐植物蛋白",
      "低脂營養湯"
    ]
  },
  {
    id: "soup_p10",
    name: "豬肉薏米湯",
    protein_type: "pork",
    category: "soup",
    kcal: 220,
    protein: 25,
    fat: 6,
    carbs: 13,
    totalWeight: 520,
    ingredients: [
      { name: "豬里肌肉", quantity: "140g" },
      { name: "薏米", quantity: "45g" },
      { name: "紅豆", quantity: "35g" },
      { name: "清湯", quantity: "700ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "薏米和紅豆提前浸泡",
      "豬肉切塊焯水",
      "清湯煮沸",
      "加入薏米、紅豆、豬肉",
      "煮27分鐘調味"
    ],
    fatLossTips: [
      "薏米祛濕健脾",
      "紅豆補血益氣",
      "滋補養生湯"
    ]
  }
];

const soupBeef: RecipeData[] = [
  {
    id: "soup_b1",
    name: "牛肉蔬菜湯",
    protein_type: "beef",
    category: "soup",
    kcal: 230,
    protein: 28,
    fat: 8,
    carbs: 10,
    totalWeight: 500,
    ingredients: [
      { name: "牛肉", quantity: "160g" },
      { name: "冬瓜", quantity: "120g" },
      { name: "紅蘿蔔", quantity: "80g" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "牛肉切塊焯水",
      "清湯煮沸",
      "加入牛肉和蔬菜",
      "中火煮25分鐘",
      "調味即可"
    ],
    fatLossTips: [
      "牛肉鐵質豐富",
      "蔬菜纖維豐富",
      "營養均衡湯"
    ]
  },
  {
    id: "soup_b2",
    name: "牛肉冬瓜薏米湯",
    protein_type: "beef",
    category: "soup",
    kcal: 220,
    protein: 27,
    fat: 7,
    carbs: 13,
    totalWeight: 540,
    ingredients: [
      { name: "牛肉", quantity: "150g" },
      { name: "冬瓜", quantity: "180g" },
      { name: "薏米", quantity: "35g" },
      { name: "清湯", quantity: "700ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "薏米提前浸泡",
      "牛肉切塊焯水",
      "清湯煮沸",
      "加入牛肉、冬瓜、薏米",
      "煮27分鐘調味"
    ],
    fatLossTips: [
      "冬瓜利尿消腫",
      "薏米祛濕健脾",
      "低脂營養湯"
    ]
  },
  {
    id: "soup_b3",
    name: "牛肉玉米湯",
    protein_type: "beef",
    category: "soup",
    kcal: 250,
    protein: 28,
    fat: 9,
    carbs: 15,
    totalWeight: 520,
    ingredients: [
      { name: "牛肉", quantity: "160g" },
      { name: "玉米", quantity: "130g" },
      { name: "紅蘿蔔", quantity: "90g" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "牛肉切塊焯水",
      "清湯煮沸",
      "加入牛肉和玉米",
      "煮17分鐘",
      "加入紅蘿蔔再煮7分鐘"
    ],
    fatLossTips: [
      "玉米纖維豐富",
      "營養均衡搭配",
      "飽腹感強"
    ]
  },
  {
    id: "soup_b4",
    name: "牛肉香菇湯",
    protein_type: "beef",
    category: "soup",
    kcal: 240,
    protein: 29,
    fat: 8,
    carbs: 7,
    totalWeight: 480,
    ingredients: [
      { name: "牛肉", quantity: "160g" },
      { name: "香菇", quantity: "140g" },
      { name: "薑", quantity: "3片" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "香菇切片",
      "牛肉切塊焯水",
      "清湯煮沸",
      "加入牛肉、香菇、薑片",
      "煮22分鐘調味"
    ],
    fatLossTips: [
      "香菇免疫力強",
      "牛肉營養豐富",
      "清淡易消化"
    ]
  },
  {
    id: "soup_b5",
    name: "牛肉番茄湯",
    protein_type: "beef",
    category: "soup",
    kcal: 245,
    protein: 28,
    fat: 8,
    carbs: 12,
    totalWeight: 500,
    ingredients: [
      { name: "牛肉", quantity: "160g" },
      { name: "番茄", quantity: "170g" },
      { name: "洋蔥", quantity: "70g" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "番茄切塊",
      "牛肉切塊焯水",
      "清湯煮沸",
      "加入牛肉、番茄、洋蔥",
      "煮24分鐘調味"
    ],
    fatLossTips: [
      "番茄抗氧化",
      "酸性促消化",
      "營養清湯"
    ]
  },
  {
    id: "soup_b6",
    name: "牛肉黑木耳湯",
    protein_type: "beef",
    category: "soup",
    kcal: 225,
    protein: 27,
    fat: 7,
    carbs: 6,
    totalWeight: 480,
    ingredients: [
      { name: "牛肉", quantity: "150g" },
      { name: "黑木耳", quantity: "40g" },
      { name: "紅棗", quantity: "4個" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "黑木耳提前泡軟",
      "紅棗去核",
      "牛肉切塊焯水",
      "清湯煮沸加入所有材料",
      "煮22分鐘調味"
    ],
    fatLossTips: [
      "黑木耳清血管",
      "紅棗補氣血",
      "滋補營養湯"
    ]
  },
  {
    id: "soup_b7",
    name: "牛肉絲瓜湯",
    protein_type: "beef",
    category: "soup",
    kcal: 215,
    protein: 26,
    fat: 7,
    carbs: 5,
    totalWeight: 470,
    ingredients: [
      { name: "牛肉", quantity: "140g" },
      { name: "絲瓜", quantity: "170g" },
      { name: "薑", quantity: "2片" },
      { name: "清湯", quantity: "600ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "絲瓜削皮切塊",
      "牛肉切塊焯水",
      "清湯煮沸",
      "加入牛肉和薑片",
      "煮11分鐘加絲瓜再煮6分鐘"
    ],
    fatLossTips: [
      "絲瓜清熱利尿",
      "低卡高纖維",
      "清爽清淡"
    ]
  },
  {
    id: "soup_b8",
    name: "牛肉蘿蔔湯",
    protein_type: "beef",
    category: "soup",
    kcal: 235,
    protein: 28,
    fat: 8,
    carbs: 9,
    totalWeight: 520,
    ingredients: [
      { name: "牛肉", quantity: "160g" },
      { name: "白蘿蔔", quantity: "170g" },
      { name: "薑", quantity: "3片" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "白蘿蔔切塊",
      "牛肉切塊焯水",
      "清湯煮沸",
      "加入牛肉、蘿蔔、薑片",
      "煮26分鐘調味"
    ],
    fatLossTips: [
      "蘿蔔助消化",
      "清熱潤肺",
      "營養清湯"
    ]
  },
  {
    id: "soup_b9",
    name: "牛肉海帶湯",
    protein_type: "beef",
    category: "soup",
    kcal: 230,
    protein: 28,
    fat: 7,
    carbs: 7,
    totalWeight: 500,
    ingredients: [
      { name: "牛肉", quantity: "150g" },
      { name: "海帶", quantity: "50g" },
      { name: "豆腐", quantity: "100g" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "海帶提前泡軟切段",
      "豆腐切塊",
      "牛肉切塊焯水",
      "清湯煮沸加入所有材料",
      "煮24分鐘調味"
    ],
    fatLossTips: [
      "海帶含碘豐富",
      "豆腐植物蛋白",
      "低脂營養湯"
    ]
  },
  {
    id: "soup_b10",
    name: "牛肉薏米湯",
    protein_type: "beef",
    category: "soup",
    kcal: 250,
    protein: 27,
    fat: 8,
    carbs: 14,
    totalWeight: 540,
    ingredients: [
      { name: "牛肉", quantity: "150g" },
      { name: "薏米", quantity: "50g" },
      { name: "紅豆", quantity: "40g" },
      { name: "清湯", quantity: "700ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "薏米和紅豆提前浸泡",
      "牛肉切塊焯水",
      "清湯煮沸",
      "加入薏米、紅豆、牛肉",
      "煮29分鐘調味"
    ],
    fatLossTips: [
      "薏米祛濕健脾",
      "紅豆補血益氣",
      "滋補養生湯"
    ]
  }
];

const soupSeafood: RecipeData[] = [
  {
    id: "soup_sf1",
    name: "蝦仁蔬菜湯",
    protein_type: "seafood",
    category: "soup",
    kcal: 160,
    protein: 26,
    fat: 2,
    carbs: 8,
    totalWeight: 440,
    ingredients: [
      { name: "蝦仁", quantity: "140g" },
      { name: "冬瓜", quantity: "120g" },
      { name: "紅蘿蔔", quantity: "70g" },
      { name: "清湯", quantity: "600ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "蝦仁清洗",
      "清湯煮沸",
      "加入蝦仁和蔬菜",
      "中火煮15分鐘",
      "調味即可"
    ],
    fatLossTips: [
      "蝦仁低脂高蛋白",
      "蔬菜纖維豐富",
      "清淡營養湯"
    ]
  },
  {
    id: "soup_sf2",
    name: "蝦仁冬瓜薏米湯",
    protein_type: "seafood",
    category: "soup",
    kcal: 150,
    protein: 25,
    fat: 2,
    carbs: 11,
    totalWeight: 500,
    ingredients: [
      { name: "蝦仁", quantity: "130g" },
      { name: "冬瓜", quantity: "180g" },
      { name: "薏米", quantity: "30g" },
      { name: "清湯", quantity: "700ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "薏米提前浸泡",
      "蝦仁清洗",
      "清湯煮沸",
      "加入蝦仁、冬瓜、薏米",
      "煮22分鐘調味"
    ],
    fatLossTips: [
      "冬瓜利尿消腫",
      "薏米祛濕健脾",
      "低脂清爽湯"
    ]
  },
  {
    id: "soup_sf3",
    name: "蝦仁玉米湯",
    protein_type: "seafood",
    category: "soup",
    kcal: 180,
    protein: 27,
    fat: 3,
    carbs: 13,
    totalWeight: 480,
    ingredients: [
      { name: "蝦仁", quantity: "140g" },
      { name: "玉米", quantity: "120g" },
      { name: "紅蘿蔔", quantity: "80g" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "蝦仁清洗",
      "清湯煮沸",
      "加入蝦仁和玉米",
      "煮12分鐘",
      "加入紅蘿蔔再煮5分鐘"
    ],
    fatLossTips: [
      "玉米纖維豐富",
      "營養均衡搭配",
      "飽腹感強"
    ]
  },
  {
    id: "soup_sf4",
    name: "蝦仁香菇湯",
    protein_type: "seafood",
    category: "soup",
    kcal: 170,
    protein: 27,
    fat: 2,
    carbs: 5,
    totalWeight: 420,
    ingredients: [
      { name: "蝦仁", quantity: "140g" },
      { name: "香菇", quantity: "120g" },
      { name: "薑", quantity: "2片" },
      { name: "清湯", quantity: "600ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "香菇切片",
      "蝦仁清洗",
      "清湯煮沸",
      "加入蝦仁、香菇、薑片",
      "煮18分鐘調味"
    ],
    fatLossTips: [
      "香菇免疫力強",
      "蝦仁高蛋白",
      "清淡易消化"
    ]
  },
  {
    id: "soup_sf5",
    name: "蝦仁番茄湯",
    protein_type: "seafood",
    category: "soup",
    kcal: 175,
    protein: 26,
    fat: 2,
    carbs: 10,
    totalWeight: 460,
    ingredients: [
      { name: "蝦仁", quantity: "140g" },
      { name: "番茄", quantity: "150g" },
      { name: "洋蔥", quantity: "50g" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "番茄切塊",
      "蝦仁清洗",
      "清湯煮沸",
      "加入蝦仁、番茄、洋蔥",
      "煮20分鐘調味"
    ],
    fatLossTips: [
      "番茄抗氧化",
      "酸性促消化",
      "低脂營養湯"
    ]
  },
  {
    id: "soup_sf6",
    name: "蝦仁黑木耳湯",
    protein_type: "seafood",
    category: "soup",
    kcal: 155,
    protein: 26,
    fat: 1,
    carbs: 4,
    totalWeight: 440,
    ingredients: [
      { name: "蝦仁", quantity: "130g" },
      { name: "黑木耳", quantity: "30g" },
      { name: "紅棗", quantity: "3個" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "黑木耳提前泡軟",
      "紅棗去核",
      "蝦仁清洗",
      "清湯煮沸加入所有材料",
      "煮18分鐘調味"
    ],
    fatLossTips: [
      "黑木耳清血管",
      "紅棗補氣血",
      "滋補低脂"
    ]
  },
  {
    id: "soup_sf7",
    name: "蝦仁絲瓜湯",
    protein_type: "seafood",
    category: "soup",
    kcal: 145,
    protein: 25,
    fat: 1,
    carbs: 3,
    totalWeight: 420,
    ingredients: [
      { name: "蝦仁", quantity: "130g" },
      { name: "絲瓜", quantity: "150g" },
      { name: "薑", quantity: "2片" },
      { name: "清湯", quantity: "600ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "絲瓜削皮切塊",
      "蝦仁清洗",
      "清湯煮沸",
      "加入蝦仁和薑片",
      "煮8分鐘加絲瓜再煮4分鐘"
    ],
    fatLossTips: [
      "絲瓜清熱利尿",
      "低卡高纖維",
      "清爽清淡"
    ]
  },
  {
    id: "soup_sf8",
    name: "蝦仁蘿蔔湯",
    protein_type: "seafood",
    category: "soup",
    kcal: 165,
    protein: 26,
    fat: 2,
    carbs: 7,
    totalWeight: 480,
    ingredients: [
      { name: "蝦仁", quantity: "140g" },
      { name: "白蘿蔔", quantity: "150g" },
      { name: "薑", quantity: "3片" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "白蘿蔔切塊",
      "蝦仁清洗",
      "清湯煮沸",
      "加入蝦仁、蘿蔔、薑片",
      "煮20分鐘調味"
    ],
    fatLossTips: [
      "蘿蔔助消化",
      "清熱潤肺",
      "營養清湯"
    ]
  },
  {
    id: "soup_sf9",
    name: "蝦仁海帶湯",
    protein_type: "seafood",
    category: "soup",
    kcal: 160,
    protein: 27,
    fat: 1,
    carbs: 5,
    totalWeight: 450,
    ingredients: [
      { name: "蝦仁", quantity: "140g" },
      { name: "海帶", quantity: "40g" },
      { name: "豆腐", quantity: "80g" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "海帶提前泡軟切段",
      "豆腐切塊",
      "蝦仁清洗",
      "清湯煮沸加入所有材料",
      "煮20分鐘調味"
    ],
    fatLossTips: [
      "海帶含碘豐富",
      "豆腐植物蛋白",
      "低脂營養湯"
    ]
  },
  {
    id: "soup_sf10",
    name: "蝦仁薏米湯",
    protein_type: "seafood",
    category: "soup",
    kcal: 170,
    protein: 26,
    fat: 2,
    carbs: 11,
    totalWeight: 500,
    ingredients: [
      { name: "蝦仁", quantity: "140g" },
      { name: "薏米", quantity: "40g" },
      { name: "紅豆", quantity: "30g" },
      { name: "清湯", quantity: "700ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "薏米和紅豆提前浸泡",
      "蝦仁清洗",
      "清湯煮沸",
      "加入薏米、紅豆、蝦仁",
      "煮23分鐘調味"
    ],
    fatLossTips: [
      "薏米祛濕健脾",
      "紅豆補血益氣",
      "滋補養生湯"
    ]
  }
];

const soupEgg: RecipeData[] = [
  {
    id: "soup_e1",
    name: "蛋白蔬菜湯",
    protein_type: "egg",
    category: "soup",
    kcal: 140,
    protein: 24,
    fat: 2,
    carbs: 7,
    totalWeight: 420,
    ingredients: [
      { name: "蛋", quantity: "2個" },
      { name: "冬瓜", quantity: "120g" },
      { name: "紅蘿蔔", quantity: "70g" },
      { name: "清湯", quantity: "600ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "蛋打散",
      "清湯煮沸",
      "加入蔬菜",
      "煮10分鐘後倒入蛋液",
      "調味即可"
    ],
    fatLossTips: [
      "蛋白質完整",
      "蔬菜纖維豐富",
      "清淡營養湯"
    ]
  },
  {
    id: "soup_e2",
    name: "蛋白冬瓜薏米湯",
    protein_type: "egg",
    category: "soup",
    kcal: 130,
    protein: 23,
    fat: 2,
    carbs: 10,
    totalWeight: 480,
    ingredients: [
      { name: "蛋", quantity: "2個" },
      { name: "冬瓜", quantity: "180g" },
      { name: "薏米", quantity: "30g" },
      { name: "清湯", quantity: "700ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "薏米提前浸泡",
      "清湯煮沸",
      "加入冬瓜、薏米",
      "煮15分鐘後倒入蛋液",
      "調味即可"
    ],
    fatLossTips: [
      "冬瓜利尿消腫",
      "薏米祛濕健脾",
      "低脂清爽湯"
    ]
  },
  {
    id: "soup_e3",
    name: "蛋白玉米湯",
    protein_type: "egg",
    category: "soup",
    kcal: 160,
    protein: 25,
    fat: 3,
    carbs: 12,
    totalWeight: 460,
    ingredients: [
      { name: "蛋", quantity: "2個" },
      { name: "玉米", quantity: "120g" },
      { name: "紅蘿蔔", quantity: "80g" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "蛋打散",
      "清湯煮沸",
      "加入玉米和紅蘿蔔",
      "煮12分鐘後倒入蛋液",
      "調味即可"
    ],
    fatLossTips: [
      "玉米纖維豐富",
      "營養均衡搭配",
      "飽腹感強"
    ]
  },
  {
    id: "soup_e4",
    name: "蛋白香菇湯",
    protein_type: "egg",
    category: "soup",
    kcal: 150,
    protein: 24,
    fat: 2,
    carbs: 4,
    totalWeight: 400,
    ingredients: [
      { name: "蛋", quantity: "2個" },
      { name: "香菇", quantity: "120g" },
      { name: "薑", quantity: "2片" },
      { name: "清湯", quantity: "600ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "香菇切片",
      "蛋打散",
      "清湯煮沸",
      "加入香菇、薑片，煮10分鐘後倒入蛋液",
      "調味即可"
    ],
    fatLossTips: [
      "香菇免疫力強",
      "蛋白質完整",
      "清淡易消化"
    ]
  },
  {
    id: "soup_e5",
    name: "蛋白番茄湯",
    protein_type: "egg",
    category: "soup",
    kcal: 155,
    protein: 24,
    fat: 2,
    carbs: 9,
    totalWeight: 440,
    ingredients: [
      { name: "蛋", quantity: "2個" },
      { name: "番茄", quantity: "150g" },
      { name: "洋蔥", quantity: "50g" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "番茄切塊",
      "蛋打散",
      "清湯煮沸",
      "加入番茄、洋蔥，煮12分鐘後倒入蛋液",
      "調味即可"
    ],
    fatLossTips: [
      "番茄抗氧化",
      "酸性促消化",
      "低脂營養湯"
    ]
  },
  {
    id: "soup_e6",
    name: "蛋白黑木耳湯",
    protein_type: "egg",
    category: "soup",
    kcal: 135,
    protein: 23,
    fat: 2,
    carbs: 4,
    totalWeight: 420,
    ingredients: [
      { name: "蛋", quantity: "2個" },
      { name: "黑木耳", quantity: "30g" },
      { name: "紅棗", quantity: "3個" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "黑木耳提前泡軟",
      "紅棗去核",
      "蛋打散",
      "清湯煮沸加入黑木耳、紅棗，煮10分鐘後倒入蛋液",
      "調味即可"
    ],
    fatLossTips: [
      "黑木耳清血管",
      "紅棗補氣血",
      "滋補低脂"
    ]
  },
  {
    id: "soup_e7",
    name: "蛋白絲瓜湯",
    protein_type: "egg",
    category: "soup",
    kcal: 125,
    protein: 22,
    fat: 2,
    carbs: 2,
    totalWeight: 400,
    ingredients: [
      { name: "蛋", quantity: "2個" },
      { name: "絲瓜", quantity: "150g" },
      { name: "薑", quantity: "2片" },
      { name: "清湯", quantity: "600ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "絲瓜削皮切塊",
      "蛋打散",
      "清湯煮沸",
      "加入絲瓜、薑片，煮8分鐘後倒入蛋液",
      "調味即可"
    ],
    fatLossTips: [
      "絲瓜清熱利尿",
      "低卡高纖維",
      "清爽清淡"
    ]
  },
  {
    id: "soup_e8",
    name: "蛋白蘿蔔湯",
    protein_type: "egg",
    category: "soup",
    kcal: 145,
    protein: 24,
    fat: 2,
    carbs: 6,
    totalWeight: 460,
    ingredients: [
      { name: "蛋", quantity: "2個" },
      { name: "白蘿蔔", quantity: "150g" },
      { name: "薑", quantity: "3片" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "白蘿蔔切塊",
      "蛋打散",
      "清湯煮沸",
      "加入蘿蔔、薑片，煮15分鐘後倒入蛋液",
      "調味即可"
    ],
    fatLossTips: [
      "蘿蔔助消化",
      "清熱潤肺",
      "營養清湯"
    ]
  },
  {
    id: "soup_e9",
    name: "蛋白海帶湯",
    protein_type: "egg",
    category: "soup",
    kcal: 140,
    protein: 25,
    fat: 2,
    carbs: 5,
    totalWeight: 430,
    ingredients: [
      { name: "蛋", quantity: "2個" },
      { name: "海帶", quantity: "40g" },
      { name: "豆腐", quantity: "80g" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "海帶提前泡軟切段",
      "豆腐切塊",
      "蛋打散",
      "清湯煮沸加入海帶、豆腐，煮10分鐘後倒入蛋液",
      "調味即可"
    ],
    fatLossTips: [
      "海帶含碘豐富",
      "豆腐植物蛋白",
      "低脂營養湯"
    ]
  },
  {
    id: "soup_e10",
    name: "蛋白薏米湯",
    protein_type: "egg",
    category: "soup",
    kcal: 150,
    protein: 23,
    fat: 2,
    carbs: 10,
    totalWeight: 480,
    ingredients: [
      { name: "蛋", quantity: "2個" },
      { name: "薏米", quantity: "40g" },
      { name: "紅豆", quantity: "30g" },
      { name: "清湯", quantity: "700ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "薏米和紅豆提前浸泡",
      "蛋打散",
      "清湯煮沸",
      "加入薏米、紅豆，煮20分鐘後倒入蛋液",
      "調味即可"
    ],
    fatLossTips: [
      "薏米祛濕健脾",
      "紅豆補血益氣",
      "滋補養生湯"
    ]
  }
];

const soupVegetarian: RecipeData[] = [
  {
    id: "soup_v1",
    name: "豆腐蔬菜湯",
    protein_type: "vegetarian",
    category: "soup",
    kcal: 130,
    protein: 18,
    fat: 3,
    carbs: 8,
    totalWeight: 440,
    ingredients: [
      { name: "豆腐", quantity: "150g" },
      { name: "冬瓜", quantity: "120g" },
      { name: "紅蘿蔔", quantity: "70g" },
      { name: "清湯", quantity: "600ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "豆腐切塊",
      "清湯煮沸",
      "加入豆腐和蔬菜",
      "中火煮15分鐘",
      "調味即可"
    ],
    fatLossTips: [
      "豆腐植物蛋白",
      "蔬菜纖維豐富",
      "清淡營養湯"
    ]
  },
  {
    id: "soup_v2",
    name: "豆腐冬瓜薏米湯",
    protein_type: "vegetarian",
    category: "soup",
    kcal: 120,
    protein: 17,
    fat: 2,
    carbs: 11,
    totalWeight: 500,
    ingredients: [
      { name: "豆腐", quantity: "140g" },
      { name: "冬瓜", quantity: "180g" },
      { name: "薏米", quantity: "30g" },
      { name: "清湯", quantity: "700ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "薏米提前浸泡",
      "豆腐切塊",
      "清湯煮沸",
      "加入豆腐、冬瓜、薏米",
      "煮20分鐘調味"
    ],
    fatLossTips: [
      "冬瓜利尿消腫",
      "薏米祛濕健脾",
      "低脂清爽湯"
    ]
  },
  {
    id: "soup_v3",
    name: "豆腐玉米湯",
    protein_type: "vegetarian",
    category: "soup",
    kcal: 150,
    protein: 19,
    fat: 3,
    carbs: 13,
    totalWeight: 480,
    ingredients: [
      { name: "豆腐", quantity: "150g" },
      { name: "玉米", quantity: "120g" },
      { name: "紅蘿蔔", quantity: "80g" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "豆腐切塊",
      "清湯煮沸",
      "加入豆腐和玉米",
      "煮12分鐘",
      "加入紅蘿蔔再煮5分鐘"
    ],
    fatLossTips: [
      "玉米纖維豐富",
      "營養均衡搭配",
      "飽腹感強"
    ]
  },
  {
    id: "soup_v4",
    name: "豆腐香菇湯",
    protein_type: "vegetarian",
    category: "soup",
    kcal: 140,
    protein: 18,
    fat: 2,
    carbs: 5,
    totalWeight: 420,
    ingredients: [
      { name: "豆腐", quantity: "150g" },
      { name: "香菇", quantity: "120g" },
      { name: "薑", quantity: "2片" },
      { name: "清湯", quantity: "600ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "香菇切片",
      "豆腐切塊",
      "清湯煮沸",
      "加入豆腐、香菇、薑片",
      "煮16分鐘調味"
    ],
    fatLossTips: [
      "香菇免疫力強",
      "豆腐植物蛋白",
      "清淡易消化"
    ]
  },
  {
    id: "soup_v5",
    name: "豆腐番茄湯",
    protein_type: "vegetarian",
    category: "soup",
    kcal: 145,
    protein: 18,
    fat: 2,
    carbs: 10,
    totalWeight: 460,
    ingredients: [
      { name: "豆腐", quantity: "150g" },
      { name: "番茄", quantity: "150g" },
      { name: "洋蔥", quantity: "50g" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "番茄切塊",
      "豆腐切塊",
      "清湯煮沸",
      "加入豆腐、番茄、洋蔥",
      "煮18分鐘調味"
    ],
    fatLossTips: [
      "番茄抗氧化",
      "酸性促消化",
      "低脂營養湯"
    ]
  },
  {
    id: "soup_v6",
    name: "豆腐黑木耳湯",
    protein_type: "vegetarian",
    category: "soup",
    kcal: 125,
    protein: 17,
    fat: 2,
    carbs: 4,
    totalWeight: 440,
    ingredients: [
      { name: "豆腐", quantity: "140g" },
      { name: "黑木耳", quantity: "30g" },
      { name: "紅棗", quantity: "3個" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "黑木耳提前泡軟",
      "紅棗去核",
      "豆腐切塊",
      "清湯煮沸加入所有材料",
      "煮16分鐘調味"
    ],
    fatLossTips: [
      "黑木耳清血管",
      "紅棗補氣血",
      "滋補低脂"
    ]
  },
  {
    id: "soup_v7",
    name: "豆腐絲瓜湯",
    protein_type: "vegetarian",
    category: "soup",
    kcal: 115,
    protein: 16,
    fat: 2,
    carbs: 3,
    totalWeight: 420,
    ingredients: [
      { name: "豆腐", quantity: "140g" },
      { name: "絲瓜", quantity: "150g" },
      { name: "薑", quantity: "2片" },
      { name: "清湯", quantity: "600ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "絲瓜削皮切塊",
      "豆腐切塊",
      "清湯煮沸",
      "加入豆腐和薑片",
      "煮8分鐘加絲瓜再煮4分鐘"
    ],
    fatLossTips: [
      "絲瓜清熱利尿",
      "低卡高纖維",
      "清爽清淡"
    ]
  },
  {
    id: "soup_v8",
    name: "豆腐蘿蔔湯",
    protein_type: "vegetarian",
    category: "soup",
    kcal: 135,
    protein: 18,
    fat: 2,
    carbs: 7,
    totalWeight: 480,
    ingredients: [
      { name: "豆腐", quantity: "150g" },
      { name: "白蘿蔔", quantity: "150g" },
      { name: "薑", quantity: "3片" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "白蘿蔔切塊",
      "豆腐切塊",
      "清湯煮沸",
      "加入豆腐、蘿蔔、薑片",
      "煮18分鐘調味"
    ],
    fatLossTips: [
      "蘿蔔助消化",
      "清熱潤肺",
      "營養清湯"
    ]
  },
  {
    id: "soup_v9",
    name: "豆腐海帶湯",
    protein_type: "vegetarian",
    category: "soup",
    kcal: 130,
    protein: 19,
    fat: 2,
    carbs: 5,
    totalWeight: 450,
    ingredients: [
      { name: "豆腐", quantity: "150g" },
      { name: "海帶", quantity: "40g" },
      { name: "昆布", quantity: "5g" },
      { name: "清湯", quantity: "650ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "海帶提前泡軟切段",
      "豆腐切塊",
      "清湯煮沸",
      "加入豆腐、海帶、昆布",
      "煮18分鐘調味"
    ],
    fatLossTips: [
      "海帶含碘豐富",
      "豆腐植物蛋白",
      "低脂營養湯"
    ]
  },
  {
    id: "soup_v10",
    name: "豆腐薏米湯",
    protein_type: "vegetarian",
    category: "soup",
    kcal: 140,
    protein: 17,
    fat: 2,
    carbs: 11,
    totalWeight: 500,
    ingredients: [
      { name: "豆腐", quantity: "140g" },
      { name: "薏米", quantity: "40g" },
      { name: "紅豆", quantity: "30g" },
      { name: "清湯", quantity: "700ml" },
      { name: "鹽", quantity: "1茶匙" }
    ],
    steps: [
      "薏米和紅豆提前浸泡",
      "豆腐切塊",
      "清湯煮沸",
      "加入薏米、紅豆、豆腐",
      "煮21分鐘調味"
    ],
    fatLossTips: [
      "薏米祛濕健脾",
      "紅豆補血益氣",
      "滋補養生湯"
    ]
  }
];

// Create the main recipes object
export const recipes: Record<string, Record<string, RecipeData[]>> = {
  breakfast: {
    chicken: breakfastChicken,
    pork: breakfastPork,
    beef: breakfastBeef,
    seafood: breakfastSeafood,
    egg: breakfastEgg,
    vegetarian: breakfastVegetarian
  },
  lunch: {
    chicken: lunchChicken,
    pork: lunchPork,
    beef: lunchBeef,
    seafood: lunchSeafood,
    egg: lunchEgg,
    vegetarian: lunchVegetarian
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
    pork: saladPork,
    beef: saladBeef,
    seafood: saladSeafood,
    egg: saladEgg,
    vegetarian: saladVegetarian
  },
  snack: {
    chicken: snackChicken,
    pork: snackPork,
    beef: snackBeef,
    seafood: snackSeafood,
    egg: snackEgg,
    vegetarian: snackVegetarian
  },
  soup: {
    chicken: soupChicken,
    pork: soupPork,
    beef: soupBeef,
    seafood: soupSeafood,
    egg: soupEgg,
    vegetarian: soupVegetarian
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
