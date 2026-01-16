import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { useMutation } from "@tanstack/react-query";
import { inngest } from "@/inngest/client";

export const appRouter = createTRPCRouter({
  invoke: baseProcedure
    .input(
      z.object({
        value: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await inngest.send({
        name: "test/generate.code",
        data: {
          value: input.value,
        },
      });
      return { ok: "success" };
    }),

  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
