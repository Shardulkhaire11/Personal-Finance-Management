import { z } from "zod";

export const insertUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .includes("@", "Username must contain @"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertTransactionSchema = z.object({
  amount: z.number().min(0, "Amount must be positive"),
  type: z.enum(["income", "expense"]),
  category: z.string(),
  description: z.string().min(1, "Description is required"),
  date: z.date(),
});
