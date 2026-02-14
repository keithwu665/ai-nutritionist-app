// ============================================================================
// Traditional Chinese (Hong Kong) Language Constants
// ============================================================================

export const i18n = {
  // Navigation
  nav: {
    dashboard: '儀錶板',
    body: '身體數據',
    food: '飲食記錄',
    exercise: '運動記錄',
    settings: '設定',
  },

  // Auth
  auth: {
    login: '登入',
    signup: '註冊',
    logout: '登出',
    email: '電郵',
    password: '密碼',
    confirmPassword: '確認密碼',
    forgotPassword: '忘記密碼？',
    dontHaveAccount: '沒有帳戶？',
    alreadyHaveAccount: '已有帳戶？',
    signupNow: '立即註冊',
    loginNow: '立即登入',
  },

  // Onboarding
  onboarding: {
    title: '個人資訊',
    subtitle: '請填寫您的基本資訊以開始',
    gender: '性別',
    male: '男',
    female: '女',
    age: '年齡',
    height: '身高 (cm)',
    weight: '體重 (kg)',
    fitnessGoal: '健身目標',
    lose: '減脂',
    maintain: '維持',
    gain: '增肌',
    activityLevel: '活動量',
    sedentary: '久坐',
    light: '輕量',
    moderate: '中量',
    high: '高量',
    next: '下一步',
    complete: '完成',
  },

  // Body Metrics
  body: {
    title: '身體數據',
    addMetric: '新增數據',
    weight: '體重',
    bodyFat: '體脂',
    muscleMass: '肌肉量',
    bmi: 'BMI',
    bmiStatus: 'BMI 狀態',
    underweight: '過輕',
    normal: '正常',
    overweight: '過重',
    obese: '肥胖',
    date: '日期',
    note: '備註',
    save: '保存',
    delete: '刪除',
    edit: '編輯',
    cancel: '取消',
    fatMass: '脂肪量',
    leanMass: '瘦體重',
    trend7Days: '7 天趨勢',
    trend30Days: '30 天趨勢',
    trend90Days: '90 天趨勢',
  },

  // Food Logging
  food: {
    title: '飲食記錄',
    addFood: '新增飲食',
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '小食',
    mealType: '餐次',
    foodName: '食物名稱',
    calories: '熱量 (kcal)',
    protein: '蛋白質 (g)',
    carbs: '碳水化合物 (g)',
    fat: '脂肪 (g)',
    total: '總計',
    copyYesterday: '複製昨日',
    date: '日期',
    save: '保存',
    delete: '刪除',
    edit: '編輯',
    cancel: '取消',
    dailyTotal: '每日總計',
  },

  // Exercise
  exercise: {
    title: '運動記錄',
    addExercise: '新增運動',
    type: '運動類型',
    duration: '時長 (分鐘)',
    caloriesBurned: '消耗熱量 (kcal)',
    intensity: '強度',
    low: '低',
    moderate: '中',
    high: '高',
    date: '日期',
    note: '備註',
    save: '保存',
    delete: '刪除',
    edit: '編輯',
    cancel: '取消',
    totalDuration: '總時長',
    totalCalories: '總消耗',
  },

  // Dashboard
  dashboard: {
    title: '儀錶板',
    today: '今日',
    thisWeek: '本週',
    intake: '攝取',
    burned: '消耗',
    net: '淨熱量',
    target: '目標',
    remaining: '剩餘',
    weeklyAverage: '週平均',
    exerciseTime: '運動時間',
    weightTrend: '體重趨勢',
    recommendations: '建議',
  },

  // Recommendations
  recommendations: {
    title: '健康建議',
    dietRecommendations: '飲食建議',
    exerciseRecommendations: '運動建議',
    dataBasis: '數據依據',
    actionSuggestion: '行動建議',
    highCalorieIntake: '近 3 日平均熱量超標',
    lowProteinIntake: '蛋白質攝取不足',
    highDinnerCalories: '晚餐熱量過高',
    insufficientExercise: '近 7 日運動不足 3 天',
    highCalorieButLowExercise: '熱量偏高但運動少',
  },

  // Settings
  settings: {
    title: '設定',
    profile: '個人資訊',
    logout: '登出',
    confirmLogout: '確定要登出嗎？',
    yes: '是',
    no: '否',
  },

  // Common
  common: {
    loading: '載入中...',
    error: '出錯',
    success: '成功',
    warning: '警告',
    info: '資訊',
    noData: '沒有數據',
    empty: '空',
    add: '新增',
    edit: '編輯',
    delete: '刪除',
    save: '保存',
    cancel: '取消',
    confirm: '確認',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    close: '關閉',
    search: '搜尋',
    filter: '篩選',
    sort: '排序',
    export: '匯出',
    import: '匯入',
    download: '下載',
    upload: '上傳',
  },

  // Error Messages
  errors: {
    required: '此欄位為必填',
    invalidEmail: '電郵格式無效',
    passwordTooShort: '密碼至少 6 個字符',
    passwordMismatch: '密碼不相符',
    loginFailed: '登入失敗',
    signupFailed: '註冊失敗',
    loadingFailed: '載入失敗',
    saveFailed: '保存失敗',
    deleteFailed: '刪除失敗',
    networkError: '網絡錯誤',
    unauthorized: '未授權',
    forbidden: '禁止訪問',
    notFound: '找不到',
  },

  // Success Messages
  success: {
    loginSuccess: '登入成功',
    signupSuccess: '註冊成功',
    saveSuccess: '保存成功',
    deleteSuccess: '刪除成功',
    updateSuccess: '更新成功',
  },
};

export default i18n;
