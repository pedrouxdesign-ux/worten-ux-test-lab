import { int, mysqlEnum, mysqlTable, text, timestamp, tinyint, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
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

// Test Management
export const tests = mysqlTable("tests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  featureName: varchar("featureName", { length: 255 }).notNull(),
  userTask: text("userTask").notNull(),
  context: text("context"),
  status: mysqlEnum("status", ["pending", "running", "completed", "failed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Test = typeof tests.$inferSelect;
export type InsertTest = typeof tests.$inferInsert;

// Test Results (individual persona reports)
export const testResults = mysqlTable("testResults", {
  id: int("id").autoincrement().primaryKey(),
  testId: int("testId").notNull().references(() => tests.id),
  personaName: varchar("personaName", { length: 100 }).notNull(), // "Ana", "David", "Miguel"
  report: text("report").notNull(), // Full think-aloud narrative
  successfulCompletion: int("successfulCompletion").notNull(), // 0 = false, 1 = true
  painPoints: text("painPoints"), // JSON array of identified pain points
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TestResult = typeof testResults.$inferSelect;
export type InsertTestResult = typeof testResults.$inferInsert;

// UX Agent Analysis
export const uxAnalyses = mysqlTable("uxAnalyses", {
  id: int("id").autoincrement().primaryKey(),
  testId: int("testId").notNull().references(() => tests.id),
  executiveSummary: text("executiveSummary").notNull(),
  detailedAnalysis: text("detailedAnalysis").notNull(),
  usabilityDiagnosis: text("usabilityDiagnosis").notNull(),
  competitiveBenchmark: text("competitiveBenchmark"),
  recommendations: text("recommendations").notNull(), // JSON array of P1/P2/P3 recommendations
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UxAnalysis = typeof uxAnalyses.$inferSelect;
export type InsertUxAnalysis = typeof uxAnalyses.$inferInsert;

// Skills Management
export const skills = mysqlTable("skills", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  content: text("content").notNull(), // The actual knowledge document
  version: int("version").default(1).notNull(),
  isActive: int("isActive").default(1).notNull(), // 0 = false, 1 = true
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = typeof skills.$inferInsert;

// Skill Assignments (which skills are active for which agents)
export const skillAssignments = mysqlTable("skillAssignments", {
  id: int("id").autoincrement().primaryKey(),
  skillId: int("skillId").notNull().references(() => skills.id),
  agentName: varchar("agentName", { length: 100 }).notNull(), // "Ana", "David", "Miguel", "UX_Agent"
  assignedAt: timestamp("assignedAt").defaultNow().notNull(),
});

export type SkillAssignment = typeof skillAssignments.$inferSelect;
export type InsertSkillAssignment = typeof skillAssignments.$inferInsert;

// Personas Management
export const personas = mysqlTable("personas", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  name: varchar("name", { length: 100 }).notNull(),
  age: int("age").notNull(),
  profession: varchar("profession", { length: 255 }).notNull(),
  description: text("description").notNull(),
  frustrations: text("frustrations"), // JSON array
  motivations: text("motivations"), // JSON array
  techFamiliarity: int("techFamiliarity").notNull(), // 1-10 scale
  mobileUsagePercentage: int("mobileUsagePercentage").notNull(), // 0-100
  systemPrompt: text("systemPrompt").notNull(), // The LLM instruction-master
  isActive: int("isActive").default(1).notNull(), // 0 = false, 1 = true
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Persona = typeof personas.$inferSelect;
export type InsertPersona = typeof personas.$inferInsert;