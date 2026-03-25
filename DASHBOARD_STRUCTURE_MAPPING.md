# Dashboard Structure Mapping - ENGINEERING LEVEL (CORRECTED)

## Complete Field-by-Field Mapping for Dashboard Redesign

### **CORE PRINCIPLE: UI Transformation Only**
- ✓ Redesign UI layout and styling
- ✓ Rebind existing data to new UI structure
- ✗ NO new logic
- ✗ NO new APIs
- ✗ NO data structure changes

---

## 1. HEADER SECTION

### Current Implementation
**Location:** Lines 114-140 (Dashboard.tsx)
**Current UI Position:** Top of page, fixed/sticky

### Data Fields
| Field | Current Source | Data Type | Example Value |
|-------|---|---|---|
| Date String | `getDateString()` function | string | "2026年03月25日 · 星期三" |
| Greeting Text | `getGreeting()` function | string | "午安，Updated Name！☀️" |
| User Display Name | `profile?.displayName` | string | "Updated Name" |
| Greeting Emoji | `getGreeting()` function | string | "☀️" (varies by time) |
| Hour (for greeting logic) | `new Date().getHours()` | number | 0-23 |
| Notification Badge Visible | `shouldShowNotification` (computed) | boolean | true/false |

### Interactions
| Element | Action | Function | Navigation |
|---------|--------|----------|-----------|
| Bell Icon | Click | Scroll to AI Recommendations | `aiRecommendationsRef.current?.scrollIntoView()` |
| Notification Badge | Visual | Pulses when `shouldShowNotification === true` | N/A |
| Profile Icon | Click | Navigate to settings | `setLocation('/settings')` |

### Redesign Scope
**Type:** UI-only redesign
**Data Binding:** ✓ Reuse all existing data and functions
**Logic Changes:** None
**API Changes:** None

**Target Design:** "GOOD MORNING" greeting area (top of reference image)
- Keep: Date display, greeting logic, notification logic, profile navigation
- Change: Visual styling, layout, typography

---

## 2. MOOD TRACKER SECTION

### Current Implementation
**Location:** Lines 145-180 (Dashboard.tsx)
**Current UI Position:** Below header, in main content area

### Data Fields
| Field | Current Source | Data Type | Example Value |
|-------|---|---|---|
| Mood Label | Hardcoded array | string | "今日心情" |
| Mood Options (5) | Hardcoded array | array | `[{id, emoji, label}]` |
| Today's Mood | `todayMood` state | string | "happy" / "neutral" / "sad" / "angry" / "tired" |
| Mood Record Button Label | Hardcoded | string | "心情紀錄" |

### State Management
```typescript
// Load from localStorage on mount (lines 28-32)
useEffect(() => {
  const today = new Date().toISOString().split('T')[0];
  const moods = JSON.parse(localStorage.getItem('userMoods') || '{}');
  setTodayMood(moods[today] || null);
}, []);

// Save to localStorage on selection (lines 41-47)
const handleMoodSelect = (mood: string) => {
  const today = new Date().toISOString().split('T')[0];
  const moods = JSON.parse(localStorage.getItem('userMoods') || '{}');
  moods[today] = mood;
  localStorage.setItem('userMoods', JSON.stringify(moods));
  setTodayMood(mood);
};
```

### Interactions
| Element | Action | Function | Effect |
|---------|--------|----------|--------|
| Mood Button (5x) | Click | `handleMoodSelect(mood.id)` | Saves to localStorage, updates `todayMood` state, triggers re-render of recommendations |
| "心情紀錄" Button | Click | `setLocation('/mood-log')` | Navigate to mood history page |
| Selected Mood Button | Visual | CSS class toggle | `todayMood === mood.id ? 'bg-primary/10 border border-primary' : 'bg-gray-50 border border-gray-200'` |

### Redesign Scope
**Type:** UI-only redesign
**Data Binding:** ✓ Reuse all existing data, state, and functions
**Logic Changes:** None
**API Changes:** None

**Target Design:** "TODAY MOOD" with emoji buttons (reference image)
- Keep: 5 mood options, localStorage persistence, mood selection logic, mood log navigation
- Keep: Recommendation triggering on mood change
- Change: Visual styling of buttons, layout, selection feedback animation

---

## 3. DAILY INTENTION SECTION

### Current Implementation
**Location:** NOT CURRENTLY IMPLEMENTED IN DASHBOARD
**Current Code:** No existing logic

### Data Fields
| Field | Current Source | Data Type | Example Value |
|-------|---|---|---|
| Quote Text | Static placeholder | string | "Nourishing the body is an act of gratitude for the soul's temporary home." |
| Quote Author | Static placeholder | string | "DAILY INTENTION" |

### Redesign Scope
**Type:** UI-only section (NEW)
**Data Binding:** Static placeholder text only
**Logic Changes:** None
**API Changes:** None
**Backend Integration:** None

**Target Design:** "DAILY INTENTION" quote box (reference image)
- Use: Static hardcoded inspirational quote
- Display: Centered text in soft background box
- Position: Below mood selector, above Daily Fuel

**Implementation:**
```typescript
// Simple hardcoded quote - NO API
const dailyQuote = "Nourishing the body is an act of gratitude for the soul's temporary home.";
const quoteAuthor = "DAILY INTENTION";
```

---

## 4. DAILY FUEL SECTION (Calorie Card)

### Current Implementation
**Location:** Lines 182-245 (Dashboard.tsx)
**Current UI Position:** Below mood section, full width
**Current Style:** Emerald green gradient background

### Data Fields
| Field | Current Source | Data Type | Example Value |
|-------|---|---|---|
| Section Label | Hardcoded | string | "今日熱量" |
| Today's Calories | `dashData?.today.calories` | number | 0 |
| Daily Target | Calculated from profile | number | 1978 |
| Net Calories | `todayCalories - todayExercise` | number | 0 |
| Exercise Calories | `dashData?.today.exerciseCalories` | number | 0 |
| Remaining Calories | `Math.max(0, target - todayCalories)` | number | 1978 |
| Calorie Percentage | `(todayCalories / target) * 100` | number | 0-100 |
| Protein (g) | Hardcoded placeholder | number | 126 |
| Fat (g) | Hardcoded placeholder | number | 43 |
| Carbs (g) | Hardcoded placeholder | number | 113 |

### Data Sources
```typescript
// Profile-based calculations (lines 62-70)
const bmr = calculateBMR(profile.gender, profile.weightKg, profile.heightCm, profile.age);
const tdee = calculateTDEE(bmr, profile.activityLevel);
const calorieCalc = calculateDailyCalorieTarget(tdee, profile.fitnessGoal, goalKg, goalDays, profile.gender, profile.calorieMode);
let target = Number(calorieCalc?.originalCalories) || 2000;

// Today's data (lines 72-76)
const todayCalories = dashData?.today.calories ?? 0;
const todayExercise = dashData?.today.exerciseCalories ?? 0;
const netCalories = todayCalories - todayExercise;
const caloriePercent = target > 0 ? Math.round((todayCalories / target) * 100) : 0;
const remaining = Math.max(0, target - todayCalories);

// Macros (lines 79-82) - KEEP AS-IS (hardcoded)
const protein = 126;
const fat = 43;
const carbs = 113;
```

### Interactions
| Element | Action | Function | Effect |
|---------|--------|----------|--------|
| Progress Bar | Display | Dynamic width based on `caloriePercent` | Visual feedback on calorie intake |
| Macro Circles | Display | Shows macro distribution | Visual representation |

### Redesign Scope
**Type:** UI redesign + existing data binding
**Data Binding:** ✓ Reuse ALL existing calculations and data
**Logic Changes:** None
**API Changes:** None

**Target Design:** "Daily Fuel" with circular progress (reference image)
- Keep: All calorie calculations, target calculation, net calories calculation
- Keep: Macro values (protein, fat, carbs)
- Change: Visual layout from 2-column text to circular progress indicator
- Change: Styling and typography

**Data Mapping:**
- Current: `todayCalories` / `target` → Target: Display as "X / Y kcal" in circular progress format
- Current: `caloriePercent` → Target: Display as circular progress (84%)
- Current: Protein, Fat, Carbs → Target: Same values, different layout (see Macro Breakdown)

---

## 5. MACRO BREAKDOWN SECTION

### Current Implementation
**Location:** Lines 210-244 (within Daily Fuel card)
**Current UI Position:** Bottom of hero calorie card

### Data Fields
| Field | Current Source | Data Type | Example Value |
|-------|---|---|---|
| Protein (g) | Hardcoded | number | 126 |
| Fat (g) | Hardcoded | number | 43 |
| Carbs (g) | Hardcoded | number | 113 |
| Total Macros | Computed | number | 282 |
| Protein Label | Hardcoded | string | "蛋白質" |
| Fat Label | Hardcoded | string | "脂肪" |
| Carbs Label | Hardcoded | string | "碳水" |

### Rendering Logic
```typescript
// Current: 3 circular indicators in a grid
// Keep: Same data values
// Change: Layout to horizontal bars
```

### Redesign Scope
**Type:** UI redesign + existing data binding
**Data Binding:** ✓ Reuse ALL existing macro values and calculations
**Logic Changes:** None
**API Changes:** None

**Target Design:** Macro breakdown with horizontal bars (reference image)
- Keep: Protein (125g), Carbs (210g), Fats (62g) values
- Keep: Same 3 macros, same labels
- Change: Layout from circular indicators to horizontal progress bars
- Change: Styling and visual representation

**Data Mapping:**
- Current: Protein, Fat, Carbs values → Target: Same values, horizontal bar layout
- Current: 3 circular indicators → Target: 3 horizontal bars with labels and values

---

## 6. BODY BALANCE SECTION (Body Metrics)

### Current Implementation
**Location:** Lines 247-279 (Dashboard.tsx)
**Current UI Position:** Below hero calorie card, 3-column grid

### Data Fields
| Field | Current Source | Data Type | Example Value |
|-------|---|---|---|
| Weight (kg) | `profile.weightKg` | number | 85.0 |
| Body Fat % | `bodyMetrics?.bodyFatPercent` | number | 15.0 |
| BMI | Calculated | number | 29.4 |
| Weight Change | Hardcoded | string | "-0.2 kg" |
| Body Fat Status | Hardcoded | string | "↓ 正在減少" |
| BMI Status | Hardcoded | string | "正常" |

### Calculations
```typescript
// BMI calculation (line 274)
BMI = weightKg / ((heightCm / 100) ** 2)

// Body Fat from API
bodyMetrics?.bodyFatPercent
```

### Redesign Scope
**Type:** UI redesign + existing data binding
**Data Binding:** ✓ Reuse ALL existing weight, body fat, BMI data and calculations
**Logic Changes:** None
**API Changes:** None

**Target Design:** "BODY BALANCE" metrics (reference image)
- Keep: Weight, Body Fat %, BMI values and calculations
- Keep: All existing data sources
- Change: Visual layout and styling
- Change: Display format (3 separate cards → inline metrics or different layout)

**Data Mapping:**
- Current: Weight, Body Fat %, BMI → Target: Same 3 metrics, redesigned layout
- Current: Trend indicators → Target: Keep same indicators, redesign styling

---

## 7. TARGET PROGRESS SECTION

### Current Implementation
**Location:** Lines 281-310 (Dashboard.tsx)
**Current UI Position:** Below body metrics cards

### Data Fields
| Field | Current Source | Data Type | Example Value |
|-------|---|---|---|
| Section Label | Hardcoded | string | "目標進度" |
| Starting Weight | `profile.weightKg` | number | 85.0 |
| Goal Weight | `profile.goalKg` | number | 81.4 |
| Progress Percentage | Hardcoded | number | 35 |
| Remaining Weight | Hardcoded | number | 3.6 |
| Days Remaining | Hardcoded | number | 92 |
| "more" Button | Hardcoded | string | "more" |

### Redesign Scope
**Type:** UI redesign + existing data binding
**Data Binding:** ✓ Reuse ALL existing values and calculations
**Logic Changes:** None (keep hardcoded values as-is)
**API Changes:** None

**Target Design:** "Target Progress" (reference image)
- Keep: All existing data, calculations, and hardcoded values
- Keep: Progress bar logic
- Keep: "more" button (no function change)
- Change: Visual layout and styling only

**Data Mapping:**
- Current: Starting weight, goal weight, progress %, remaining, days → Target: Same data, redesigned layout
- Current: Hardcoded values → Target: Keep hardcoded values, no calculation changes

---

## 8. AI ADVICE SECTION

### Current Implementation
**Location:** Lines 312-353 (Dashboard.tsx)
**Current UI Position:** Below target progress card

### Data Fields
| Field | Current Source | Data Type | Example Value |
|-------|---|---|---|
| Section Label | Hardcoded | string | "AI 建議" |
| Diet Recommendation | `recs.diet?.[0]?.message` | string | "增加蛋白質攝入，保持營養均衡。" |
| Exercise Recommendation | `recs.exercise?.[0]?.message` | string | "今日運動量不足，建議進行 30 分鐘的中等強度運動。" |
| Diet Icon | Hardcoded | string | "🍽️" |
| Exercise Icon | Hardcoded | string | "💪" |
| "查看全部" Button | Hardcoded | string | "查看全部" |

### Data Source
```typescript
// Recommendations fetched based on mood (line 19)
const { data: recs, isLoading: recsLoading } = 
  trpc.recommendations.get.useQuery({ mood: todayMood || undefined });

// Conditional rendering (line 313)
{recs && (
  // Render recommendations section
)}
```

### Interactions
| Element | Action | Function | Effect |
|---------|--------|----------|--------|
| "查看全部" Button | Click | `setLocation('/ai-recommendations')` | Navigate to full recommendations page |
| Section Container | Scroll Target | Referenced by bell icon | `aiRecommendationsRef` |

### Redesign Scope
**Type:** UI redesign + existing data binding
**Data Binding:** ✓ Reuse ALL existing recommendation logic and data
**Logic Changes:** None
**API Changes:** None

**Target Design:** "AI Advice" (reference image)
- Keep: All recommendation fetching logic (mood-based)
- Keep: Diet and exercise recommendation messages
- Keep: Icons and navigation
- Change: Visual layout and styling only

**Data Mapping:**
- Current: `recs.diet?.[0]?.message` → Target: Same data, redesigned card layout
- Current: `recs.exercise?.[0]?.message` → Target: Same data, redesigned card layout
- Current: Icons (🍽️, 💪) → Target: Same icons, redesigned styling

---

## 9. TODAY ACTIVITY SECTION

### Current Implementation
**Location:** Lines 355-402 (Dashboard.tsx)
**Current UI Position:** Below AI recommendations

### Data Fields
| Field | Current Source | Data Type | Example Value |
|-------|---|---|---|
| Section Label | Hardcoded | string | "今日運動" |
| Exercise List | `dashData?.today.exercises` | array | `[{name, duration, calories}]` |
| Exercise Name | `exercise.name` | string | "Daily Walk" |
| Exercise Duration | `exercise.duration` | number | 30 |
| Exercise Calories | `exercise.calories` | number | 150 |
| Exercise Icon | `getExerciseDisplay(exercise.name)` | string | "🚶" |
| Exercise Label | `getExerciseDisplay(exercise.name)` | string | "Daily Walk" |
| "查看詳情" Button | Hardcoded | string | "查看詳情" |
| "+ 新增運動" Button | Hardcoded | string | "+ 新增運動" |
| Empty State Message | Hardcoded | string | "今日暫無運動記錄" |

### Data Source
```typescript
// Exercises from dashboard data (line 18)
const { data: dashData } = trpc.dashboard.getData.useQuery();

// Exercise display formatting (line 9)
import { getExerciseDisplay } from '@/lib/exerciseMapping';

// Conditional rendering (line 367)
{dashData?.today.exercises && dashData.today.exercises.length > 0 ? 
  (render list) : 
  (render empty state)}
```

### Interactions
| Element | Action | Function | Effect |
|---------|--------|----------|--------|
| "查看詳情" Button | Click | `setLocation('/exercise')` | Navigate to exercise page |
| "+ 新增運動" Button | Click | `setLocation('/exercise')` | Navigate to exercise page |
| Exercise List | Display | Maps over exercises array | Shows all exercises for today |

### Redesign Scope
**Type:** UI redesign + existing data binding
**Data Binding:** ✓ Reuse ALL existing exercise data and logic
**Logic Changes:** None
**API Changes:** None
**Data Structure:** Keep exercise-only (NO mixed data with food, hydration, sleep)

**Target Design:** "Today Activity" (reference image)
- Keep: Exercise list data and logic
- Keep: Exercise display formatting via `getExerciseDisplay()`
- Keep: Navigation buttons and empty state
- Change: Visual layout and styling only
- Change: NO addition of other activity types (food, hydration, sleep)

**Data Mapping:**
- Current: Exercise list from `dashData?.today.exercises` → Target: Same data, redesigned layout
- Current: Exercise name, duration, calories → Target: Same fields, redesigned display format

---

## 10. HYDRATION SECTION

### Current Implementation
**Location:** NOT CURRENTLY IMPLEMENTED IN DASHBOARD
**Current Code:** No existing logic

### Data Fields
| Field | Current Source | Data Type | Example Value |
|-------|---|---|---|
| Section Label | Static placeholder | string | "Hydration Pulse" |
| Hydration Amount | Static placeholder | number | 1.8 |
| Hydration Unit | Static placeholder | string | "L" |
| Hydration Target | Static placeholder | number | 2.5 |
| Hydration Percentage | Static placeholder | number | 72 |

### Redesign Scope
**Type:** UI-only section (NEW - placeholder only)
**Data Binding:** Static placeholder values only
**Logic Changes:** None
**API Changes:** None
**Backend Integration:** None

**Target Design:** "Hydration Pulse" (reference image)
- Use: Static placeholder UI with hardcoded values
- Display: "1.8L of 2.5L goal" with progress indicator
- Position: In Today Activity section or separate

**Implementation:**
```typescript
// Simple static placeholder - NO API, NO backend logic
const hydrationAmount = 1.8;
const hydrationTarget = 2.5;
const hydrationPercent = (hydrationAmount / hydrationTarget) * 100;
```

---

## 11. SLEEP SECTION

### Current Implementation
**Location:** NOT CURRENTLY IMPLEMENTED IN DASHBOARD
**Current Code:** No existing logic

### Data Fields
| Field | Current Source | Data Type | Example Value |
|-------|---|---|---|
| Section Label | Static placeholder | string | "Sleep" |
| Sleep Duration | Static placeholder | string | "7h 50m" |
| Sleep Quality | Static placeholder | string | "Good" |

### Redesign Scope
**Type:** UI-only section (NEW - placeholder only)
**Data Binding:** Static placeholder values only
**Logic Changes:** None
**API Changes:** None
**Backend Integration:** None

**Target Design:** "Sleep" (reference image)
- Use: Static placeholder UI with hardcoded values
- Display: "7h 50m" with quality indicator
- Position: In Today Activity section or separate

**Implementation:**
```typescript
// Simple static placeholder - NO API, NO backend logic
const sleepDuration = "7h 50m";
const sleepQuality = "Good";
```

---

## 12. BOTTOM NAVIGATION

### Current Implementation
**Location:** NOT IN DASHBOARD (Likely in DashboardLayout or App.tsx)
**Current Code:** Navigation is in sidebar/layout component

### Redesign Scope
**Type:** Layout component (Keep as-is)
**Data Binding:** No changes
**Logic Changes:** None
**API Changes:** None

**Target Design:** Bottom navigation bar (reference image)
- Keep: All existing navigation logic
- Keep: All existing routes and functionality
- Change: Visual styling only if needed

---

## SUMMARY TABLE: Current vs Target (CORRECTED)

| Section | Current Status | Target Status | Data Reuse | Logic Reuse | UI-Only |
|---------|---|---|---|---|---|
| Header | ✓ Implemented | ✓ Redesign | ✓ All | ✓ All | Yes |
| Mood Tracker | ✓ Implemented | ✓ Redesign | ✓ All | ✓ All | Yes |
| Daily Intention | ✗ Not implemented | ✓ New | Static | None | Yes |
| Daily Fuel | ✓ Implemented | ✓ Redesign | ✓ All | ✓ All | Yes |
| Macro Breakdown | ✓ Implemented | ✓ Redesign | ✓ All | ✓ All | Yes |
| Body Balance | ✓ Implemented | ✓ Redesign | ✓ All | ✓ All | Yes |
| Target Progress | ✓ Implemented | ✓ Redesign | ✓ All | ✓ All | Yes |
| AI Advice | ✓ Implemented | ✓ Redesign | ✓ All | ✓ All | Yes |
| Today Activity | ✓ Implemented | ✓ Redesign | ✓ All | ✓ All | Yes |
| Hydration | ✗ Not implemented | ✓ New | Static | None | Yes |
| Sleep | ✗ Not implemented | ✓ New | Static | None | Yes |
| Bottom Nav | ✓ Implemented | ✓ Keep | ✓ All | ✓ All | No |

---

## CORE PRINCIPLES CONFIRMED

✓ **UI Transformation Only** - All existing logic and data binding preserved
✓ **No New APIs** - All sections use existing data sources
✓ **No Data Structure Changes** - All data fields remain unchanged
✓ **No Logic Changes** - All calculations and functions remain unchanged
✓ **Exercise-Only Activity** - No mixed data (food, hydration, sleep) in Today Activity
✓ **Placeholder Sections** - Hydration, Sleep, Daily Intention use static UI only

---

## READY FOR FINAL APPROVAL

This corrected engineering-level mapping is complete and ready for your final approval.

**All corrections applied:**
1. ✓ Daily Fuel, Macro Breakdown, Body Balance, AI Advice marked as "UI redesign + existing data binding"
2. ✓ Target Progress keeps existing calculation logic and hardcoded values
3. ✓ Today Activity keeps exercise-only data (no mixed activities)
4. ✓ Hydration & Sleep are UI-only placeholders (no API)
5. ✓ Daily Intention is UI-only placeholder (no API)

**Ready to proceed to UI implementation upon your approval.**
