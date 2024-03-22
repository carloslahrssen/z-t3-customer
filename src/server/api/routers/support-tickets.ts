import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { supportTickets } from "~/server/db/schema";

export const supportTicketsRouter = createTRPCRouter({
    create: publicProcedure
        .input(z.object({
            fullName: z.string().min(1),
            contactEmail: z.string().email({message: "Invalid email address"}),
            problemDescription: z.string().min(1)

        }))
        .mutation(async ({ctx, input}) => {
            await ctx.db.insert(supportTickets).values({
                ...input
            })
        })
})