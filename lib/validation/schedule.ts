import { z } from "zod";

export const generateScheduleSchema = z.object({
  startDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Date de début invalide"),
  endDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Date de fin invalide"),
  name: z.string().min(1).max(100).optional(),
});

export const updateScheduleSchema = z.object({
  status: z.enum(["draft", "active", "archived"]),
});

export const updateInterventionSchema = z.object({
  assignedTeamId: z.string().optional(),
  estimatedStartTime: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:MM requis").optional(),
  status: z.enum(["planned", "in_progress", "completed", "cancelled", "postponed"]).optional(),
  notes: z.string().max(500).optional(),
});

export const addInterventionSchema = z.object({
  clientId: z.string().min(1, "Client requis"),
  scheduledDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Date invalide"),
  estimatedStartTime: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:MM requis"),
  interventionType: z.enum([
    "mowing", "hedge_trimming", "pruning", "weeding",
    "planting", "maintenance", "emergency",
  ]),
  estimatedDurationMinutes: z.number().int().min(15).max(480),
  assignedTeamId: z.string().min(1, "Équipe requise"),
  notes: z.string().max(500).optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(["planned", "in_progress", "completed", "cancelled", "postponed"]),
});

export type GenerateScheduleData = z.infer<typeof generateScheduleSchema>;
export type UpdateInterventionData = z.infer<typeof updateInterventionSchema>;
export type AddInterventionData = z.infer<typeof addInterventionSchema>;
