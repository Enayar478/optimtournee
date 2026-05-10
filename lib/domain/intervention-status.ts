/**
 * State machine for intervention status transitions.
 *
 * Valid lifecycle:
 *   planned     → in_progress, cancelled, postponed
 *   in_progress → completed, cancelled
 *   postponed   → planned, cancelled
 *   completed   → (terminal — no transitions)
 *   cancelled   → (terminal — no transitions)
 *
 * Idempotent self-transitions (X → X) are always allowed.
 */

export type InterventionStatus =
  | "planned"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "postponed";

const allowedTransitions: Record<InterventionStatus, InterventionStatus[]> = {
  planned: ["planned", "in_progress", "cancelled", "postponed"],
  in_progress: ["in_progress", "completed", "cancelled"],
  postponed: ["postponed", "planned", "cancelled"],
  completed: ["completed"],
  cancelled: ["cancelled"],
};

export function isValidStatusTransition(
  from: InterventionStatus,
  to: InterventionStatus
): boolean {
  return allowedTransitions[from]?.includes(to) ?? false;
}

export function getAllowedTransitions(
  from: InterventionStatus
): InterventionStatus[] {
  return allowedTransitions[from] ?? [];
}
