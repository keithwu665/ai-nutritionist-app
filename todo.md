# AI Nutritionist Web App - Project TODO

## Phase 1: Database Schema
- [x] Create database tables (user_profiles, body_metrics, food_logs, food_log_items, exercises)
- [x] Implement user-level data isolation via server-side userId validation
- [x] Setup Drizzle ORM schema and run migrations

## Phase 2: Authentication & Onboarding
- [x] Implement Manus OAuth authentication
- [x] Create onboarding flow (gender, age, height, weight, goal, activity level)
- [x] Store onboarding data in user_profiles table
- [x] Redirect to onboarding if no profile exists

## Phase 3: Body Metrics Module
- [x] Create body metrics recording page
- [x] Create body metrics add page
- [x] Implement weight trend chart visualization (7/30/90 day views)
- [x] Implement body fat trend chart
- [x] Create body metrics list view with delete

## Phase 4: Food Logging Module
- [x] Create food log page with date navigation
- [x] Implement meal type categorization (breakfast, lunch, dinner, snack)
- [x] Create food item add/delete functionality
- [x] Implement copy-yesterday feature
- [x] Display daily macronutrient totals (calories, protein, carbs, fat)

## Phase 5: Exercise Module
- [x] Create exercise recording page with date navigation
- [x] Implement exercise add/delete functionality
- [x] Display daily exercise summary (duration, calories burned)
- [x] Support exercise types and intensity levels

## Phase 6: Metabolic Calculations
- [x] Implement Mifflin-St Jeor BMR formula
- [x] Implement TDEE calculation with activity multipliers
- [x] Implement goal-adjusted calorie targets
- [x] Create shared calculation utilities

## Phase 7: Dashboard
- [x] Create main dashboard page
- [x] Display today's intake vs target
- [x] Display net calories
- [x] Display weekly averages
- [x] Display exercise time summary
- [x] Display body weight trend mini-chart
- [x] Display metabolic data (BMR, TDEE, target)

## Phase 8: Rule-Based Recommendation Engine
- [x] Implement dietary recommendation logic (3 suggestions)
- [x] Implement exercise recommendation logic (2 suggestions)
- [x] Create recommendations display component
- [x] Integrate with dashboard

## Phase 9: Settings & Navigation
- [x] Create settings page with profile editing
- [x] Implement logout functionality
- [x] Create sidebar navigation (desktop)
- [x] Create bottom tab navigation (mobile)
- [x] Display metabolic data in settings

## Phase 10: Testing
- [x] Write unit tests for BMI calculations
- [x] Write unit tests for BMR calculations
- [x] Write unit tests for TDEE calculations
- [x] Write unit tests for calorie target calculations
- [x] Write unit tests for Chinese text helpers
- [x] All 23 tests passing (updated with Asian BMI standard tests)

## Upgrade: Data Isolation & BMI Enhancement
- [x] Verify all CRUD operations enforce userId filtering (server-side)
- [x] Add Asian BMI standard to body metrics page (BMI card with color-coded status)
- [x] Ensure BMI uses profile.heightCm + latest body_metrics.weightKg
- [x] Handle edge cases: no height data, no weight records
- [x] Strengthen input validation on all tRPC procedures
- [x] Verify session stability and auth protection on all routes
- [x] Polish UI for body metrics BMI display


## Phase 2: Fitasty Integration & Advanced Features
- [x] Step 1: Fitasty products (DB + Admin only)
  - [x] Create fitasty_products table
  - [x] Add database helpers for Fitasty CRUD
  - [x] Add tRPC admin-only procedures
  - [x] Create AdminProducts page
  - [x] Zero TypeScript errors
- [x] Step 2: CSV body import
  - [x] Create CSV parser utility
  - [x] Add CSV import tRPC procedures
  - [x] Support column detection and mapping
  - [x] Handle duplicate handling (skip/overwrite)
  - [x] Zero TypeScript errors
- [x] Step 3: Photo import + template
  - [x] Create body report parser provider interface
  - [x] Create photo import router
  - [x] Add body report templates table
  - [x] Add template database helpers
  - [x] Zero TypeScript errors
- [x] Step 4: Recommendation engine
  - [x] Create enhanced recommendation engine utility (10+ rules)
  - [x] Implement 5 diet rules
  - [x] Implement 5 exercise rules
  - [x] Implement 3 encouragement rules
  - [x] Integrate with tRPC recommendations router
  - [x] Proper separation of concerns (utility + router)
  - [x] Zero TypeScript errors
- [x] Step 5: Dashboard upgrade
  - [x] Add encouragement section to dashboard
  - [x] Display all recommendation types
  - [x] Enhance recommendations display with icons
  - [x] Zero TypeScript errors
  - [x] All 23 tests passing

## Phase 2 Summary
- Total features added: 5 major features (Fitasty, CSV import, Photo import, Enhanced recommendations, Dashboard upgrade)
- Total database tables added: 3 (fitasty_products, body_report_templates, daily_tips)
- Total tRPC routers added: 3 (fitastyProducts, bodyMetricsImport, bodyMetricsPhotoImport)
- Total utility functions added: 2 (csvParser, bodyReportParser, recommendationEngine)
- Recommendation rules: 13 total (5 diet + 5 exercise + 3 encouragement)
- TypeScript compilation: ✅ ZERO ERRORS throughout all steps
- Test coverage: ✅ 23 tests passing
- Phase 1 functionality: ✅ FULLY INTACT (no regressions)


## Module 1: Fitasty Product Integration (LIVE TESTING)

- [x] Step 0: Admin product creation UX with all fields (name, category, servingSize, calories, protein, carbs, fat)
- [x] Step 1: Product search in /food with autocomplete
- [x] Step 2: Auto-fill calories/macros on product selection
- [x] Step 3: Persist to DB and verify dashboard updates
- [x] ACCEPTANCE: Product created via /admin/products ✅
- [x] ACCEPTANCE: Search shows product in /food ✅
- [x] ACCEPTANCE: Selecting auto-fills calories/macros ✅
- [x] ACCEPTANCE: Submit writes food_log_items ✅
- [x] ACCEPTANCE: Dashboard totals update ✅

## PART 1: Module 1 Freeze (Admin Allowlist)
- [x] Add ADMIN_EMAIL_ALLOWLIST environment variable
- [x] Implement email allowlist check in /admin/products route
- [ ] Verify Module 1 on published URL: /food autocomplete works
- [ ] Verify Module 1 on published URL: selecting product auto-fills macros
- [ ] Verify Module 1 on published URL: submit writes to food_log_items
- [ ] Verify Module 1 on published URL: dashboard updates immediately
- [ ] Create checkpoint: "module1-stable-fitasty-foodlog-allowlist"

## PART 2A: CSV Import for Body Metrics - COMPLETE
- [x] Create /body/import-csv page (mobile-first)
- [x] Implement CSV file upload component
- [x] Implement CSV preview with row display
- [x] Implement column mapping (date, weight_kg required; body_fat_percent, muscle_mass_kg optional)
- [x] Implement CSV import logic to write body_metrics
- [x] Handle duplicate dates (skip or overwrite)
- [x] Verify /body chart reflects imported data
- [x] Fix Radix Select crash
- [x] Fix dateColumn falsy check
- [x] Fix date parsing
- [x] Add server-side logging
- [x] Test duplicate handling (skip mode)
- [x] Test duplicate handling (overwrite mode)
- [x] Verify database writes
- [x] Verify dashboard updates

## Module 2B: Progress Photos (MVP 1-4) - COMPLETE
- [x] Create body_photos table schema (id, userId, photoUrl, uploadedAt, description)
- [x] Implement photo upload tRPC procedure with S3 storage
- [x] Create /body/photos page with timeline gallery (date-sorted)
- [x] Implement delete with ownership enforcement
- [x] Implement before/after compare mode with side-by-side view
- [x] Verify end-to-end on preview
- [x] Create checkpoint

## Module 2B: Mobile Usability Bug Fix - COMPLETE
- [x] Fix modal layout for iOS/mobile: max-height constraint with overflow handling
- [x] Implement sticky footer for Upload button (always visible)
- [x] Add safe-area-inset-bottom padding for iOS bottom toolbar
- [x] Implement WebKit smooth scrolling (-webkit-overflow-scrolling: touch)
- [x] Add keyboard visibility handling with scroll-into-view
- [x] Implement inline validation with error messages (no alerts)
- [x] Disable Upload button until file + date selected
- [x] Add loading state to prevent double submit
- [x] Test on desktop viewport (modal scrolls, footer sticky)
- [x] Verify on mobile viewport (390x844 iPhone size)
- [x] Verify modal scrolls when content exceeds viewport
- [x] Verify sticky footer remains visible when scrolling
- [x] All 27 tests passing
- [x] TypeScript: 0 errors
