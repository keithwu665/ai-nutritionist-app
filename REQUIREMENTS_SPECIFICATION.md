# AI Nutritionist App - Comprehensive Requirement Specification

**Project Name:** AI 營養師 (AI Nutritionist)  
**Version:** 1.0  
**Last Updated:** March 11, 2026  
**Status:** In Development

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Application Sitemap](#application-sitemap)
3. [Core Features Overview](#core-features-overview)
4. [Detailed Feature Specifications](#detailed-feature-specifications)
5. [UI/UX Design](#uiux-design)
6. [Technical Architecture](#technical-architecture)
7. [Data Models](#data-models)
8. [Integration Points](#integration-points)

---

## Executive Summary

The AI Nutritionist App is a comprehensive health and nutrition tracking application designed to help users monitor their daily food intake, exercise activities, and nutrition goals. The app leverages AI-powered food recognition, automatic nutrition calculation, and personalized recommendations to provide an intuitive and engaging user experience.

**Key Capabilities:**
- 📊 Real-time nutrition tracking with automatic calorie and macro calculation
- 🍽️ AI-powered food recognition from photos
- 💪 Exercise logging with automatic calorie burn calculation
- 📈 Progress tracking with visual indicators and goal management
- 🎯 Personalized nutrition recommendations
- 📱 Cross-platform responsive design (mobile-first)

---

## Application Sitemap

```
AI 營養師 (Root)
│
├── 🏠 Home / Dashboard (首頁)
│   ├── Daily Summary Widget
│   ├── Nutrition Progress (Calories, Macros)
│   ├── Quick Add Buttons
│   └── Recent Activity
│
├── 🍽️ Food Log (飲食記錄)
│   ├── Calendar View
│   │   ├── Status Indicators (達標/超標/未記錄)
│   │   └── Date Selection
│   ├── Recent Records (最近記錄)
│   │   ├── Daily Summary Cards
│   │   ├── Progress Bars
│   │   └── Calorie Display
│   ├── Add Food Modal (+ 今日記錄)
│   │   ├── Manual Input Tab (手動輸入)
│   │   │   ├── Food Database Search
│   │   │   ├── Chinese/English Support
│   │   │   ├── Nutrition Auto-fill
│   │   │   └── Portion Grams Input
│   │   └── Photo Recognition Tab (影相)
│   │       ├── Image Upload
│   │       ├── AI Food Analysis
│   │       └── Auto Nutrition Fill
│   └── Fitasty Product Banner
│
├── 💪 Exercise Log (運動記錄)
│   ├── Weekly Summary Card
│   │   ├── 7-Day Stats
│   │   └── Bar Chart
│   ├── Toggle Tabs
│   │   ├── Exercise Records (運動記錄)
│   │   └── AI Suggestions (AI 建議)
│   ├── Exercise Cards
│   │   ├── Exercise Icon
│   │   ├── Name & Intensity Badge
│   │   ├── Duration & Heart Rate
│   │   └── Calorie Burn
│   └── Add Exercise Modal (+ 新增運動)
│
├── 📊 Body Metrics (身體)
│   ├── Current Measurements
│   ├── Historical Trends
│   ├── BMI Calculator
│   └── Photo Progress
│
├── ⚙️ Settings (設定)
│   ├── Profile Summary Card
│   │   ├── User Avatar
│   │   ├── Name & Email
│   │   └── Health Goals
│   ├── Statistics Cards
│   │   ├── Consecutive Days
│   │   ├── Daily Calorie Goal
│   │   └── Protein Goal
│   ├── Personal Information (個人資料)
│   │   ├── Edit Profile
│   │   ├── Goal Settings
│   │   └── InBody/Boditrax Integration
│   ├── Notifications (通知設定)
│   │   ├── Daily Reminder Toggle
│   │   └── Meal Time Reminder Toggle
│   ├── Privacy & Security (私隱與安全)
│   │   ├── Sharing Permissions
│   │   └── Data Export
│   ├── Support (支援)
│   │   ├── FAQ
│   │   └── Rate Fitasty
│   ├── Dangerous Operations (危險操作)
│   │   ├── Logout
│   │   └── Delete Account
│   └── Fitasty Footer

```

---

## Core Features Overview

### 1. **Food Logging System** 🍽️

**Purpose:** Enable users to track daily food intake with automatic nutrition calculation.

**Key Components:**
- Multi-source food database (USDA, Fitasty)
- Dual-language search (English + Chinese)
- AI-powered photo recognition
- Automatic nutrition calculation
- Portion-based macro scaling

**User Flow:**
1. User clicks "+ 今日記錄" button
2. Choose between manual input or photo recognition
3. Search food database or upload photo
4. System auto-fills nutrition data
5. Adjust portion grams (system recalculates macros)
6. Save entry to daily log
7. Daily totals update automatically

---

### 2. **Exercise Tracking System** 💪

**Purpose:** Allow users to log exercises and automatically calculate calorie burn.

**Key Components:**
- Exercise database with common activities
- Intensity levels (light, moderate, vigorous)
- Duration and heart rate tracking
- Automatic calorie burn calculation
- Weekly summary with trends

**User Flow:**
1. User clicks "+ 新增運動" button
2. Select exercise type from database
3. Input duration and intensity
4. Optional: Enter heart rate data
5. System calculates calorie burn
6. Save entry to exercise log
7. Weekly summary updates automatically

---

### 3. **Nutrition Goal Management** 🎯

**Purpose:** Help users set and track personalized nutrition targets.

**Key Components:**
- Daily calorie goal calculation (BMR × Activity Level)
- Macro target setting (Protein, Carbs, Fats)
- Goal achievement indicators
- Progress visualization

**Calculation Logic:**
- **BMR (Basal Metabolic Rate):** Mifflin-St Jeor formula
- **TDEE (Total Daily Energy Expenditure):** BMR × Activity Multiplier
- **Daily Goal:** TDEE (default 1642 kcal)
- **Macro Targets:** Customizable by user

---

### 4. **Progress Tracking & Visualization** 📈

**Purpose:** Provide users with clear visual feedback on their nutrition and exercise progress.

**Key Components:**

#### Calendar Status Indicators
- **達標 (Green):** Daily intake within 90-110% of goal
- **超標 (Red):** Daily intake exceeds 110% of goal
- **未記錄 (Grey):** No food logged for the day

#### Recent Records Cards
- Circular date badge (left)
- Date label with weekday
- Calorie amount (right, color-coded)
- Progress bar showing intake vs. goal
- Goal percentage display

#### Weekly Summary
- 7-day bar chart
- Average daily intake
- Consistency metrics
- Trend analysis

---

### 5. **AI-Powered Features** 🤖

**Purpose:** Leverage AI to enhance user experience and provide intelligent recommendations.

#### Photo Food Recognition
- **Technology:** Vision LLM (Claude Vision)
- **Input:** User-uploaded food photo
- **Output:** Detected foods with nutrition data
- **Accuracy:** Automatically fills kcal, protein, carbs, fats
- **User Control:** Can adjust portion grams for accuracy

#### AI Exercise Suggestions
- Personalized workout recommendations
- Based on user goals and activity history
- Intensity matching to user fitness level
- Integration with calendar

---

## Detailed Feature Specifications

### Feature 1: Food Log Page

**URL:** `/food`  
**Navigation:** 飲食 (Food icon in bottom nav)

#### Layout Structure

```
┌─────────────────────────────────────┐
│  飲食記錄         + 今日記錄         │  Header
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Calendar Grid (7×5)          │  │  Calendar Section
│  │  - Date cells with dots       │  │
│  │  - Status indicators          │  │
│  │  - Legend (達標/超標/未記錄)   │  │
│  └───────────────────────────────┘  │
│                                     │
│  最近記錄                            │  Recent Records Title
│  ┌───────────────────────────────┐  │
│  │ [28] 今日        1395 kcal  > │  │  Record Card 1
│  │      進度條 [████░░]          │  │
│  │      目標 1642 kcal · 85%     │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ [27] 02月27日    1451 kcal  > │  │  Record Card 2
│  │      進度條 [█████░]          │  │
│  │      目標 1642 kcal · 88%     │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Fitasty 產品庫 Banner        │  │  Fitasty Banner
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

#### Add Food Modal

```
┌─────────────────────────────────────┐
│  手動輸入 | 影相                      │  Tabs
├─────────────────────────────────────┤
│                                     │
│  搜尋食物                            │  Search Input
│  [搜尋框 (中文/English)]             │
│                                     │
│  ┌─ 搜尋結果 ─────────────────────┐  │
│  │ • 米飯 (Fitasty)              │  │  Search Results
│  │ • Rice (USDA)                 │  │
│  │ • 白米 (USDA)                 │  │
│  └─────────────────────────────────┘  │
│                                     │
│  份量 (克) [___________]            │  Portion Input
│                                     │
│  營養資訊                            │  Nutrition Display
│  熱量: 130 kcal                    │
│  蛋白質: 2.7g                      │
│  碳水: 28g                         │
│  脂肪: 0.3g                        │
│                                     │
│  [取消]  [保存]                     │  Action Buttons
│                                     │
└─────────────────────────────────────┘

Photo Tab:
┌─────────────────────────────────────┐
│  手動輸入 | 影相                      │  Tabs
├─────────────────────────────────────┤
│                                     │
│  [選擇圖片]                         │  File Upload
│                                     │
│  ┌─────────────────────────────────┐  │
│  │  [圖片預覽]                    │  │  Image Preview
│  │  (or upload icon)              │  │
│  └─────────────────────────────────┘  │
│                                     │
│  AI 分析結果                        │  AI Analysis
│  偵測到: 炒飯                       │
│  熱量: 450 kcal                    │
│  蛋白質: 12g                       │
│  碳水: 55g                         │
│  脂肪: 18g                         │
│                                     │
│  份量調整 (克) [___________]        │  Portion Adjustment
│                                     │
│  [取消]  [保存]                     │  Action Buttons
│                                     │
└─────────────────────────────────────┘
```

#### Key Functions

| Function | Description | Status |
|----------|-------------|--------|
| searchUnified | Search food database (USDA + Fitasty) | ✅ Implemented |
| addItem | Save food entry to daily log | ✅ Implemented |
| deleteItem | Remove food entry | ✅ Implemented |
| getItems | Fetch daily food log | ✅ Implemented |
| createUploadUrl | Generate Supabase upload URL for photo | ✅ Implemented |
| extractFromPhoto | AI analysis of food photo | ✅ Implemented |

---

### Feature 2: Exercise Log Page

**URL:** `/exercise`  
**Navigation:** 運動 (Exercise icon in bottom nav)

#### Layout Structure

```
┌─────────────────────────────────────┐
│  運動記錄         + 新增運動          │  Header
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Weekly Summary Card (Blue)   │  │  Weekly Summary
│  │  ┌─────────────────────────┐  │  │
│  │  │ 本週運動: 3次           │  │  │
│  │  │ 總卡路里: 1250 kcal     │  │  │
│  │  │ 平均時長: 45 分鐘       │  │  │
│  │  │ [Bar Chart: 7 days]     │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
│                                     │
│  [運動記錄] [AI 建議]               │  Toggle Tabs
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🏃 跑步                       │  │  Exercise Card 1
│  │ 中等強度 · 2026-03-10        │  │
│  │ 30 分鐘 · HR: 140 bpm        │  │
│  │ 🔥 285 kcal                  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🚴 騎自行車                   │  │  Exercise Card 2
│  │ 輕度強度 · 2026-03-09        │  │
│  │ 45 分鐘 · HR: 120 bpm        │  │
│  │ 🔥 320 kcal                  │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

#### Add Exercise Modal

```
┌─────────────────────────────────────┐
│  新增運動                            │  Title
├─────────────────────────────────────┤
│                                     │
│  運動類型                            │  Exercise Type
│  [下拉選單: 跑步/騎車/游泳...]      │
│                                     │
│  強度                               │  Intensity
│  [下拉選單: 輕度/中度/高度]         │
│                                     │
│  時長 (分鐘)                        │  Duration
│  [___________]                      │
│                                     │
│  心率 (可選)                        │  Heart Rate
│  [___________] bpm                  │
│                                     │
│  預計卡路里消耗                     │  Estimated Burn
│  🔥 285 kcal                        │
│                                     │
│  [取消]  [保存]                     │  Action Buttons
│                                     │
└─────────────────────────────────────┘
```

#### Key Functions

| Function | Description | Status |
|----------|-------------|--------|
| addExercise | Log new exercise entry | ✅ Implemented |
| deleteExercise | Remove exercise entry | ✅ Implemented |
| getExercises | Fetch weekly exercise log | ✅ Implemented |
| calculateCalorieBurn | Auto-calculate based on type/duration/intensity | ✅ Implemented |

---

### Feature 3: Settings Page

**URL:** `/settings`  
**Navigation:** 設定 (Settings icon in bottom nav)

#### Layout Structure

```
┌─────────────────────────────────────┐
│  設定                                │  Title
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │  [陳] 陳美怡                  │  │  Profile Card (Green)
│  │      amy.chan@example.com     │  │
│  │      減脂 · 中量活動量        │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐      │
│  │ 14   │  │1642  │  │ 109g │      │  Stats Cards
│  │連續  │  │每日  │  │蛋白  │      │
│  │記錄  │  │熱量  │  │質目  │      │
│  │天數  │  │目標  │  │標    │      │
│  └──────┘  └──────┘  └──────┘      │
│                                     │
│  個人資料                            │  Personal Info Section
│  ┌───────────────────────────────┐  │
│  │ 👤 編輯個人資料               │  │
│  │    姓名、性別、年齡、身高     │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🎯 目標設定                   │  │
│  │    目標：減脂、每日1642 kcal  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 📱 InBody / Boditrax 整合     │  │
│  │    CSV 匯入、API 接入         │  │
│  └───────────────────────────────┘  │
│                                     │
│  通知設定                            │  Notifications Section
│  ┌───────────────────────────────┐  │
│  │ 🔔 每日提醒                   │ ✓ │
│  │    每日記錄提醒               │   │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🔔 飲食提醒                   │ ✓ │
│  │    餐前 30 分鐘提醒           │   │
│  └───────────────────────────────┘  │
│                                     │
│  私隱與安全                          │  Privacy & Security
│  ┌───────────────────────────────┐  │
│  │ 🔐 分享權限管理               │  │
│  │    管理教練／朋友的查看權限   │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ ⬇️ 匯出我的資料               │  │
│  │    下載所有記錄 (CSV / JSON)  │  │
│  └───────────────────────────────┘  │
│                                     │
│  支援                                │  Support Section
│  ┌───────────────────────────────┐  │
│  │ ❓ 常見問題                   │  │
│  │    使用指南、FAQ              │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ ⭐ 評分 Fitasty              │  │
│  │    你的評分對我們很重要       │  │
│  └───────────────────────────────┘  │
│                                     │
│  危險操作                            │  Dangerous Operations
│  ┌───────────────────────────────┐  │
│  │ 🚪 登出帳戶                   │  │
│  │    返回登入頁面               │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🗑️ 刪除帳戶                   │  │
│  │    永久刪除所有資料(不可復原) │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ Ⓕ Fitasty                    │  │  Fitasty Footer
│  │ 版本 1.0.0 · © 2026 Fitasty  │  │
│  │ 私隱政策 · 使用條款 · 聯絡我們 │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

#### Key Functions

| Function | Description | Status |
|----------|-------------|--------|
| updateProfile | Edit user personal information | ✅ Implemented |
| updateGoals | Modify nutrition targets | ✅ Implemented |
| toggleNotifications | Enable/disable reminder notifications | ✅ Implemented |
| exportData | Download user records as CSV/JSON | ⏳ Planned |
| deleteAccount | Permanently delete user account | ✅ Implemented |
| logout | Sign out from app | ✅ Implemented |

---

## UI/UX Design

### Design System

#### Color Palette

| Color | Usage | Hex Code |
|-------|-------|----------|
| Primary Green | Buttons, badges, active states | #16A34A |
| Light Green | Backgrounds, hover states | #DCFCE7 |
| Success Green | Goal achieved indicator | #22C55E |
| Warning Red | Goal exceeded indicator | #EF4444 |
| Neutral Grey | Inactive states, borders | #E5E7EB |
| Dark Text | Primary text | #1F2937 |
| Light Text | Secondary text | #6B7280 |

#### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page Title | Inter | 28px | Bold (700) |
| Section Title | Inter | 20px | Semibold (600) |
| Card Title | Inter | 16px | Semibold (600) |
| Body Text | Inter | 14px | Regular (400) |
| Small Text | Inter | 12px | Regular (400) |
| Button Text | Inter | 14px | Semibold (600) |

#### Spacing System

- **xs:** 4px
- **sm:** 8px
- **md:** 16px
- **lg:** 24px
- **xl:** 32px
- **2xl:** 48px

#### Component Styles

**Buttons:**
- Primary: Green background, white text, rounded corners (8px)
- Secondary: White background, green border, green text
- Danger: Red background, white text

**Cards:**
- White background, rounded corners (12px), subtle shadow
- Padding: 16px
- Border: 1px light grey

**Input Fields:**
- White background, grey border (1px)
- Padding: 12px
- Rounded corners (8px)
- Focus: Green border (2px)

---

## Technical Architecture

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Tailwind CSS 4 |
| Backend | Express 4 + tRPC 11 |
| Database | MySQL/TiDB + Drizzle ORM |
| Authentication | Manus OAuth |
| File Storage | Supabase (S3-compatible) |
| AI/ML | Claude Vision API (food recognition) |
| Deployment | Manus Platform |

### API Endpoints

#### Food Logging

```
POST /api/trpc/foodLogs.searchUnified
  Input: { query: string, language: 'en' | 'zh' }
  Output: { foods: FoodItem[] }

POST /api/trpc/foodLogs.addItem
  Input: { date: Date, foodId: string, grams: number, kcal: number, protein: number, carbs: number, fat: number }
  Output: { success: boolean, entry: FoodLogEntry }

DELETE /api/trpc/foodLogs.deleteItem
  Input: { id: string }
  Output: { success: boolean }

GET /api/trpc/foodLogs.getItems
  Input: { date: Date }
  Output: { items: FoodLogEntry[], totalKcal: number, totalProtein: number, totalCarbs: number, totalFat: number }
```

#### Exercise Logging

```
POST /api/trpc/exercises.addExercise
  Input: { date: Date, type: string, duration: number, intensity: string, heartRate?: number }
  Output: { success: boolean, entry: ExerciseEntry, caloriesBurned: number }

DELETE /api/trpc/exercises.deleteExercise
  Input: { id: string }
  Output: { success: boolean }

GET /api/trpc/exercises.getExercises
  Input: { startDate: Date, endDate: Date }
  Output: { exercises: ExerciseEntry[], totalCalories: number }
```

#### Photo Analysis

```
POST /api/trpc/foodPhoto.createUploadUrl
  Input: { filename: string }
  Output: { uploadUrl: string, fileKey: string }

POST /api/trpc/foodPhoto.extractFromPhoto
  Input: { imageUrl: string }
  Output: { foods: { name: string, kcal: number, protein: number, carbs: number, fat: number }[] }
```

---

## Data Models

### User Profile

```typescript
interface UserProfile {
  id: string;
  email: string;
  name: string;
  gender: 'M' | 'F' | 'Other';
  age: number;
  height: number; // cm
  weight: number; // kg
  goal: 'lose_weight' | 'maintain' | 'gain_muscle';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'vigorous';
  dailyCalorieGoal: number;
  proteinGoal: number; // grams
  carbsGoal: number; // grams
  fatGoal: number; // grams
  createdAt: Date;
  updatedAt: Date;
}
```

### Food Log Entry

```typescript
interface FoodLogEntry {
  id: string;
  userId: string;
  date: Date;
  foodName: string;
  foodSource: 'usda' | 'fitasty' | 'custom';
  grams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Exercise Entry

```typescript
interface ExerciseEntry {
  id: string;
  userId: string;
  date: Date;
  exerciseType: string;
  duration: number; // minutes
  intensity: 'light' | 'moderate' | 'vigorous';
  heartRate?: number;
  caloriesBurned: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Daily Summary

```typescript
interface DailySummary {
  date: Date;
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  exerciseCalories: number;
  netCalories: number;
  goalStatus: 'under' | 'on_target' | 'over';
}
```

---

## Integration Points

### External APIs

#### USDA FoodData Central API
- **Purpose:** Access comprehensive food nutrition database
- **Endpoint:** https://fdc.nal.usda.gov/api/
- **Authentication:** API Key
- **Rate Limit:** 1000 requests/hour
- **Data:** Food items, nutrition facts, serving sizes

#### Fitasty Product Database
- **Purpose:** Local food products and recipes
- **Integration:** Direct database access
- **Data:** Chinese food items, restaurant meals, local products
- **Features:** One-click add to food log, product recommendations

#### Claude Vision API (Anthropic)
- **Purpose:** AI-powered food recognition from photos
- **Model:** claude-3-5-sonnet-20241022
- **Input:** Food photo (JPEG, PNG, WebP)
- **Output:** Detected foods with estimated nutrition
- **Accuracy:** ~85-90% for common foods

#### Supabase Storage
- **Purpose:** Store user-uploaded food photos
- **Type:** S3-compatible object storage
- **Bucket:** `food-photos`
- **Access:** Authenticated users only
- **Retention:** 90 days (configurable)

### Third-Party Integrations (Planned)

| Integration | Purpose | Status |
|-------------|---------|--------|
| InBody API | Body composition analysis import | 🔄 In Development |
| Boditrax API | Fitness tracker data sync | 🔄 In Development |
| Apple Health | iOS health data integration | ⏳ Planned |
| Google Fit | Android fitness data integration | ⏳ Planned |
| Strava | Exercise data sync | ⏳ Planned |

---

## Feature Status Summary

### Completed Features ✅

| Feature | Component | Status |
|---------|-----------|--------|
| User Authentication | Manus OAuth | ✅ Complete |
| Food Database Search | Multi-language search | ✅ Complete |
| Food Logging | Add/edit/delete entries | ✅ Complete |
| Nutrition Auto-fill | Based on food selection | ✅ Complete |
| Photo Food Recognition | AI-powered analysis | ✅ Complete |
| Exercise Logging | Add/edit/delete exercises | ✅ Complete |
| Calorie Burn Calculation | Based on type/duration/intensity | ✅ Complete |
| Calendar View | Status indicators | ✅ Complete |
| Recent Records Display | Cards with progress bars | ✅ Complete |
| Settings Page | Profile, goals, notifications | ✅ Complete |
| Goal Tracking | Daily progress visualization | ✅ Complete |

### In Development 🔄

| Feature | Component | ETA |
|---------|-----------|-----|
| InBody/Boditrax Integration | Photo import, data sync | Q2 2026 |
| Weekly Nutrition Summary | 7-day trends, consistency score | Q2 2026 |
| Meal Templates | Save and reuse meal combinations | Q2 2026 |
| AI Exercise Suggestions | Personalized workout recommendations | Q2 2026 |
| Data Export | CSV/JSON download | Q2 2026 |

### Planned Features ⏳

| Feature | Component | ETA |
|---------|-----------|-----|
| Social Sharing | Share progress with friends | Q3 2026 |
| Coach Integration | Share data with personal trainer | Q3 2026 |
| Wearable Sync | Apple Watch, Fitbit integration | Q3 2026 |
| Meal Planning | AI-generated meal plans | Q4 2026 |
| Recipe Database | Searchable recipe collection | Q4 2026 |
| Community Features | Forums, challenges, leaderboards | 2027 |

---

## Appendix: Screenshots

### Food Log Page
- Calendar with status indicators
- Recent records with progress bars
- Add Food modal (manual input tab)
- Add Food modal (photo recognition tab)

### Exercise Log Page
- Weekly summary card with bar chart
- Exercise records with intensity badges
- Add Exercise modal

### Settings Page
- Profile summary card
- Statistics cards
- Personal information section
- Notification settings
- Privacy & Security section
- Support section
- Dangerous operations section

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-11 | Manus AI | Initial specification |

---

**End of Document**
