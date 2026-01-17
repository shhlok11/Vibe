import { RateLimiterPrisma } from "rate-limiter-flexible";
import prisma from "./db";
import { auth } from "@clerk/nextjs/server";

const FREE_POINTS = 2;
const PRO_POINTS = 100;
const DURATION = 30 * 24 * 60 * 60; // 30 Days
const GENERATION_COST = 1
const USAGE_DISABLED_ENV = "DISABLE_USAGE_LIMIT";

const isUsageLimitDisabled = () => process.env[USAGE_DISABLED_ENV] === "true";

export async function getUsageTracker() {

  const { has } = await auth();
  const hasProAccess = has({ plan: "pro" })

  const usageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    points: hasProAccess ? PRO_POINTS : FREE_POINTS,
    duration: DURATION,
  })

  return usageTracker;
}

export async function consumeCredits() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (isUsageLimitDisabled()) {
    return {
      remainingPoints: FREE_POINTS,
      msBeforeNext: 0,
    };
  }

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.consume(userId, GENERATION_COST);
  
  return result;
}

export async function getUsageStatus() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (isUsageLimitDisabled()) {
    return {
      remainingPoints: FREE_POINTS,
      msBeforeNext: 0,
    };
  }

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.get(userId);
  return result;
}
