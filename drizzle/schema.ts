import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, date } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User profile table for onboarding data.
 */
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  gender: mysqlEnum("gender", ["male", "female"]).notNull(),
  age: int("age").notNull(),
  heightCm: decimal("heightCm", { precision: 5, scale: 1 }).notNull(),
  weightKg: decimal("weightKg", { precision: 5, scale: 1 }).notNull(),
  fitnessGoal: mysqlEnum("fitnessGoal", ["lose", "maintain", "gain"]).notNull(),
  activityLevel: mysqlEnum("activityLevel", ["sedentary", "light", "moderate", "high"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

/**
 * Body metrics table for tracking weight, body fat, and muscle mass.
 */
export const bodyMetrics = mysqlTable("body_metrics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  weightKg: decimal("weightKg", { precision: 5, scale: 1 }).notNull(),
  bodyFatPercent: decimal("bodyFatPercent", { precision: 4, scale: 1 }),
  muscleMassKg: decimal("muscleMassKg", { precision: 5, scale: 1 }),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BodyMetric = typeof bodyMetrics.$inferSelect;
export type InsertBodyMetric = typeof bodyMetrics.$inferInsert;

/**
 * Food logs table for daily food tracking.
 */
export const foodLogs = mysqlTable("food_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FoodLog = typeof foodLogs.$inferSelect;
export type InsertFoodLog = typeof foodLogs.$inferInsert;

/**
 * Food log items table for individual food entries.
 */
export const foodLogItems = mysqlTable("food_log_items", {
  id: int("id").autoincrement().primaryKey(),
  foodLogId: int("foodLogId").notNull(),
  userId: int("userId").notNull(),
  mealType: mysqlEnum("mealType", ["breakfast", "lunch", "dinner", "snack"]).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  calories: decimal("calories", { precision: 8, scale: 1 }).notNull(),
  proteinG: decimal("proteinG", { precision: 6, scale: 1 }),
  carbsG: decimal("carbsG", { precision: 6, scale: 1 }),
  fatG: decimal("fatG", { precision: 6, scale: 1 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FoodLogItem = typeof foodLogItems.$inferSelect;
export type InsertFoodLogItem = typeof foodLogItems.$inferInsert;

/**
 * Exercises table for tracking workouts.
 */
export const exercises = mysqlTable("exercises", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  type: varchar("type", { length: 100 }).notNull(),
  durationMinutes: int("durationMinutes").notNull(),
  caloriesBurned: decimal("caloriesBurned", { precision: 8, scale: 1 }).notNull(),
  intensity: mysqlEnum("intensity", ["low", "moderate", "high"]),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = typeof exercises.$inferInsert;
