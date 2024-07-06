import { z } from "zod";
import { pgTable, timestamp, text, unique } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  name: text("name"),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date"
  }).notNull()
});


export const authenticationSchema = z.object({
  email: z.string().email().min(5).max(31),
  name: z.string(),
  password: z
    .string()
    .min(4, { message: "must be at least 4 characters long" })
});

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().min(4).optional(),

});

export type UsernameAndPassword = z.infer<typeof authenticationSchema>;