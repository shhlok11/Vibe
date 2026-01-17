import { getUsageStatus } from "@/lib/usage";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const usageRouter = createTRPCRouter({
  getStatus: protectedProcedure.query(async () => {
    try {
      const status = await getUsageStatus();
      return status;
    } catch {
      return null
    }
  }),
});