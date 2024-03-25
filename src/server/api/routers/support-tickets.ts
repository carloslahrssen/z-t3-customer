import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { supportTickets } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const supportTicketsRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        fullName: z.string().min(1),
        contactEmail: z.string().email({ message: "Invalid email address" }),
        problemDescription: z.string().min(1),
        subject: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(supportTickets).values({
        ...input,
        status: "todo",
      });
    }),
  list: publicProcedure.query(({ ctx }) =>
    ctx.db.query.supportTickets.findMany({
      with: {
        replies: true,
      },
    }),
  ),
  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(supportTickets)
        .where(eq(supportTickets.id, input.id));
    }),
  changeStatus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["todo", "blocked", "progress", "completed"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(supportTickets)
        .set({ status: input.status })
        .where(eq(supportTickets.id, input.id));
    }),
});

export type SupportTicketsRouter = typeof supportTicketsRouter;
