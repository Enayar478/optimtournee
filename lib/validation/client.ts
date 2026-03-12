import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email("Email invalide").optional().or(z.literal("")),
  notes: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
