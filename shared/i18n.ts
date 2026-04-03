// ============================================================================
// Multi-language Translation System (Chinese & English)
// ============================================================================

export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    // Navigation
    nav: {
      home: '主頁',
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
      title: '主頁',
      today: '今日',
      thisWeek: '本週',
      intake: '攝取',
      burned: '消費',
      net: '淨熱量',
      target: '目標',
      remaining: '剩餘',
      weeklyAverage: '週平均',
      exerciseTime: '運動時間',
      weightTrend: '體重趨勢',
      recommendations: '建議',
      greetingMorning: '早上好',
      greetingAfternoon: '午安',
      greetingEvening: '晩上好',
    },

    // Mood
    mood: {
      title: '心情紀錄',
      todayMood: '今日心情',
      moodRecord: '心情紀錄',
      happy: '開心',
      neutral: '普通',
      sad: '低落',
      angry: '煙躁',
      tired: '疲倦',
      noMoodSelected: '還未選擇今日心情，選擇心情以獲得個人化建議。',
      moodGood: '今日心情不錄，保持這份積極的心態。',
      moodNeutral: '今日心情平穩，保持日常節奏。',
      moodSad: '今日心情較低落，給自己一些溫柔和耐心。',
      moodAngry: '今日心情有些煙躁，試試放慢腳步。',
      moodTired: '今日感到疲倦，適當休息很重要。',
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
      language: '語言',
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
  },

  en: {
    // Navigation
    nav: {
      home: 'Home',
      body: 'Body Metrics',
      food: 'Food Log',
      exercise: 'Exercise',
      settings: 'Settings',
    },

    // Auth
    auth: {
      login: 'Sign In',
      signup: 'Sign Up',
      logout: 'Sign Out',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
      signupNow: 'Sign Up Now',
      loginNow: 'Sign In Now',
    },

    // Onboarding
    onboarding: {
      title: 'Personal Information',
      subtitle: 'Please fill in your basic information to get started',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      age: 'Age',
      height: 'Height (cm)',
      weight: 'Weight (kg)',
      fitnessGoal: 'Fitness Goal',
      lose: 'Lose Weight',
      maintain: 'Maintain',
      gain: 'Gain Muscle',
      activityLevel: 'Activity Level',
      sedentary: 'Sedentary',
      light: 'Light',
      moderate: 'Moderate',
      high: 'High',
      next: 'Next',
      complete: 'Complete',
    },

    // Body Metrics
    body: {
      title: 'Body Metrics',
      addMetric: 'Add Metric',
      weight: 'Weight',
      bodyFat: 'Body Fat',
      muscleMass: 'Muscle Mass',
      bmi: 'BMI',
      bmiStatus: 'BMI Status',
      underweight: 'Underweight',
      normal: 'Normal',
      overweight: 'Overweight',
      obese: 'Obese',
      date: 'Date',
      note: 'Note',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      cancel: 'Cancel',
      fatMass: 'Fat Mass',
      leanMass: 'Lean Mass',
      trend7Days: '7-Day Trend',
      trend30Days: '30-Day Trend',
      trend90Days: '90-Day Trend',
    },

    // Food Logging
    food: {
      title: 'Food Log',
      addFood: 'Add Food',
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      snack: 'Snack',
      mealType: 'Meal Type',
      foodName: 'Food Name',
      calories: 'Calories (kcal)',
      protein: 'Protein (g)',
      carbs: 'Carbs (g)',
      fat: 'Fat (g)',
      total: 'Total',
      copyYesterday: 'Copy Yesterday',
      date: 'Date',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      cancel: 'Cancel',
      dailyTotal: 'Daily Total',
    },

    // Exercise
    exercise: {
      title: 'Exercise Log',
      addExercise: 'Add Exercise',
      type: 'Exercise Type',
      duration: 'Duration (minutes)',
      caloriesBurned: 'Calories Burned (kcal)',
      intensity: 'Intensity',
      low: 'Low',
      moderate: 'Moderate',
      high: 'High',
      date: 'Date',
      note: 'Note',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      cancel: 'Cancel',
      totalDuration: 'Total Duration',
      totalCalories: 'Total Burned',
    },

    // Dashboard
    dashboard: {
      title: 'Home',
      today: 'Today',
      thisWeek: 'This Week',
      intake: 'Intake',
      burned: 'Burned',
      net: 'Net Calories',
      target: 'Target',
      remaining: 'Remaining',
      weeklyAverage: 'Weekly Average',
      exerciseTime: 'Exercise Time',
      weightTrend: 'Weight Trend',
      recommendations: 'Recommendations',
      greetingMorning: 'Good Morning',
      greetingAfternoon: 'Good Afternoon',
      greetingEvening: 'Good Evening',
    },

    // Mood
    mood: {
      title: 'Mood Log',
      todayMood: "Today's Mood",
      moodRecord: 'Mood Record',
      happy: 'Happy',
      neutral: 'Normal',
      sad: 'Sad',
      angry: 'Frustrated',
      tired: 'Tired',
      noMoodSelected: 'No mood selected today. Choose a mood to get personalized suggestions.',
      moodGood: 'Your mood is great today. Keep up this positive attitude.',
      moodNeutral: 'Your mood is stable today. Keep your daily rhythm.',
      moodSad: 'Your mood is a bit low today. Be gentle and patient with yourself.',
      moodAngry: 'Your mood is a bit frustrated today. Try slowing down.',
      moodTired: 'You feel tired today. Rest is important.',
    },

    // Recommendations
    recommendations: {
      title: 'Health Recommendations',
      dietRecommendations: 'Diet Recommendations',
      exerciseRecommendations: 'Exercise Recommendations',
      dataBasis: 'Data Basis',
      actionSuggestion: 'Action Suggestion',
      highCalorieIntake: 'High average calorie intake in last 3 days',
      lowProteinIntake: 'Low protein intake',
      highDinnerCalories: 'High dinner calories',
      insufficientExercise: 'Insufficient exercise in last 7 days',
      highCalorieButLowExercise: 'High calories but low exercise',
    },

    // Settings
    settings: {
      title: 'Settings',
      profile: 'Profile',
      logout: 'Sign Out',
      confirmLogout: 'Are you sure you want to sign out?',
      yes: 'Yes',
      no: 'No',
      language: 'Language',
    },

    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
      noData: 'No data',
      empty: 'Empty',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      export: 'Export',
      import: 'Import',
      download: 'Download',
      upload: 'Upload',
    },

    // Error Messages
    errors: {
      required: 'This field is required',
      invalidEmail: 'Invalid email format',
      passwordTooShort: 'Password must be at least 6 characters',
      passwordMismatch: 'Passwords do not match',
      loginFailed: 'Sign in failed',
      signupFailed: 'Sign up failed',
      loadingFailed: 'Loading failed',
      saveFailed: 'Save failed',
      deleteFailed: 'Delete failed',
      networkError: 'Network error',
      unauthorized: 'Unauthorized',
      forbidden: 'Forbidden',
      notFound: 'Not found',
    },

    // Success Messages
    success: {
      loginSuccess: 'Sign in successful',
      signupSuccess: 'Sign up successful',
      saveSuccess: 'Save successful',
      deleteSuccess: 'Delete successful',
      updateSuccess: 'Update successful',
    },
  },
};

// Helper function to get translation
export function t(key: string, lang: Language = 'zh'): string {
  const keys = key.split('.');
  let value: any = translations[lang];

  for (const k of keys) {
    value = value?.[k];
  }

  // Fallback to Chinese if translation not found
  if (!value && lang !== 'zh') {
    return t(key, 'zh');
  }

  return value || key;
}

// Legacy export for backward compatibility
export const i18n = translations.zh;

export default translations;
