import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTableCreator,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `z-t3-customer_${name}`);

export const statusEnum = pgEnum("status", [
  "todo",
  "progress",
  "completed",
  "blocked",
]);

export const supportTickets = createTable("support_tickets", {
  id: serial("id").primaryKey(),
  fullName: text("full_name"),
  contactEmail: text("contact_email"),
  problemDescription: text("problem_description"),
  subject: text("subject"),
  createdAt: timestamp("created_at").defaultNow(),
  status: statusEnum("status"),
});

export const supportTicketsRelations = relations(
  supportTickets,
  ({ many }) => ({
    replies: many(replies),
  }),
);

export const replies = createTable("replies", {
  id: serial("id").primaryKey(),
  message: text("message"),
  supportTicketId: integer("support_ticket_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const repliesRelations = relations(replies, ({ one }) => ({
  supportTickets: one(supportTickets, {
    fields: [replies.supportTicketId],
    references: [supportTickets.id],
  }),
}));
