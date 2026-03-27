import { mysqlTable, mysqlSchema, AnyMySqlColumn, int, varchar, mysqlEnum, text, timestamp, decimal, tinyint, index } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const activityLogs = mysqlTable("activity_logs", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	actionType: varchar({ length: 50 }).notNull(),
	entityType: varchar({ length: 50 }),
	entityId: varchar({ length: 50 }),
	status: mysqlEnum(['success','failed','pending']).default('pending').notNull(),
	errorMessage: text(),
	metadata: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP'),
});

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
	source: varchar({ length: 50 }),
	reportPhotoUrl: varchar("report_photo_url", { length: 500 }),
	measuredAt: timestamp("measured_at", { mode: 'string' }),
	fatMassKg: decimal("fat_mass_kg", { precision: 5, scale: 1 }),
	ffmKg: decimal("ffm_kg", { precision: 5, scale: 1 }),
	reportRoiPhotoUrl: varchar("report_roi_photo_url", { length: 500 }),
	extractionJson: text("extraction_json"),
});

export const bodyPhotos = mysqlTable("body_photos", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	photoUrl: varchar({ length: 500 }).notNull(),
	storageKey: varchar({ length: 500 }),
	description: text(),
	tags: varchar({ length: 255 }),
	uploadedAt: varchar({ length: 10 }).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	source: varchar({ length: 50 }),
});

export const bodyReportPhotos = mysqlTable("body_report_photos", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	provider: mysqlEnum(['inbody','boditrax']).notNull(),
	photoUrl: varchar({ length: 500 }).notNull(),
	storageKey: varchar({ length: 500 }).notNull(),
	parsedData: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP'),
});

export const bodyReportTemplates = mysqlTable("body_report_templates", {
	id: int().autoincrement().notNull(),
	userId: int(),
	provider: mysqlEnum(['inbody','boditrax','other']).notNull(),
	name: varchar({ length: 255 }).notNull(),
	fieldsJson: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	isGlobal: tinyint().default(0),
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
	source: varchar({ length: 50 }).default('manual'),
	metUsed: decimal("met_used", { precision: 4, scale: 1 }),
	weightUsedKg: decimal("weight_used_kg", { precision: 5, scale: 1 }),
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
	isActive: tinyint("is_active").default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	deletedAt: timestamp({ mode: 'string' }),
	netWeightG: decimal("net_weight_g", { precision: 6, scale: 1 }),
	productNameZh: varchar("product_name_zh", { length: 255 }).default('Unknown').notNull(),
	productNameEn: varchar("product_name_en", { length: 255 }),
	brandName: varchar("brand_name", { length: 255 }),
	servingUnit: varchar("serving_unit", { length: 50 }),
	fiberG: int("fiber_g"),
	sugarG: int("sugar_g"),
	sodiumMg: int("sodium_mg"),
	barcode: varchar({ length: 100 }),
	productImageUrl: varchar("product_image_url", { length: 500 }),
	isFeatured: tinyint("is_featured").default(0),
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
	source: varchar({ length: 50 }),
	externalId: varchar("external_id", { length: 255 }),
	grams: decimal({ precision: 6, scale: 1 }),
	per100GKcal: decimal("per100g_kcal", { precision: 8, scale: 1 }),
	per100GProtein: decimal("per100g_protein", { precision: 6, scale: 1 }),
	per100GCarbs: decimal("per100g_carbs", { precision: 6, scale: 1 }),
	per100GFat: decimal("per100g_fat", { precision: 6, scale: 1 }),
	isAutofilled: tinyint("is_autofilled").default(0),
	photoUrl: varchar("photo_url", { length: 500 }),
	aiSuggestedKcal: decimal("ai_suggested_kcal", { precision: 8, scale: 1 }),
	aiSuggestedProteinG: decimal("ai_suggested_protein_g", { precision: 6, scale: 1 }),
	aiSuggestedCarbsG: decimal("ai_suggested_carbs_g", { precision: 6, scale: 1 }),
	aiSuggestedFatG: decimal("ai_suggested_fat_g", { precision: 6, scale: 1 }),
	aiConfidenceJson: text("ai_confidence_json"),
	aiPrefillJson: text("ai_prefill_json"),
	isAiAutofilled: tinyint("is_ai_autofilled").default(0),
});

export const foodLogs = mysqlTable("food_logs", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	date: varchar({ length: 10 }).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const generalFoodCache = mysqlTable("general_food_cache", {
	id: int().autoincrement().notNull(),
	source: mysqlEnum(['usda','off']).notNull(),
	externalId: varchar("external_id", { length: 255 }).notNull(),
	displayName: varchar("display_name", { length: 255 }).notNull(),
	brand: varchar({ length: 255 }),
	kcalPer100G: decimal("kcal_per_100g", { precision: 8, scale: 1 }),
	proteinGPer100G: decimal("protein_g_per_100g", { precision: 6, scale: 1 }),
	carbsGPer100G: decimal("carbs_g_per_100g", { precision: 6, scale: 1 }),
	fatGPer100G: decimal("fat_g_per_100g", { precision: 6, scale: 1 }),
	rawJson: text("raw_json"),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("unique_source_id").on(table.source, table.externalId),
]);

	export const userProfiles = mysqlTable("user_profiles", {
		id: int().autoincrement().notNull(),
		userId: int().notNull(),
		gender: mysqlEnum(['male','female']).notNull(),
		age: int().notNull(),
		heightCm: decimal({ precision: 5, scale: 1 }).notNull(),
		weightKg: decimal({ precision: 5, scale: 1 }).notNull(),
		startWeightKg: decimal({ precision: 5, scale: 1 }), // Initial weight when goal was set (NEW)
		fitnessGoal: mysqlEnum(['lose','maintain','gain']).notNull(),
		activityLevel: mysqlEnum(['sedentary','light','moderate','high']).notNull(),
		goalKg: decimal({ precision: 5, scale: 1 }), // LEGACY: goal weight change (kept for backward compatibility)
		goalWeightChangeKg: decimal({ precision: 5, scale: 1 }), // NEW: alias for goalKg with clearer semantics
		goalDays: int(),
		goalStartDate: timestamp({ mode: 'string' }), // NEW: When the goal was started
		displayName: varchar({ length: 100 }),
		calorieMode: mysqlEnum(['safe','aggressive']).default('safe').notNull(),
		calorieTarget: int().default(2000).notNull(),
		createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
		updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
		aiToneStyle: mysqlEnum(['gentle','coach','hk_style']).default('gentle').notNull(),
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

// ============================================================================
// Hydration & Sleep Tracking (NEW)
// ============================================================================

export const hydrationLogs = mysqlTable("hydration_logs", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	date: varchar({ length: 10 }).notNull(),
	waterIntakeMl: int().notNull(),
	targetMl: int().notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("hydration_logs_userId_date").on(table.userId, table.date),
]);

export const sleepLogs = mysqlTable("sleep_logs", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	date: varchar({ length: 10 }).notNull(),
	sleepHours: decimal({ precision: 3, scale: 1 }).notNull(),
	targetHours: decimal({ precision: 3, scale: 1 }).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("sleep_logs_userId_date").on(table.userId, table.date),
]);
