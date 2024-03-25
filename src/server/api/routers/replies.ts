import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { replies } from "~/server/db/schema";

export const repliesRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        message: z.string().min(1).max(500),
        supportTicketId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(replies).values({
        ...input,
      });
    }),
});

export type RepliesRouter = typeof repliesRouter;
