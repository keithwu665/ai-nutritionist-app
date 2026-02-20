import { mysqlTable, mysqlSchema, AnyMySqlColumn, int, varchar, decimal, text, timestamp, mysqlEnum, tinyint, index } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const bodyMetrics = mysqlTable("body_metrics", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	date: varchar({ length: 10 }).notNull(),
	weightKg: decimal({ precision: 5, scale: 1 }).notNull(),
	bodyFatPercent: decimal({ precision: 4, scale: 1 }),
	muscleMassKg: decimal({ precision: 5, scale: 1 }),
	note: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const bodyReportTemplates = mysqlTable("body_report_templates", {
	id: int().autoincrement().notNull(),
	userId: int(),
	provider: mysqlEnum(['inbody','boditrax','other']).notNull(),
	name: varchar({ length: 255 }).notNull(),
	fieldsJson: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const dailyTips = mysqlTable("daily_tips", {
	id: int().autoincrement().notNull(),
	category: varchar({ length: 100 }).notNull(),
	type: mysqlEnum(['encouragement','tip','warning']).notNull(),
	content: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const exercises = mysqlTable("exercises", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	date: varchar({ length: 10 }).notNull(),
	type: varchar({ length: 100 }).notNull(),
	durationMinutes: int().notNull(),
	caloriesBurned: decimal({ precision: 8, scale: 1 }).notNull(),
	intensity: mysqlEnum(['low','moderate','high']),
	note: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const bodyPhotos = mysqlTable("body_photos", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	photoUrl: varchar({ length: 500 }).notNull(),
	description: text(),
	uploadedAt: varchar({ length: 10 }).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const fitastyProducts = mysqlTable("fitasty_products", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	category: varchar({ length: 100 }).notNull(),
	servingSize: varchar({ length: 100 }),
	calories: decimal({ precision: 8, scale: 1 }).notNull(),
	proteinG: decimal({ precision: 6, scale: 1 }),
	carbsG: decimal({ precision: 6, scale: 1 }),
	fatG: decimal({ precision: 6, scale: 1 }),
	description: text(),
	imageUrl: varchar({ length: 500 }),
	isActive: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	deletedAt: timestamp({ mode: 'string' }),
});

export const foodLogItems = mysqlTable("food_log_items", {
	id: int().autoincrement().notNull(),
	foodLogId: int().notNull(),
	userId: int().notNull(),
	mealType: mysqlEnum(['breakfast','lunch','dinner','snack']).notNull(),
	name: varchar({ length: 255 }).notNull(),
	calories: decimal({ precision: 8, scale: 1 }).notNull(),
	proteinG: decimal({ precision: 6, scale: 1 }),
	carbsG: decimal({ precision: 6, scale: 1 }),
	fatG: decimal({ precision: 6, scale: 1 }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const foodLogs = mysqlTable("food_logs", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	date: varchar({ length: 10 }).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const userProfiles = mysqlTable("user_profiles", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	gender: mysqlEnum(['male','female']).notNull(),
	age: int().notNull(),
	heightCm: decimal({ precision: 5, scale: 1 }).notNull(),
	weightKg: decimal({ precision: 5, scale: 1 }).notNull(),
	fitnessGoal: mysqlEnum(['lose','maintain','gain']).notNull(),
	activityLevel: mysqlEnum(['sedentary','light','moderate','high']).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("user_profiles_userId_unique").on(table.userId),
]);

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull(),
	openId: varchar({ length: 64 }).notNull(),
	name: text(),
	email: varchar({ length: 320 }),
	loginMethod: varchar({ length: 64 }),
	role: mysqlEnum(['user','admin']).default('user').notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	lastSignedIn: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("users_openId_unique").on(table.openId),
]);
