import { mysqlTable, int, varchar, decimal, text, timestamp, mysqlEnum, tinyint, primaryKey } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm"

export const bodyMetrics = mysqlTable("body_metrics", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	date: varchar({ length: 10 }).notNull(),
	weightKg: decimal({ precision: 5, scale: 1 }).notNull(),
	bodyFatPercent: decimal({ precision: 4, scale: 1 }),
	muscleMassKg: decimal({ precision: 5, scale: 1 }),
	note: text(),
	source: varchar({ length: 50 }), // 'manual', 'photo', 'device'
	report_photo_url: varchar({ length: 500 }), // S3 URL of the report photo
	measured_at: timestamp({ mode: 'string' }), // When the measurement was taken
	fat_mass_kg: decimal({ precision: 5, scale: 1 }), // Fat mass in kg
	ffm_kg: decimal({ precision: 5, scale: 1 }), // Fat-free mass in kg
	report_roi_photo_url: varchar({ length: 500 }), // S3 URL of the cropped ROI region
	extraction_json: text(), // Raw AI extraction output with confidence scores
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const bodyReportTemplates = mysqlTable("body_report_templates", {
	id: int().autoincrement().notNull(),
	userId: int(), // null = global template, userId = user custom template
	provider: mysqlEnum(['inbody','boditrax','other']).notNull(),
	name: varchar({ length: 255 }).notNull(),
	fieldsJson: text().notNull(), // JSON mapping of field names
	isGlobal: tinyint().default(0).notNull(), // 1 = global template, 0 = user template
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const bodyReportPhotos = mysqlTable("body_report_photos", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	provider: mysqlEnum(['inbody','boditrax']).notNull(),
	photoUrl: varchar({ length: 500 }).notNull(),
	storageKey: varchar({ length: 500 }).notNull(),
	parsedData: text(), // JSON of parsed data from the report
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const dailyTips = mysqlTable("daily_tips", {
	id: int().autoincrement().notNull(),
	category: varchar({ length: 100 }).notNull(),
	type: mysqlEnum(['encouragement','tip','warning']).notNull(),
	content: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
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
	source: varchar({ length: 50 }).default('manual'), // 'auto' or 'manual'
	met_used: decimal({ precision: 4, scale: 1 }), // MET value used for calculation
	weight_used_kg: decimal({ precision: 5, scale: 1 }), // Weight used for calorie calculation
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const bodyPhotos = mysqlTable("body_photos", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	photoUrl: varchar({ length: 500 }).notNull(),
	storageKey: varchar({ length: 500 }),
	description: text(),
	tags: varchar({ length: 255 }),
	uploadedAt: varchar({ length: 10 }).notNull(),
	source: varchar({ length: 50 }), // 'manual', 'inbody', 'boditrax'
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

	export const fitastyProducts = mysqlTable("fitasty_products", {
		id: int().autoincrement().notNull().primaryKey(),
		product_name_zh: varchar({ length: 255 }).notNull(),
		product_name_en: varchar({ length: 255 }),
		brand_name: varchar({ length: 255 }),
		category: varchar({ length: 100 }).notNull(),
		serving_size: int(), // numeric value (e.g., 100, 150)
		serving_unit: varchar({ length: 50 }), // e.g., 'g', 'ml', 'piece'
		calories: int().notNull(), // numeric only, no units
		protein_g: int(), // numeric only, no units
		carbs_g: int(), // numeric only, no units
		fat_g: int(), // numeric only, no units
		fiber_g: int(),
		sugar_g: int(),
		sodium_mg: int(),
		barcode: varchar({ length: 100 }),
		product_image_url: varchar({ length: 500 }),
		description: text(),
		is_active: tinyint().default(1).notNull(),
		is_featured: tinyint().default(0).notNull(),
		createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
		updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
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
		source: varchar({ length: 50 }), // 'fitasty', 'usda', 'off', 'manual', 'ai_photo'
		external_id: varchar({ length: 255 }), // fitasty_product_id, usda fdcId, or off code
		grams: decimal({ precision: 6, scale: 1 }), // Quantity in grams
		per100g_kcal: decimal({ precision: 8, scale: 1 }), // Kcal per 100g used for calculation
		per100g_protein: decimal({ precision: 6, scale: 1 }), // Protein per 100g
		per100g_carbs: decimal({ precision: 6, scale: 1 }), // Carbs per 100g
		per100g_fat: decimal({ precision: 6, scale: 1 }), // Fat per 100g
		is_autofilled: tinyint().default(0).notNull(), // 1 = auto-filled, 0 = manual
		photo_url: varchar({ length: 500 }), // S3 URL of food photo for AI extraction
		ai_suggested_kcal: decimal({ precision: 8, scale: 1 }), // AI suggested kcal
		ai_suggested_protein_g: decimal({ precision: 6, scale: 1 }), // AI suggested protein
		ai_suggested_carbs_g: decimal({ precision: 6, scale: 1 }), // AI suggested carbs
		ai_suggested_fat_g: decimal({ precision: 6, scale: 1 }), // AI suggested fat
		ai_confidence_json: text(), // JSON with confidence levels per macro
		ai_prefill_json: text(), // Full AI extraction response
		is_ai_autofilled: tinyint().default(0).notNull(), // 1 = AI autofilled, 0 = manual
		createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
		updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	});

export const foodLogs = mysqlTable("food_logs", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	date: varchar({ length: 10 }).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const userProfiles = mysqlTable("user_profiles", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	gender: mysqlEnum(['male','female']).notNull(),
	age: int().notNull(),
	heightCm: varchar({ length: 10 }).notNull(),
	weightKg: varchar({ length: 10 }).notNull(),
	fitnessGoal: mysqlEnum(['lose','maintain','gain']).notNull(),
	activityLevel: mysqlEnum(['sedentary','light','moderate','high']).notNull(),
	aiToneStyle: mysqlEnum(['gentle','coach','hk_style']).default('gentle').notNull(),
	displayName: varchar({ length: 100 }), // User's preferred display name (稱呼)
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull().primaryKey(),
	openId: varchar({ length: 255 }).notNull().unique(),
	email: varchar({ length: 255 }),
	name: varchar({ length: 255 }),
	loginMethod: varchar({ length: 50 }),
	lastSignedIn: timestamp({ mode: 'string' }),
	role: mysqlEnum(['user','admin']).default('user').notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const activityLogs = mysqlTable("activity_logs", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	actionType: varchar({ length: 50 }).notNull(),
	entityType: varchar({ length: 50 }),
	entityId: varchar({ length: 50 }),
	status: mysqlEnum(['success','failed','pending']).default('pending').notNull(),
	errorMessage: text(),
	metadata: text(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const generalFoodCache = mysqlTable("general_food_cache", {
	id: int().autoincrement().notNull(),
	source: mysqlEnum(['usda','off']).notNull(), // 'usda' or 'off'
	external_id: varchar({ length: 255 }).notNull(), // USDA fdcId or OFF code
	display_name: varchar({ length: 255 }).notNull(),
	brand: varchar({ length: 255 }),
	kcal_per_100g: decimal({ precision: 8, scale: 1 }),
	protein_g_per_100g: decimal({ precision: 6, scale: 1 }),
	carbs_g_per_100g: decimal({ precision: 6, scale: 1 }),
	fat_g_per_100g: decimal({ precision: 6, scale: 1 }),
	raw_json: text(), // Raw API response for debugging
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});
