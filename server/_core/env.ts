export const ENV = {
  appId: process.env.VITE_APP_ID ?? "local",
  cookieSecret: process.env.JWT_SECRET ?? "local_secret",
  databaseUrl: process.env.DATABASE_URL ?? "",
  openRouterApiKey: process.env.OPENROUTER_API_KEY ?? "",
  openRouterModel: process.env.OPENROUTER_MODEL ?? "minimax/minimax-m2.5:free",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "local_user",
  isProduction: process.env.NODE_ENV === "production",
};
