import { z } from "zod";

export const eventSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  date: z.string(),
  isActive: z.boolean(),
});

export type Event = z.infer<typeof eventSchema>;
