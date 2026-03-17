/**
 * CSV templates and column definitions for onboarding import
 */

export interface ColumnDef {
  key: string;
  label: string;
  required: boolean;
  example: string;
  description: string;
}

// ─── Teams ────────────────────────────────────────────────────

export const TEAM_COLUMNS: ColumnDef[] = [
  {
    key: "name",
    label: "Nom de l'équipe",
    required: true,
    example: "Équipe Alpha",
    description: "Nom unique de l'équipe",
  },
  {
    key: "color",
    label: "Couleur",
    required: false,
    example: "#2D5A3D",
    description: "Code couleur hex (défaut: auto)",
  },
  {
    key: "members",
    label: "Membres",
    required: true,
    example: "Jean Dupont; Marie Martin",
    description: "Prénom Nom séparés par ;",
  },
  {
    key: "depot_address",
    label: "Adresse dépôt",
    required: false,
    example: "12 Rue des Lilas, 33000 Bordeaux",
    description: "Adresse de départ des tournées",
  },
  {
    key: "horaires",
    label: "Horaires",
    required: false,
    example: "08:00-17:00",
    description: "Format HH:MM-HH:MM (défaut: 08:00-17:00)",
  },
  {
    key: "pause_dejeuner",
    label: "Pause déjeuner (min)",
    required: false,
    example: "60",
    description: "Durée en minutes (défaut: 60)",
  },
  {
    key: "jours_travailles",
    label: "Jours travaillés",
    required: false,
    example: "L;Ma;Me;J;V",
    description: "D, L, Ma, Me, J, V, S séparés par ;",
  },
  {
    key: "equipements",
    label: "Équipements",
    required: false,
    example: "Tondeuse autoportée; Taille-haie",
    description: "Noms séparés par ;",
  },
  {
    key: "competences",
    label: "Compétences",
    required: false,
    example: "Tonte; Taille haie; Élagage",
    description: "Noms séparés par ;",
  },
];

// ─── Clients ──────────────────────────────────────────────────

export const CLIENT_COLUMNS: ColumnDef[] = [
  {
    key: "name",
    label: "Nom du client",
    required: true,
    example: "M. Dupont",
    description: "Nom ou raison sociale",
  },
  {
    key: "address",
    label: "Adresse",
    required: true,
    example: "45 Av. de la République, 33000 Bordeaux",
    description: "Adresse complète (géocodage automatique)",
  },
  {
    key: "telephone",
    label: "Téléphone",
    required: false,
    example: "06 12 34 56 78",
    description: "Numéro de contact",
  },
  {
    key: "email",
    label: "Email",
    required: false,
    example: "client@email.com",
    description: "Adresse email de contact",
  },
  {
    key: "intervention",
    label: "Type d'intervention",
    required: false,
    example: "Tonte",
    description:
      "Tonte, Taille de haie, Élagage, Désherbage, Plantation, Entretien, Urgence",
  },
  {
    key: "duree_minutes",
    label: "Durée (min)",
    required: false,
    example: "60",
    description: "Durée estimée en minutes",
  },
  {
    key: "jour",
    label: "Jour préféré",
    required: false,
    example: "Lundi",
    description: "Dimanche à Samedi",
  },
  {
    key: "recurrence",
    label: "Récurrence",
    required: false,
    example: "Hebdomadaire",
    description:
      "Hebdomadaire, Bi-hebdomadaire, Mensuel, Bimestriel, Trimestriel",
  },
  {
    key: "priorite",
    label: "Priorité",
    required: false,
    example: "1",
    description: "1 (basse) à 5 (haute)",
  },
];

// ─── Helpers ──────────────────────────────────────────────────

const DAY_MAP: Record<string, number> = {
  d: 0,
  dimanche: 0,
  l: 1,
  lundi: 1,
  ma: 2,
  mardi: 2,
  me: 3,
  mercredi: 3,
  j: 4,
  jeudi: 4,
  v: 5,
  vendredi: 5,
  s: 6,
  samedi: 6,
};

const INTERVENTION_MAP: Record<string, string> = {
  tonte: "mowing",
  "taille de haie": "hedge_trimming",
  "taille haie": "hedge_trimming",
  élagage: "pruning",
  elagage: "pruning",
  désherbage: "weeding",
  desherbage: "weeding",
  plantation: "planting",
  entretien: "maintenance",
  "entretien général": "maintenance",
  urgence: "emergency",
};

const EQUIPMENT_MAP: Record<string, string> = {
  "tondeuse autoportée": "lawn_tractor",
  "tondeuse autoportee": "lawn_tractor",
  "tondeuse poussée": "push_mower",
  "tondeuse poussee": "push_mower",
  "taille-haie": "hedge_trimmer",
  "taille haie": "hedge_trimmer",
  tronçonneuse: "chainsaw",
  tronconneuse: "chainsaw",
  souffleur: "blower",
  remorque: "trailer",
  utilitaire: "utility_vehicle",
};

const RECURRENCE_MAP: Record<string, string> = {
  hebdomadaire: "weekly",
  hebdo: "weekly",
  "bi-hebdomadaire": "biweekly",
  "bi-hebdo": "biweekly",
  bihebdomadaire: "biweekly",
  mensuel: "monthly",
  bimestriel: "bimonthly",
  trimestriel: "quarterly",
};

function parseSemicolonList(val: string): string[] {
  return val
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseDays(val: string): number[] {
  return parseSemicolonList(val)
    .map((d) => DAY_MAP[d.toLowerCase()])
    .filter((n) => n !== undefined);
}

function parseMembers(
  val: string
): { firstName: string; lastName: string }[] {
  return parseSemicolonList(val).map((full) => {
    const parts = full.trim().split(/\s+/);
    return {
      firstName: parts[0] ?? "",
      lastName: parts.slice(1).join(" ") || "",
    };
  });
}

// ─── Row parsers ──────────────────────────────────────────────

export interface ParsedTeamRow {
  name: string;
  color: string;
  members: { firstName: string; lastName: string }[];
  defaultStartAddress: string;
  workScheduleStart: string;
  workScheduleEnd: string;
  lunchBreakMinutes: number;
  workingDays: number[];
  assignedEquipment: string[];
  skills: string[];
}

export function parseTeamRow(
  row: Record<string, string>,
  index: number,
  defaultColors: string[]
): { data: ParsedTeamRow | null; error: string | null } {
  const name = (row["Nom de l'équipe"] ?? row["name"] ?? "").trim();
  if (!name) return { data: null, error: `Ligne ${index + 1}: nom manquant` };

  const membersRaw = row["Membres"] ?? row["members"] ?? "";
  const members = parseMembers(membersRaw);
  if (members.length === 0)
    return { data: null, error: `Ligne ${index + 1}: au moins un membre requis` };

  const colorRaw = (row["Couleur"] ?? row["color"] ?? "").trim();
  const color = colorRaw.startsWith("#")
    ? colorRaw
    : defaultColors[index % defaultColors.length];

  const horaires = (row["Horaires"] ?? row["horaires"] ?? "").trim();
  let workScheduleStart = "08:00";
  let workScheduleEnd = "17:00";
  if (horaires.includes("-")) {
    const [s, e] = horaires.split("-").map((h) => h.trim());
    if (/^\d{2}:\d{2}$/.test(s)) workScheduleStart = s;
    if (/^\d{2}:\d{2}$/.test(e)) workScheduleEnd = e;
  }

  const pauseRaw = row["Pause déjeuner (min)"] ?? row["pause_dejeuner"] ?? "60";
  const lunchBreakMinutes = Math.max(0, Math.min(120, parseInt(pauseRaw) || 60));

  const joursRaw = row["Jours travaillés"] ?? row["jours_travailles"] ?? "";
  const workingDays = joursRaw ? parseDays(joursRaw) : [1, 2, 3, 4, 5];

  const equipRaw = row["Équipements"] ?? row["equipements"] ?? "";
  const assignedEquipment = parseSemicolonList(equipRaw)
    .map((e) => EQUIPMENT_MAP[e.toLowerCase()] ?? "")
    .filter(Boolean);

  const skillsRaw = row["Compétences"] ?? row["competences"] ?? "";
  const skills = parseSemicolonList(skillsRaw)
    .map((s) => INTERVENTION_MAP[s.toLowerCase()] ?? "")
    .filter(Boolean);

  const depotAddress =
    (row["Adresse dépôt"] ?? row["depot_address"] ?? "").trim();

  return {
    data: {
      name,
      color,
      members,
      defaultStartAddress: depotAddress,
      workScheduleStart,
      workScheduleEnd,
      lunchBreakMinutes,
      workingDays,
      assignedEquipment,
      skills,
    },
    error: null,
  };
}

export interface ParsedClientRow {
  name: string;
  address: string;
  contactPhone?: string;
  contactEmail?: string;
  interventionType?: string;
  durationMinutes?: number;
  dayOfWeek?: number;
  recurrence?: string;
  priority?: number;
}

export function parseClientRow(
  row: Record<string, string>,
  index: number
): { data: ParsedClientRow | null; error: string | null } {
  const name = (row["Nom du client"] ?? row["name"] ?? "").trim();
  if (!name) return { data: null, error: `Ligne ${index + 1}: nom manquant` };

  const address = (row["Adresse"] ?? row["address"] ?? "").trim();
  if (!address)
    return { data: null, error: `Ligne ${index + 1}: adresse manquante` };

  const phone = (row["Téléphone"] ?? row["telephone"] ?? "").trim() || undefined;
  const email = (row["Email"] ?? row["email"] ?? "").trim() || undefined;

  const interventionRaw = (
    row["Type d'intervention"] ?? row["intervention"] ?? ""
  ).trim();
  const interventionType = interventionRaw
    ? INTERVENTION_MAP[interventionRaw.toLowerCase()]
    : undefined;

  const durationRaw = row["Durée (min)"] ?? row["duree_minutes"] ?? "";
  const durationMinutes = durationRaw
    ? Math.max(15, parseInt(durationRaw) || 60)
    : undefined;

  const jourRaw = (row["Jour préféré"] ?? row["jour"] ?? "").trim();
  const dayOfWeek = jourRaw ? DAY_MAP[jourRaw.toLowerCase()] : undefined;

  const recurrenceRaw = (row["Récurrence"] ?? row["recurrence"] ?? "").trim();
  const recurrence = recurrenceRaw
    ? RECURRENCE_MAP[recurrenceRaw.toLowerCase()]
    : undefined;

  const priorityRaw = row["Priorité"] ?? row["priorite"] ?? "";
  const priority = priorityRaw
    ? Math.max(1, Math.min(5, parseInt(priorityRaw) || 1))
    : undefined;

  return {
    data: {
      name,
      address,
      contactPhone: phone,
      contactEmail: email,
      interventionType,
      durationMinutes,
      dayOfWeek,
      recurrence,
      priority,
    },
    error: null,
  };
}

// ─── Generate CSV template content ───────────────────────────

export function generateCsvTemplate(columns: ColumnDef[]): string {
  const header = columns.map((c) => c.label).join(",");
  const exampleRow = columns.map((c) => `"${c.example}"`).join(",");
  return `${header}\n${exampleRow}`;
}

export function downloadCsv(content: string, filename: string): void {
  const bom = "\uFEFF"; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([bom + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
