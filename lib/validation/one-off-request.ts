import { z } from "zod";

export const createRequestSchema = z
  .object({
    clientId: z.string().min(1, "Client requis"),
    interventionType: z.enum([
      "mowing",
      "hedge_trimming",
      "pruning",
      "weeding",
      "planting",
      "maintenance",
      "emergency",
    ]),
    description: z.string().min(1, "Description requise").max(500),
    durationEstimate: z
      .number()
      .int()
      .min(15, "Minimum 15 minutes")
      .max(480, "Maximum 480 minutes"),
    priority: z.number().int().min(1).max(5).default(1),
    preferredDateStart: z.string().datetime({ offset: true }).optional(),
    preferredDateEnd: z.string().datetime({ offset: true }).optional(),
  })
  .refine(
    (data) => {
      if (!data.preferredDateStart || !data.preferredDateEnd) return true;
      return new Date(data.preferredDateEnd) >= new Date(data.preferredDateStart);
    },
    {
      message: "La date de fin doit être après la date de début",
      path: ["preferredDateEnd"],
    }
  );

export type CreateRequestFormData = z.infer<typeof createRequestSchema>;

export const updateRequestSchema = z
  .object({
    status: z.enum(["pending", "scheduled", "completed", "cancelled"]).optional(),
    description: z.string().min(1).max(500).optional(),
    preferredDateStart: z.string().datetime({ offset: true }).optional(),
    preferredDateEnd: z.string().datetime({ offset: true }).optional(),
  })
  .refine(
    (data) => {
      if (!data.preferredDateStart || !data.preferredDateEnd) return true;
      return new Date(data.preferredDateEnd) >= new Date(data.preferredDateStart);
    },
    {
      message: "La date de fin doit être après la date de début",
      path: ["preferredDateEnd"],
    }
  );

export type UpdateRequestFormData = z.infer<typeof updateRequestSchema>;
