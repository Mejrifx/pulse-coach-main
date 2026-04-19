export type DayKey = 'day1' | 'day2' | 'day3' | 'day4' | 'abs';

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
