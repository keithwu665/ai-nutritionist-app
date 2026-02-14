import { describe, expect, it } from "vitest";
import {
  calculateBMI,
  getBMIStatus,
  calculateBMR,
  calculateTDEE,
  calculateDailyCalorieTarget,
  getActivityMultiplier,
  getMealTypeText,
  getExerciseIntensityText,
  getFitnessGoalText,
  getActivityLevelText,
  getBMIStatusText,
} from "../shared/calculations";

describe("BMI Calculations", () => {
  it("calculates BMI correctly for a 70kg, 170cm person", () => {
    const bmi = calculateBMI(70, 170);
    expect(bmi).toBeCloseTo(24.22, 1);
  });

  it("calculates BMI correctly for a 50kg, 160cm person", () => {
    const bmi = calculateBMI(50, 160);
    expect(bmi).toBeCloseTo(19.53, 1);
  });

  it("returns correct BMI status for underweight", () => {
    expect(getBMIStatus(17)).toBe("underweight");
  });

  it("returns correct BMI status for normal", () => {
    expect(getBMIStatus(22)).toBe("normal");
  });

  it("returns correct BMI status for overweight", () => {
    expect(getBMIStatus(27)).toBe("overweight");
  });

  it("returns correct BMI status for obese", () => {
    expect(getBMIStatus(32)).toBe("obese");
  });

  it("returns correct BMI status text in Chinese", () => {
    expect(getBMIStatusText("normal")).toBe("正常");
    expect(getBMIStatusText("underweight")).toBe("過輕");
    expect(getBMIStatusText("overweight")).toBe("過重");
    expect(getBMIStatusText("obese")).toBe("肥胖");
  });
});

describe("BMR Calculations (Mifflin-St Jeor)", () => {
  it("calculates BMR correctly for a male", () => {
    // Male: 10 * 70 + 6.25 * 170 - 5 * 30 + 5 = 700 + 1062.5 - 150 + 5 = 1617.5
    const bmr = calculateBMR("male", 70, 170, 30);
    expect(bmr).toBeCloseTo(1617.5, 1);
  });

  it("calculates BMR correctly for a female", () => {
    // Female: 10 * 55 + 6.25 * 160 - 5 * 25 - 161 = 550 + 1000 - 125 - 161 = 1264
    const bmr = calculateBMR("female", 55, 160, 25);
    expect(bmr).toBeCloseTo(1264, 1);
  });
});

describe("TDEE Calculations", () => {
  it("applies sedentary multiplier correctly", () => {
    expect(getActivityMultiplier("sedentary")).toBe(1.2);
    const tdee = calculateTDEE(1600, "sedentary");
    expect(tdee).toBeCloseTo(1920, 0);
  });

  it("applies light multiplier correctly", () => {
    expect(getActivityMultiplier("light")).toBe(1.375);
    const tdee = calculateTDEE(1600, "light");
    expect(tdee).toBeCloseTo(2200, 0);
  });

  it("applies moderate multiplier correctly", () => {
    expect(getActivityMultiplier("moderate")).toBe(1.55);
    const tdee = calculateTDEE(1600, "moderate");
    expect(tdee).toBeCloseTo(2480, 0);
  });

  it("applies high multiplier correctly", () => {
    expect(getActivityMultiplier("high")).toBe(1.725);
    const tdee = calculateTDEE(1600, "high");
    expect(tdee).toBeCloseTo(2760, 0);
  });
});

describe("Daily Calorie Target", () => {
  it("subtracts 400 for lose goal", () => {
    const target = calculateDailyCalorieTarget(2000, "lose");
    expect(target).toBe(1600);
  });

  it("maintains TDEE for maintain goal", () => {
    const target = calculateDailyCalorieTarget(2000, "maintain");
    expect(target).toBe(2000);
  });

  it("adds 250 for gain goal", () => {
    const target = calculateDailyCalorieTarget(2000, "gain");
    expect(target).toBe(2250);
  });
});

describe("Chinese Text Helpers", () => {
  it("returns correct meal type text", () => {
    expect(getMealTypeText("breakfast")).toBe("早餐");
    expect(getMealTypeText("lunch")).toBe("午餐");
    expect(getMealTypeText("dinner")).toBe("晚餐");
    expect(getMealTypeText("snack")).toBe("小食");
    expect(getMealTypeText("unknown")).toBe("unknown");
  });

  it("returns correct exercise intensity text", () => {
    expect(getExerciseIntensityText("low")).toBe("低強度");
    expect(getExerciseIntensityText("moderate")).toBe("中等強度");
    expect(getExerciseIntensityText("high")).toBe("高強度");
  });

  it("returns correct fitness goal text", () => {
    expect(getFitnessGoalText("lose")).toBe("減脂");
    expect(getFitnessGoalText("maintain")).toBe("維持");
    expect(getFitnessGoalText("gain")).toBe("增肌");
  });

  it("returns correct activity level text", () => {
    expect(getActivityLevelText("sedentary")).toBe("久坐");
    expect(getActivityLevelText("light")).toBe("輕量");
    expect(getActivityLevelText("moderate")).toBe("中量");
    expect(getActivityLevelText("high")).toBe("高量");
  });
});
