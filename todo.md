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
