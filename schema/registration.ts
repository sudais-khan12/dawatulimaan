import { z } from "zod";

export const registrationSchema = z.object({
  personId: z.string(),
  eventId: z.string(),
  answers: z.record(z.string(), z.unknown()),
});

export type Registration = z.infer<typeof registrationSchema>;
