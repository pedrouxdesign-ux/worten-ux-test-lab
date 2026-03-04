import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { createTest, getTestsByUserId, getTestById, getTestResultsByTestId, getUxAnalysisByTestId, getActivePersonas, createSkill, assignSkillToAgent, getActiveSkills } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure } from "./_core/trpc";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  tests: router({
    create: publicProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        featureName: z.string().min(1),
        userTask: z.string().min(1),
        context: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user?.id || 1;
        const testId = await createTest(userId, input);
        return testId;
      }),
    
    list: publicProcedure.query(async ({ ctx }) => {
      const userId = ctx.user?.id || 1;
      return getTestsByUserId(userId);
    }),
    
    getById: publicProcedure
      .input(z.object({ testId: z.number() }))
      .query(async ({ input }) => {
        return getTestById(input.testId);
      }),
  }),
  
  testResults: router({
    getByTestId: publicProcedure
      .input(z.object({ testId: z.number() }))
      .query(async ({ input }) => {
        return getTestResultsByTestId(input.testId);
      }),
  }),
  
  uxAnalysis: router({
    getByTestId: publicProcedure
      .input(z.object({ testId: z.number() }))
      .query(async ({ input }) => {
        return getUxAnalysisByTestId(input.testId);
      }),
  }),
  
  personas: router({
    list: publicProcedure.query(async ({ ctx }) => {
      const userId = ctx.user?.id || 1;
      return getActivePersonas(userId);
    }),
  }),
  
  testExecution: router({
    execute: publicProcedure
      .input(z.object({ testId: z.number() }))
      .mutation(async ({ input }) => {
        const { executeFullTest } = await import("./testExecutor");
        executeFullTest(input.testId).catch(err => 
          console.error(`Failed to execute test ${input.testId}:`, err)
        );
        return { success: true, message: "Teste iniciado. Processamento em andamento." };
      }),
  }),
  
  skills: router({
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        content: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user?.id || 1;
        return createSkill(userId, input);
      }),
    
    list: publicProcedure.query(async ({ ctx }) => {
      const userId = ctx.user?.id || 1;
      return getActiveSkills(userId);
    }),
    
    assign: publicProcedure
      .input(z.object({
        skillId: z.number(),
        agentName: z.string(),
      }))
      .mutation(async ({ input }) => {
        return assignSkillToAgent(input.skillId, input.agentName);
      }),
  }),
});

export type AppRouter = typeof appRouter;
