import type { DayDef, ExerciseDef, WorkoutProgramDocument } from '@/types/workout';

const PROGRAM_VERSION = 1 as const;

export const DEFAULT_PROGRAM_TIPS: readonly string[] = [
  'Log weight and reps for each set, then save the session to keep history.',
  '“Last” compares to your most recent saved session for this day, before the date you selected.',
] as const;

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function parseExercise(raw: unknown): ExerciseDef | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (!isNonEmptyString(o.id) || !isNonEmptyString(o.name)) return null;
  const sets = typeof o.sets === 'number' ? o.sets : Number.parseInt(String(o.sets), 10);
  if (!Number.isFinite(sets) || sets < 1) return null;
  const repRange = isNonEmptyString(o.repRange) ? o.repRange.trim() : '';
  if (!repRange) return null;
  const notes =
    o.notes === undefined || o.notes === null
      ? undefined
      : isNonEmptyString(o.notes)
        ? o.notes.trim()
        : undefined;
  return { id: o.id, name: o.name.trim(), sets, repRange, notes };
}

function parseDay(raw: unknown): DayDef | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (!isNonEmptyString(o.key) || !isNonEmptyString(o.label) || !isNonEmptyString(o.shortLabel)) {
    return null;
  }
  if (!Array.isArray(o.exercises) || o.exercises.length < 1) return null;
  const exercises: ExerciseDef[] = [];
  for (const ex of o.exercises) {
    const p = parseExercise(ex);
    if (!p) return null;
    exercises.push(p);
  }
  return {
    key: o.key,
    label: o.label.trim(),
    shortLabel: o.shortLabel.trim(),
    exercises,
  };
}

/** Parse and validate program JSON from Supabase. Returns null if invalid. */
export function parseWorkoutProgramJson(raw: unknown): WorkoutProgramDocument | null {
  if (raw == null) return { version: PROGRAM_VERSION, days: [] };
  if (typeof raw !== 'object' || !raw) return null;
  const o = raw as Record<string, unknown>;
  if (o.version !== PROGRAM_VERSION) return null;
  if (!Array.isArray(o.days)) return null;
  const days: DayDef[] = [];
  for (const d of o.days) {
    const p = parseDay(d);
    if (!p) return null;
    days.push(p);
  }
  return { version: PROGRAM_VERSION, days };
}

export function getDayFromProgram(
  program: WorkoutProgramDocument | null,
  key: string,
): DayDef | undefined {
  if (!program?.days?.length) return undefined;
  return program.days.find((d) => d.key === key);
}

export function dayKeyOrder(program: WorkoutProgramDocument | null): string[] {
  return program?.days?.map((d) => d.key) ?? [];
}

export function newDayKey(): string {
  return `d_${crypto.randomUUID()}`;
}

export function newExerciseId(): string {
  return `ex_${crypto.randomUUID()}`;
}

export function createEmptyWorkoutProgram(): WorkoutProgramDocument {
  return { version: PROGRAM_VERSION, days: [] };
}

export function isProgramUsable(p: WorkoutProgramDocument | null): boolean {
  if (!p?.days?.length) return false;
  return p.days.every(
    (d) =>
      d.exercises.length > 0 &&
      d.exercises.every(
        (ex) => ex.name.trim() && ex.sets >= 1 && ex.repRange.trim(),
      ),
  );
}
