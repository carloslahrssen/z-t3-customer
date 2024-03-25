import { supportTicketsRouter } from "~/server/api/routers/support-tickets";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { repliesRouter } from "./routers/replies";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  supportTickets: supportTicketsRouter,
  replies: repliesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
