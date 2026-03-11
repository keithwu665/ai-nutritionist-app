# AI Nutritionist & Fitness Web App - Sitemap

**Document Version:** 1.0  
**Last Updated:** March 6, 2026  
**Author:** Manus AI

---

## Visual Sitemap Hierarchy

![Sitemap Diagram](https://d2xsxph8kpxj0f.cloudfront.net/310419663029851344/btNuTCzqZzpzomYwWSYu4y/sitemap-diagram-EC6fazzAMxRuKVtUatuhhX.webp)

---

## Complete Route Structure

### Root Level Routes

#### 1. **Home (Public)**
- **Route:** `/`
- **Component:** `Home.tsx`
- **Access:** Public (no authentication required)
- **Description:** Landing page with app overview, features, and login CTA
- **Navigation:** Login button redirects to OAuth flow
- **Status:** ✅ Implemented

#### 2. **404 Error Page**
- **Route:** `/404` and catch-all
- **Component:** `NotFound.tsx`
- **Access:** Public
- **Description:** Error page for invalid routes
- **Navigation:** Home button to return to root
- **Status:** ✅ Implemented

---

### Protected Routes (Authentication Required)

All protected routes are wrapped in `AppLayout` component which provides:
- Sidebar navigation (desktop)
- Bottom tab navigation (mobile)
- User profile header
- Logout functionality

#### **3. Dashboard**
- **Route:** `/dashboard`
- **Component:** `Dashboard.tsx`
- **Access:** Protected (authenticated users only)
- **Description:** Main dashboard showing daily overview
- **Key Features:**
  - Daily calorie intake vs. target
  - Macro breakdown (protein, carbs, fat)
  - Net calories calculation
  - Weekly weight trend mini-chart
  - Exercise summary
  - AI recommendations (diet, exercise, encouragement)
- **Navigation:** Accessible from bottom tab or sidebar
- **Status:** ✅ Implemented

---

#### **4. Food Logging Module**
- **Base Route:** `/food`
- **Component:** `FoodLog.tsx`
- **Access:** Protected
- **Description:** Daily food tracking interface with calendar and recent records

##### 4.1 Food Log - Calendar View
- **Route:** `/food`
- **Features:**
  - Calendar grid (7×5) showing all dates in month
  - Status indicators (dots):
    - Green (達標): Daily intake 90-110% of goal
    - Red (超標): Daily intake >110% of goal
    - Grey (未記錄): No food logged
  - Legend row showing status meanings
  - Click date to view/edit that day's log

##### 4.2 Food Log - Recent Records
- **Route:** `/food` (same page, scrollable section)
- **Features:**
  - 7-day scrollable history
  - Each record card shows:
    - Circular date badge (left) with day number
    - Date label with weekday
    - Calorie amount (right, color-coded)
    - Progress bar showing intake vs. goal
    - Goal percentage display
    - Chevron (>) for detail view
  - "複製昨天" button to copy yesterday's meals
  - Fitasty Product Banner below records

##### 4.3 Add Food Modal
- **Trigger:** "+ 今日記錄" button in header
- **Type:** Modal overlay
- **Tabs:**
  - **Manual Input (手動輸入):**
    - Food database search (Chinese + English)
    - Search results dropdown with source badges (Fitasty/USDA)
    - Portion grams input
    - Nutrition auto-fill (kcal, protein, carbs, fat)
    - Real-time macro recalculation on portion change
    - Save button
  - **Photo Recognition (影相):**
    - File upload input
    - Image preview
    - AI food analysis (Vision LLM)
    - Auto-filled nutrition data
    - Portion grams adjustment
    - Save button

##### 4.4 Fitasty Product Banner
- **Location:** Below recent records
- **Features:**
  - Product images
  - Title (Fitasty 產品庫)
  - Description text
  - Link to Fitasty products

**Status:** ✅ Implemented

---

#### **4.5 Food Logging Functions**
- **searchUnified:** Search food database (USDA + Fitasty)
- **addItem:** Save food entry to daily log
- **deleteItem:** Remove food entry
- **getItems:** Fetch daily food log with totals
- **createUploadUrl:** Generate Supabase upload URL for photos
- **extractFromPhoto:** AI analysis of food photos using Vision LLM

---

#### **5. Body Metrics Module**
- **Base Route:** `/body`
- **Component:** `BodyMetrics.tsx`
- **Access:** Protected
- **Description:** Body composition tracking hub

##### 5.1 Body Metrics - Main View
- **Route:** `/body`
- **Features:**
  - BMI card with color-coded status
  - Weight trend chart (7/30/90 day toggle)
  - Body fat % trend chart
  - Muscle mass trend chart
  - Recent measurements list
  - Add measurement button
  - Import CSV button
  - Import from photo button

##### 5.2 Add Measurement
- **Route:** `/body/add`
- **Component:** `BodyMetricsAdd.tsx`
- **Features:**
  - Date picker
  - Weight input (kg)
  - Body fat % input (optional)
  - Muscle mass input (optional)
  - Notes field
  - Save button
- **Status:** ✅ Implemented

##### 5.3 CSV Import
- **Route:** `/body/import-csv`
- **Component:** `BodyMetricsImportCSV.tsx`
- **Features:**
  - CSV file upload
  - Column mapping interface
  - Data preview table
  - Duplicate handling (skip/overwrite)
  - Import button
  - Success/error messages
- **Status:** ✅ Implemented

##### 5.4 Progress Photos Gallery
- **Route:** `/body/photos`
- **Component:** `BodyPhotosGallery.tsx`
- **Features:**
  - Timeline gallery (date-sorted)
  - Photo cards with date, tags, description
  - Upload button
  - Compare button (select 2 photos)
  - AI goal generation button
  - Delete button
  - Before/After compare view
  - Auto compare (earliest vs latest)

##### 5.4.1 Upload Progress Photo Modal
- **Trigger:** "Upload" button in Progress Photos
- **Type:** Modal overlay
- **Features:**
  - File picker
  - Date selector
  - Tags input
  - Description textarea
  - Upload button

##### 5.4.2 AI Goal Photo Generation Modal
- **Trigger:** "AI Generation" button on photo card
- **Type:** Modal overlay
- **Features:**
  - Goal weight delta input
  - Preview of source photo
  - Generate button
  - Loading indicator with time estimate
  - Success/error messages

##### 5.5 Import from Photo
- **Route:** `/body/import/photo`
- **Component:** `BodyReportImport.tsx`
- **Features:**
  - Photo upload for InBody/Boditrax reports
  - Provider selection (InBody, Boditrax)
  - Template selection (global or user custom)
  - AI extraction of metrics
  - Confirm/edit extracted data
  - Save to body_metrics
- **Status:** 🔄 In Progress (Photo AI connectivity fix)

**Status:** ✅ Mostly Implemented (Photo AI pending)

---

#### **6. Exercise Logging**
- **Route:** `/exercise`
- **Component:** `ExerciseLog.tsx`
- **Access:** Protected
- **Description:** Physical activity tracking with weekly summary

##### 6.1 Weekly Summary Card
- **Location:** Top of page
- **Features:**
  - Dark blue gradient background
  - Title (本週運動)
  - Statistics:
    - Total sessions this week
    - Total calories burned
    - Average duration
  - Bar chart showing 7-day activity

##### 6.2 Toggle Tabs
- **Options:**
  - 運動記錄 (Exercise Records) - Active by default
  - AI 建議 (AI Suggestions) - Placeholder for future

##### 6.3 Exercise Records View
- **Features:**
  - Exercise cards in scrollable list
  - Each card displays:
    - Exercise icon (emoji)
    - Exercise name
    - Intensity badge (color-coded)
    - Date (YYYY-MM-DD)
    - Duration & heart rate (XX 分鐘 · HR: XXX bpm)
    - Calorie burn (🔥 XXX kcal)
    - Delete button (×)

##### 6.4 Add Exercise Modal
- **Trigger:** "+ 新增運動" button in header
- **Type:** Modal overlay
- **Features:**
  - Exercise type dropdown (running, cycling, swimming, gym, yoga, walking, custom)
  - Intensity selector (light, moderate, vigorous)
  - Duration input (minutes)
  - Heart rate input (optional)
  - Estimated calorie burn display (auto-calculated)
  - Save button

##### 6.5 Exercise Logging Functions
- **addExercise:** Log new exercise entry
- **deleteExercise:** Remove exercise entry
- **getExercises:** Fetch weekly exercise log
- **calculateCalorieBurn:** Auto-calculate based on type/duration/intensity/heart rate

**Status:** ✅ Implemented

---

#### **7. Settings**
- **Route:** `/settings`
- **Component:** `Settings.tsx`
- **Access:** Protected
- **Description:** User profile and preferences management

##### 7.1 Profile Summary Card (Green Gradient)
- **Features:**
  - User avatar with initials
  - User name display
  - Email address
  - Health goals display

##### 7.2 Statistics Cards
- **Features:**
  - Consecutive logging days
  - Daily calorie goal
  - Protein goal (grams)

##### 7.3 Personal Information Section
- **Features:**
  - Edit Profile (name, gender, age, height, weight)
  - Goal Settings (goal type, daily calorie, activity level)
  - InBody/Boditrax Integration (CSV import, API connection)

##### 7.4 Notification Settings
- **Features:**
  - Daily Reminder toggle (每日提醒)
  - Meal Time Reminder toggle (飲食提醒)
  - Reminder time customization

##### 7.5 Privacy & Security Section
- **Features:**
  - Sharing Permissions (manage coach/friend access)
  - Data Export (download CSV/JSON)

##### 7.6 Support Section
- **Features:**
  - FAQ (常見問題)
  - Rate Fitasty (評分 Fitasty)

##### 7.7 Dangerous Operations
- **Features:**
  - Logout button (登出帳戶)
  - Delete Account button (刪除帳戶)

##### 7.8 Fitasty Footer
- **Features:**
  - Fitasty branding
  - Version number
  - Copyright notice
  - Links to privacy policy, terms, contact

**Status:** ✅ Implemented

---

#### **8. Onboarding Flow**
- **Route:** `/onboarding`
- **Component:** `Onboarding.tsx`
- **Access:** Protected (redirected if no profile)
- **Description:** 4-step user profile setup

##### 8.1 Step 1: Gender Selection
- Male/Female buttons

##### 8.2 Step 2: Biometric Input
- Age input
- Height input (cm)
- Weight input (kg)

##### 8.3 Step 3: Fitness Goal
- Radio buttons: Lose weight, Maintain, Gain muscle

##### 8.4 Step 4: Activity Level
- Radio buttons: Sedentary, Light, Moderate, High
- Final summary with calculated TDEE
- Redirect to dashboard on completion

**Status:** ✅ Implemented

---

### Admin Routes (Email Allowlist Required)

#### **9. Admin Products Management**
- **Route:** `/admin/products`
- **Component:** `AdminProducts.tsx`
- **Access:** Protected + Admin email allowlist check
- **Description:** Fitasty product database management

##### 9.1 Product List
- **Features:**
  - Search bar with autocomplete
  - Category filter dropdown
  - Product table/list view
  - Columns: Name, Category, Serving Size, Calories, Protein, Carbs, Fat
  - Edit button per product
  - Delete button per product
  - Pagination controls

##### 9.2 Add Product Modal
- **Trigger:** "Add New Product" button
- **Type:** Modal
- **Features:**
  - Product name input
  - Category selector
  - Serving size input
  - Calories input
  - Protein input (g)
  - Carbs input (g)
  - Fat input (g)
  - Image URL input
  - Save button

##### 9.3 Edit Product Modal
- **Trigger:** "Edit" button on product row
- **Type:** Modal
- **Features:** Same as Add Product but pre-filled

##### 9.4 Bulk Import
- **Trigger:** "Bulk Import" button
- **Type:** Modal
- **Features:**
  - CSV file upload
  - Column mapping
  - Preview
  - Import button

**Status:** ✅ Implemented

---

## Navigation Structure

### Desktop Navigation (Sidebar)
- **Position:** Left side, persistent
- **Items:**
  1. Dashboard (home icon)
  2. Food (fork/knife icon)
  3. Body (body icon)
  4. Exercise (dumbbell icon)
  5. Settings (gear icon)
- **Footer:** User profile, Logout

### Mobile Navigation (Bottom Tab Bar)
- **Position:** Bottom, fixed
- **Items:** Same 5 main tabs
- **Style:** Icon + label, active state highlighted

### Breadcrumbs
- **Location:** Top of page (if nested)
- **Example:** `Dashboard > Body > Progress Photos > Compare`

---

## Data Flow & State Management

### Authentication Flow
1. User visits `/` (Home)
2. Clicks login → OAuth redirect
3. Returns to `/onboarding` if no profile
4. Completes onboarding → redirects to `/dashboard`
5. Subsequent visits → `/dashboard` directly

### Food Logging Flow
1. Navigate to `/food`
2. Click "Add Food"
3. Search Fitasty products
4. Select product → auto-fills macros
5. Adjust portion if needed
6. Save → updates daily totals
7. Dashboard reflects changes

### Body Metrics Flow
1. Navigate to `/body`
2. Option A: Click "Add Measurement" → `/body/add`
3. Option B: Click "Import CSV" → `/body/import-csv`
4. Option C: Click "Import from Photo" → `/body/import/photo`
5. Data saved → charts update

### Progress Photos Flow
1. Navigate to `/body/photos`
2. Click "Upload" → modal
3. Select photo + date + tags
4. Save → gallery updates
5. Select 2 photos for compare
6. View before/after with metrics

---

## Route Parameters & Query Strings

| Route | Parameters | Example | Purpose |
|-------|-----------|---------|---------|
| `/food/:date` | date (YYYY-MM-DD) | `/food/2026-03-05` | View food log for specific date |
| `/body/photos` | None | N/A | Gallery view (compare mode in modal) |
| `/admin/products` | None | N/A | Product list (search via query string) |

---

## Access Control Matrix

| Route | Public | Authenticated | Admin | Notes |
|-------|--------|---------------|-------|-------|
| `/` | ✅ | ✅ | ✅ | Home page |
| `/404` | ✅ | ✅ | ✅ | Error page |
| `/onboarding` | ❌ | ✅ | ✅ | Redirected if no profile |
| `/dashboard` | ❌ | ✅ | ✅ | Main app |
| `/food` | ❌ | ✅ | ✅ | Food logging |
| `/food/:date` | ❌ | ✅ | ✅ | Food logging |
| `/body` | ❌ | ✅ | ✅ | Body metrics |
| `/body/add` | ❌ | ✅ | ✅ | Add measurement |
| `/body/import-csv` | ❌ | ✅ | ✅ | CSV import |
| `/body/photos` | ❌ | ✅ | ✅ | Progress photos |
| `/body/import/photo` | ❌ | ✅ | ✅ | Photo import |
| `/exercise` | ❌ | ✅ | ✅ | Exercise logging |
| `/settings` | ❌ | ✅ | ✅ | Settings |
| `/admin/products` | ❌ | ❌ | ✅ | Admin only (email allowlist) |

---

## Modal & Overlay Routes (Not Separate Routes)

These are triggered from within pages but don't have separate URL routes:

| Modal | Trigger | Page | Features |
|-------|---------|------|----------|
| Add Food | "Add Food" button | `/food` | Product search, manual entry |
| Add Exercise | "Add Exercise" button | `/exercise` | Type, duration, intensity |
| Upload Photo | "Upload" button | `/body/photos` | File picker, date, tags |
| AI Goal Photo | "AI Generation" button | `/body/photos` | Delta input, generation |
| Add Product | "Add New Product" button | `/admin/products` | Product fields |
| Edit Product | "Edit" button | `/admin/products` | Product fields (pre-filled) |
| Bulk Import | "Bulk Import" button | `/admin/products` | CSV upload |
| PDF Report | "Download PDF" button | `/food` | Section selection |
| Compare Photos | "Compare" button | `/body/photos` | Photo selection, side-by-side view |

---

## SEO & Metadata

| Page | Title | Meta Description |
|------|-------|------------------|
| `/` | AI Nutritionist & Fitness | Track nutrition, fitness, and body metrics with AI insights |
| `/dashboard` | Dashboard - AI Nutritionist | Your daily nutrition and fitness overview |
| `/food` | Food Log - AI Nutritionist | Log your daily meals and track macros |
| `/body` | Body Metrics - AI Nutritionist | Track weight, body fat, and muscle mass trends |
| `/exercise` | Exercise Log - AI Nutritionist | Log your workouts and track calories burned |
| `/settings` | Settings - AI Nutritionist | Manage your profile and preferences |
| `/admin/products` | Admin - Fitasty Products | Manage food product database |

---

## Performance Considerations

### Route-Level Code Splitting
- Each page component is lazy-loaded
- Reduces initial bundle size
- Faster page transitions

### Data Caching Strategy
- Dashboard data cached for 5 minutes
- Food log data cached per date
- Body metrics cached for 24 hours
- Admin product list cached for 1 hour

### Preloading
- Preload next likely page (e.g., dashboard → food)
- Prefetch admin routes if user is admin

---

## Future Route Additions (Phase 3)

| Route | Purpose | Status |
|-------|---------|--------|
| `/meal-plans` | AI-generated meal planning | 🔮 Planned |
| `/recommendations` | Detailed recommendation view | 🔮 Planned |
| `/progress` | Comprehensive progress analytics | 🔮 Planned |
| `/social` | Social features and challenges | 🔮 Planned |
| `/integrations` | Wearable and app integrations | 🔮 Planned |
| `/coach` | Trainer/coach dashboard | 🔮 Planned |

---

## Appendix: Component Hierarchy

```
App
├── Router
│   ├── Home (/)
│   ├── NotFound (/404)
│   └── AppLayout (wrapper for protected routes)
│       ├── Onboarding (/onboarding)
│       ├── Dashboard (/dashboard)
│       ├── FoodLog (/food, /food/:date)
│       ├── BodyMetrics (/body)
│       │   ├── BodyMetricsAdd (/body/add)
│       │   ├── BodyMetricsImportCSV (/body/import-csv)
│       │   ├── BodyPhotosGallery (/body/photos)
│       │   └── BodyReportImport (/body/import/photo)
│       ├── ExerciseLog (/exercise)
│       ├── Settings (/settings)
│       └── AdminProducts (/admin/products)
```

---

**Document End**

*This sitemap reflects the current application structure as of March 6, 2026. Updates will be documented in subsequent versions.*
