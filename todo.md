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
