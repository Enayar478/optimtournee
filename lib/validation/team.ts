import { z } from "zod";

export const teamMemberSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  phone: z.string().optional(),
});

export const teamSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Couleur hexadécimale invalide"),
  members: z.array(teamMemberSchema).min(1, "Au moins un membre requis"),
  defaultStartAddress: z.string().max(500).optional().or(z.literal("")),
  defaultStartLat: z.number().optional(),
  defaultStartLng: z.number().optional(),
  workScheduleStart: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format HH:MM requis")
    .default("08:00"),
  workScheduleEnd: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format HH:MM requis")
    .default("17:00"),
  lunchBreakMinutes: z.number().min(0).max(120).default(60),
  workingDays: z.array(z.number().min(0).max(6)).default([1, 2, 3, 4, 5]),
  assignedEquipment: z
    .array(
      z.enum([
        "lawn_tractor",
        "push_mower",
        "hedge_trimmer",
        "chainsaw",
        "blower",
        "trailer",
        "utility_vehicle",
      ])
    )
    .default([]),
  skills: z
    .array(
      z.enum([
        "mowing",
        "hedge_trimming",
        "pruning",
        "weeding",
        "planting",
        "maintenance",
        "emergency",
      ])
    )
    .default([]),
});

export type TeamFormData = z.infer<typeof teamSchema>;
export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;
