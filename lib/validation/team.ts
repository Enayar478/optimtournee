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
});

export type TeamFormData = z.infer<typeof teamSchema>;
export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;
