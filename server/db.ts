import { and, desc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, tests, testResults, uxAnalyses, personas, skills, skillAssignments } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Tests
export async function createTest(userId: number, data: {
  title: string;
  description?: string;
  featureName: string;
  userTask: string;
  context?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(tests).values({
    userId,
    ...data,
  });
  // Retornar o ID do teste inserido
  return (result as any).insertId || 0;
}

export async function getTestById(testId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(tests).where(eq(tests.id, testId)).limit(1);
  return result[0];
}

export async function getTestsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(tests).where(eq(tests.userId, userId)).orderBy(desc(tests.createdAt));
}

export async function updateTestStatus(testId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(tests).set({ status: status as any }).where(eq(tests.id, testId));
}

// Test Results
export async function createTestResult(data: {
  testId: number;
  personaName: string;
  report: string;
  successfulCompletion: number;
  painPoints?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(testResults).values(data);
}

export async function getTestResultsByTestId(testId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(testResults).where(eq(testResults.testId, testId));
}

// UX Analyses
export async function createUxAnalysis(data: {
  testId: number;
  executiveSummary: string;
  detailedAnalysis: string;
  usabilityDiagnosis: string;
  competitiveBenchmark?: string;
  recommendations: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(uxAnalyses).values(data);
}

export async function getUxAnalysisByTestId(testId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(uxAnalyses).where(eq(uxAnalyses.testId, testId)).limit(1);
  return result[0];
}

// Personas
export async function getActivePersonas(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(personas).where(and(eq(personas.userId, userId), eq(personas.isActive, 1)));
}

export async function getPersonaById(personaId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(personas).where(eq(personas.id, personaId)).limit(1);
  return result[0];
}

// Skills
export async function getActiveSkills(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(skills).where(and(eq(skills.userId, userId), eq(skills.isActive, 1)));
}

export async function getSkillsByAgent(agentName: string) {
  const db = await getDb();
  if (!db) return [];
  
  const assignments = await db.select().from(skillAssignments).where(eq(skillAssignments.agentName, agentName));
  const skillIds = assignments.map(a => a.skillId);
  
  if (skillIds.length === 0) return [];
  
  return db.select().from(skills).where(inArray(skills.id, skillIds));
}


// Create Skill
export async function createSkill(userId: number, data: {
  name: string;
  description?: string;
  content: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(skills).values({
    userId,
    ...data,
  });
  return (result as any).insertId || 0;
}

// Assign Skill to Agent
export async function assignSkillToAgent(skillId: number, agentName: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(skillAssignments).values({
    skillId,
    agentName,
  });
}
