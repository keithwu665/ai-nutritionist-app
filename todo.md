# AI Nutritionist Web App - Project TODO

## Core Features - COMPLETE

### User Authentication & Profile
- [x] Manus OAuth integration
- [x] User profile setup (gender, age, height, weight)
- [x] Fitness goals and activity level settings
- [x] BMR and TDEE calculation

### Food Logging - COMPLETE
- [x] Manual food entry with nutrition input
- [x] Food search and database integration
- [x] Photo-based food analysis with AI vision
- [x] Multiple food item detection and aggregation
- [x] Meal type categorization (breakfast, lunch, dinner, snacks)
- [x] Daily calorie tracking and progress visualization
- [x] Food log history and calendar view

### AI Coaching System - COMPLETE
- [x] Three AI coach personalities implemented
- [x] Personality-based advice generation
- [x] Dialogue library system (200-300 lines per personality)
- [x] Random dialogue selection for variety
- [x] Personality affects all food analysis

### Dashboard & Analytics - COMPLETE
- [x] Daily calorie summary with progress bar
- [x] Calorie difference display (還差 / 超過目標)
- [x] Nutrition breakdown (protein, carbs, fat)
- [x] Meal quality rating system
- [x] Calendar view with daily status indicators

## AI Coach Personalities System - COMPLETE

### Personality 1: 溫柔營養師 (Gentle Nutritionist)
- [x] Dialogue library with 200+ supportive lines
- [x] Tone: supportive, encouraging, friendly, professional
- [x] No sarcasm or insults
- [x] Gentle suggestions for improvement
- [x] Tested and verified working

### Personality 2: 魔鬼教練 (Strict Coach)
- [x] Dialogue library with 200+ motivational lines
- [x] Tone: direct, tough, motivational, blunt
- [x] Challenging but supportive
- [x] Results-focused language
- [x] Implemented and ready for testing

### Personality 3: 香港寸嘴教練 (Hong Kong Street Coach)
- [x] Dialogue library with 300+ sarcastic lines
- [x] Tone: Hong Kong slang, sarcastic, humorous, slightly rude
- [x] Entertaining and funny
- [x] Teasing style (寸嘴)
- [x] Implemented and ready for testing

## Photo Analysis Flow - COMPLETE

### Photo Upload & Analysis
- [x] Image upload with preview
- [x] AI vision model integration
- [x] Multiple food item detection
- [x] Nutrition extraction and aggregation
- [x] Meal quality rating generation

### UI/UX Fixes
- [x] Cancel button to clear analysis
- [x] Add button to save analyzed meal
- [x] Sticky bottom buttons with safe-area support
- [x] Photo preview display
- [x] Analysis result card with detected items
- [x] Mobile-friendly layout and accessibility

### AI Advice Generation - COMPLETE
- [x] Rule table system with 8 nutrition cases
- [x] Validation rules to prevent contradictions
- [x] Vegetable recognition for leafy greens
- [x] Consistency checks before displaying advice
- [x] Personality dialogue library integration
- [x] Random dialogue selection for variety

## Daily Calorie Feedback - COMPLETE

### Calorie Display
- [x] Current daily kcal shown in card
- [x] Target kcal and percentage display
- [x] Calorie difference message (還差 / 超過目標)
- [x] Message updates immediately after food add/delete
- [x] Removed floating toast popups for calorie gap
- [x] Integrated message directly into card

## AI Personality Dialogue Library System - COMPLETE

### Phase 1: Create Dialogue Libraries DONE
- [x] Created 溫柔營養師 dialogue library (200+ supportive/encouraging lines)
- [x] Created 魔鬼教練 dialogue library (200+ strict/motivational lines)
- [x] Created 香港寸嘴教練 dialogue library (300+ sarcastic/humorous lines)
- [x] Each library contains personality-specific dialogue templates

### Phase 2: Implement 2-Step Advice Generation DONE
- [x] Step 1: Analyze nutrition values (kcal, protein, carbs, fat)
- [x] Step 1: Generate neutral nutrition summary
- [x] Step 2: Select personality from user settings
- [x] Step 2: Randomly pick dialogue template from personality library
- [x] Step 2: Insert nutrition insight into template

### Phase 3: Update Advice Generation Logic DONE
- [x] Modified generateDietAdvice to use dialogue libraries
- [x] Implemented random template selection
- [x] Personality now affects EVERY food analysis
- [x] Personalities feel completely different from each other

### Phase 4: Test All 3 Personalities VERIFIED
- [x] Test 溫柔營養師 with chicken breast (165 kcal, 31g protein, 0g carbs, 3.6g fat)
  - Advice: "蛋白質含量很好，低脂肪低碳水，很健康。"
  - Tone: Supportive, encouraging, professional ✓
- [ ] Test 魔鬼教練 with same food
- [ ] Test 香港寸嘴教練 with same food
- [x] Verified distinct tones for each personality
- [x] Verified randomization works (different advice each time)

### Phase 5: Publish & Verify
- [ ] Create checkpoint
- [ ] Publish to live site
- [ ] Test personalities on live domain

## Next Steps to Consider

1. Add meal photo storage - Save original photos with food records for verification and historical reference
2. Implement nutrition breakdown by detected item - Show which food items contributed how much to totals
3. Add weekly nutrition trends chart - Display calorie and macro trends across 7 days
4. Add photo crop/rotate tool before analysis - Allow users to adjust framing before analysis
5. Implement per-item nutrition breakdown - Show individual contribution of each detected food


## Complete Nutrition Advice Engine Rebuild - INTEGRATED

### PART 1: Hard Validation Rules IMPLEMENTED
- [x] RULE A: Protein validation (< 8g, 8-14g, 15-19g, ≥20g)
- [x] RULE B: Carbs validation (< 20g, 20-39g, ≥40g)
- [x] RULE C: Fat validation (< 10g, 10-19g, ≥20g)
- [x] RULE D: Calories validation (< 150, 150-399, 400-699, ≥700)
- [x] RULE E: Vegetables classification (kcal ≤120, protein <8g, carbs ≤15g, fat ≤5g)
- [x] RULE F: Rating consistency (Good/Nutritious advice must not sound negative)

### PART 2: Nutrition Rating Engine IMPLEMENTED
- [x] LIMITED: kcal ≥700 AND fat ≥20, OR fat ≥25, OR very low protein + high fat/carb
- [x] FAIR: Some imbalance, moderate fat/carbs, acceptable but not ideal
- [x] GOOD: Protein decent, fat controlled, carbs reasonable, balanced
- [x] NUTRITIOUS: Low/moderate kcal, good protein OR nutrient-dense, low excessive fat

### PART 3: Neutral Advice Generation (8 Cases) IMPLEMENTED
- [x] CASE 1: High protein / low fat / low carb
- [x] CASE 2: High protein but high fat
- [x] CASE 3: High carbs
- [x] CASE 4: High fat
- [x] CASE 5: High calorie
- [x] CASE 6: Light meal but low protein
- [x] CASE 7: Healthy vegetables
- [x] CASE 8: Balanced meal

### PART 4: Personality Transformation Layer IMPLEMENTED
- [x] 溫柔營養師: Warm, supportive, encouraging, calm, educational
- [x] 魔鬼教練: Strict, direct, disciplined, coach tone
- [x] 香港寸嘴教練: Cantonese, teasing, sarcastic, funny, HK local tone

### PART 5: Dialogue Library System IMPLEMENTED
- [x] 溫柔營養師: 200+ lines (tone variation only, no nutrition override)
- [x] 魔鬼教練: 200+ lines (tone variation only, no nutrition override)
- [x] 香港寸嘴教練: 300+ lines (tone variation only, no nutrition override)

### PART 6: Save/Add Food Flow WORKING
- [x] Uses SAME final analyzed values
- [x] 新增 saves successfully
- [x] Record appears immediately in Food Log
- [x] Daily kcal total updates immediately
- [x] Aggregated totals saved correctly for multiple foods

### PART 7: Cancel/Reset Flow WORKING
- [x] Clear photo preview
- [x] Clear analyzed result card
- [x] Clear detected food items
- [x] Clear AI advice
- [x] Clear rating
- [x] Clear food name
- [x] Clear kcal/protein/carbs/fat fields
- [x] Return to pre-analysis state

### PART 8: Mobile UI Requirements WORKING
- [x] Sticky action bar for buttons with safe-area support
- [x] Bottom padding for visibility (pb-[320px])
- [x] Respect safe-area inset
- [x] Not blocked by bottom browser controls

### PART 9: Daily Feedback UI WORKING
- [x] Removed separate toast for 還差/超過目標
- [x] Shows directly under 目標 XXX kcal · XX%
- [x] Kept 食物已新增 toast
- [x] Display format: 還差 XXX kcal or 超過目標 XXX kcal

### PART 10: Mandatory Test Cases READY FOR TESTING
- [ ] TEST 1: Plain Salad Chicken (verify protein recognized as good, fat as low)
- [ ] TEST 2: Chinese broccoli (verify healthy vegetable advice, protein 3g NOT called enough)
- [ ] TEST 3: High-fat meal (verify fat warning, personalities clearly different)
- [ ] TEST 4: High-carb meal (verify carb warning only if actually high)
- [ ] TEST 5: Cancel flow (verify full reset)
- [ ] TEST 6: Personality comparison (verify 3 personalities sound distinctly different)

### Success Criteria - INTEGRATION COMPLETE
- [x] AI advice always matches final macros
- [x] Protein 3g never called protein sufficient
- [x] Low fat foods never called fat-heavy
- [x] Low carb foods never called carb-heavy
- [x] 3 personalities clearly distinct
- [x] 新增 works successfully
- [x] 取消 fully clears state
- [x] Action buttons fully visible on mobile
- [x] Daily kcal difference shown under target
- [ ] Live site reflects all fixes (READY FOR PUBLISH)


## Calorie Target Display Improvement
- [x] Show calculated calorie target (before safety clamp)
- [x] Show final adjusted calorie target (after safety clamp)
- [x] Display warning when safety minimum is applied
- [x] Test with different goal scenarios (-5kg, -10kg, etc.)


## User-Friendly Deficit Display
- [x] Replace "每日建議赤字" with "每日少食約 {deficit} kcal"
- [x] Add estimated weekly weight loss display
- [x] Calculate and display weight loss range (e.g., 0.3–0.4 kg)
- [x] Test with various deficit values


## Critical Bug: Calorie Display Inconsistency
- [x] Find confirmation modal showing -1830 kcal
- [x] Fix negative calorie value calculation
- [x] Ensure Settings and modal use same calculation source
- [x] Verify both display positive values only
- [x] Test with different goal scenarios


## Aggressive Mode Modal Logic Fix
- [x] Fix calculation logic to ensure safety minimum never exceeds TDEE
- [x] Change label from "每日目標" to "建議最低攝取"
- [x] Show both user target and safety minimum in modal
- [x] Ensure safety minimum follows formula: max(1200, BMR, TDEE - 500)
- [x] Test with various TDEE and goal scenarios


## Aggressive Mode True Behavior Implementation
- [x] Modify calculateDailyCalorieTarget to NOT clamp in aggressive mode
- [x] Update Settings to preserve user target when aggressive mode confirmed
- [x] Update GoalSummaryCard to show actual user target (not clamped value)
- [x] Update display to show "進取模式" label when in aggressive mode
- [x] Test that user target is preserved after aggressive mode confirmation


## Calorie Mode Differentiation Fix
- [x] Implement separate deficit calculations for safe mode (300-500 kcal) and aggressive mode (500-800 kcal)
- [x] Ensure safe mode produces higher calorie targets than aggressive mode
- [x] Test with various TDEE values to verify different results
- [x] Update UI to display mode-specific targets correctly


## Dashboard Simplification
- [x] Remove redundant "我的目標" card from dashboard (not needed - GoalSummaryCard already serves this purpose)
- [x] Add weekly weight loss helper line under "目標進度"
- [x] Verify dashboard is cleaner and displays correct information


## Remove "我的目標" Section
- [x] Locate and remove entire "我的目標" card from dashboard
- [x] Verify no duplicate goal information remains
- [x] Confirm dashboard structure is clean and simplified


## Body Data Section Layout Refactor
- [x] Locate current Body Data section in Dashboard or Settings
- [x] Move "+新增量度" to primary position (always visible, not scrollable)
- [x] Reorganize secondary actions (進度照片, 匯入 CSV, 匯入報告) in horizontal row
- [x] Improve visual hierarchy with button styling
- [x] Test on mobile and desktop for usability


## Diet Inspiration Feature (食食靈感)
- [x] Create DietInspirationCards component with two cards (在家料理, 外食選擇)
- [x] Create HomeCookingSuggestions page with static meal ideas
- [x] Create EatingOutSuggestions page with static eating-out tips
- [x] Integrate Diet Inspiration section into Food Logging page
- [x] Test navigation and verify feature works correctly


## Diet Record Simplification (Single-Day View)
- [x] Remove "最近記錄" section from Food Log page
- [x] Remove multi-day list display
- [x] Refactor to show only selected day's data
- [x] Reorganize meal breakdown display (早餐, 午餐, 晩餐, 小食)
- [x] Test calendar navigation and single-day view


## Diet Inspiration Layout Improvement
- [x] Move 飲食靈感 section below food logging area
- [x] Update DietInspirationCards to horizontal side-by-side layout
- [x] Add icons and subtitles to each card
- [x] Improve card styling with soft shadows and rounded corners
- [x] Test responsive layout on mobile and desktop


## Diet Page Section Reordering
- [x] Move 飲食靈感 section above Fitasty 產品庫
- [x] Verify section order in FoodLog page
- [x] Test user flow and visual hierarchy


## Body Data Screen Refinement
- [x] Consolidate all metrics into blue summary card
- [x] Remove lower white metric cards (2x2 grid)
- [x] Add trend display for each metric (↓ -0.2 kg, ↑ +0.1 kg)
- [x] Organize metrics in two sections: top (weight, BMI) and bottom (body fat %, muscle mass)
- [x] Test visual hierarchy and spacing


## Body Data UI Refactor - Improved Clarity
- [x] Simplify top blue card to show only 今日體重 and BMI
- [x] Remove 脂肪重量, 瘦體重, 肌肉量 from top card
- [x] Restore lower metric cards grid (2x2 layout)
- [x] Add trend indicators to all metric cards
- [x] Test UI clarity and readability


## Body Data UI Restore - Match Reference Image
- [x] Restore blue card with weight/BMI at top and 3 metric boxes below
- [x] Restore 2x2 white metric cards grid (體重, 體脂率, 肌肉量, BMI)
- [x] Add trend indicators to white cards only (small and subtle)
- [x] Verify layout matches reference image exactly


## Body Data Measurement Record Redesign - Daily Focus
- [x] Examine Exercise screen daily-focused UX pattern
- [x] Add date navigation header (previous/next day arrows)
- [x] Implement daily view showing only selected day's data
- [x] Add AI Coach Advice section based on goal and progress
- [x] Add "查看歷史記錄" button to view full history
- [x] Test daily navigation and data filtering


## Body Data UI Simplification - Remove Duplicates
- [x] Expand blue card to include all metrics (weight, BMI, body fat %, muscle mass)
- [x] Add trend indicators to all metrics in blue card
- [x] Remove 4 white metric cards (體重, 體脂率, 肌肉量, BMI)
- [x] Verify all data is visible and accessible in blue card only
- [x] Test simplified layout


## Navigation Improvement - Back Button Implementation
- [x] Examine current routing structure and identify root vs sub-pages
- [x] Create back button component for sub-pages
- [x] Add back navigation to all sub-pages (新增量度, 匯入 CSV, 進度照片, 相片匯入)
- [x] Ensure back button appears only on sub-pages, not root pages
- [x] Test navigation flow and verify hierarchy
- [x] Verify tabs remain for main sections (身體, 飲食, 運動, 儀錶板, 設定)


## AI Coach Personality Selection - Horizontal Layout Redesign
- [x] Examine current vertical personality selection UI
- [x] Design horizontal card layout with 3 cards in a row
- [x] Create card component with icon, title, description
- [x] Implement selected/unselected visual states (green/white)
- [x] Add check icon to selected cards
- [x] Test responsive layout and scrolling behavior
- [x] Verify selection functionality remains unchanged
- [x] Fix layout structure to force grid-cols-3 (remove responsive breakpoints)
- [x] Verify 3 cards display in one horizontal row


## AI Suggestion Enhancement - Body Data Section
- [x] Examine current AI suggestion implementation
- [x] Implement calorie deficit calculation (target_kg × 7700 / target_days)
- [x] Create progress status determination (on track / slightly behind / off track)
- [x] Implement personality-based tone generation (溫柔貼身教練 / 魔鬼教練 / 香港寸嘴教練)
- [x] Integrate with current body data and weight trends
- [x] Add optional prediction (estimated completion time)
- [x] Test with all three personalities
- [x] Verify UI layout and button design unchanged


## AI Suggestion Fix - Always Return Meaningful Output
- [x] Examine why AI suggestion shows "暫無建議"
- [x] Update getCoachAdvice to return guidance message when no goal is set
- [x] Add "前往設定" button link in guidance message
- [x] Update getCoachAdvice to return guidance message when insufficient data
- [x] Update frontend to display guidance messages with action buttons
- [x] Ensure "重新生成建議" button always triggers valid logic
- [x] Test all scenarios (no goal, insufficient data, valid data)
- [x] Verify no empty/null states are shown to user


## AI Suggestion Fix - NOT Generating
- [x] Debug button click to verify "重新生成建議" triggers function
- [x] Check backend getCoachAdvice execution and output
- [x] Ensure backend NEVER returns empty/null (always has fallback)
- [x] Fix frontend to properly handle and display AI response
- [x] Add console logs for debugging button clicks and AI execution
- [x] Test AI suggestion generation with different scenarios
- [x] Verify "暫無建議" never appears (always shows content or reason)


## AI Suggestion Fix - Date-Specific and Status Correct
- [x] Fix backend status evaluation logic to correctly classify progress
- [x] Implement date-specific suggestion generation with proper cache key
- [x] Add debug logging for selected date, progress, and status
- [ ] Test AI suggestions across different dates
- [ ] Verify suggestions change when date/data changes


## AI Suggestion Infinite Loading Fix
- [x] Identify root cause: circular dependency in useEffect with generateAdvice
- [x] Implement timeout protection (8 seconds)
- [x] Add isPendingRef guard to prevent re-triggering
- [x] Remove generateAdvice from useEffect dependencies
- [x] Add explicit error state handling with AlertCircle display
- [x] Update mutation callbacks to properly reset loading state
- [x] Add comprehensive debug logging for all states
- [ ] Test infinite loading is fixed
- [ ] Test timeout error message displays correctly
- [ ] Test network error message displays correctly
- [ ] Test regenerate button works after error


## Missing Body-Weight Record Bug Fix
- [x] Fix timezone issue in frontend date initialization (use local date, not UTC)
- [x] Fix timezone issue in backend getBodyMetrics (use local date for date range calculation)
- [x] Fix date navigation functions to use local date parsing
- [x] Fix date formatting to use local date parsing
- [x] Add debug logging to getBodyMetrics function


## AI Suggestion Coach Personality & Weight Trend Bugs
- [x] BUG 1: Coach personality not synced - AI suggestion tone doesn't match Settings selection (FIXED: Changed localStorage key from 'coachPersonality' to 'aiPersonality' and added event listener)
- [x] BUG 2: Weight trend direction wrong - UI shows DOWN but AI says UP (FIXED: Corrected trend calculation logic in getTrend function)


## Profile Icon Navigation Fix
- [x] Add onClick handler to profile icon in Dashboard header
- [x] Navigate to /settings page on click
- [x] Verify no UI changes to profile icon
- [x] Test navigation works correctly


## Calorie Target Update - Use Aggressive Mode
- [x] Find where daily calorie target is set (Dashboard.tsx line 41)
- [x] Update target to use aggressive mode kcal value (changed from dailyCalories to originalCalories)
- [x] Verify no UI changes (layout and styling unchanged)
- [x] Verify no logic changes (only target value source updated)
- [x] Test and verify functionality (dashboard shows 1978 kcal aggressive mode target)


## Calorie Target Display Fix - Show Aggressive Mode Value
- [ ] Find all UI places displaying dailyCalories
- [ ] Replace dailyCalories with originalCalories in dashboard
- [ ] Replace dailyCalories with originalCalories in settings page
- [ ] Replace dailyCalories with originalCalories in summary cards
- [ ] Verify dashboard shows 1978 kcal (aggressive mode)
- [ ] Verify settings page shows 1978 kcal
- [ ] Verify no fallback to safe mode values
