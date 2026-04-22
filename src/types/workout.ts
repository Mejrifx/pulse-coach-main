/** Opaque id for a program day (e.g. d_<uuid> or legacy day1…abs) */
export type DayKey = string;

export type ExerciseDef = {
  id: string;
  name: string;
  sets: number;
  /** Shown as guidance (e.g. rep ranges per wave) */
  repRange: string;
  notes?: string;
};

export type DayDef = {
  key: DayKey;
  label: string;
  shortLabel: string;
  exercises: ExerciseDef[];
};

export type WorkoutProgramDocument = {
  version: 1;
  days: DayDef[];
};
