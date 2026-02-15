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
