import type { DayDef, DayKey } from '@/types/workout';

/** 4-day split + abs — structured strength & hypertrophy */
export const TRAINING_PROGRAM: DayDef[] = [
  {
    key: 'day1',
    label: 'Day 1 — Back & Chest',
    shortLabel: 'Back & Chest',
    exercises: [
      { id: 'pull-ups', name: 'Pull-Ups', sets: 2, repRange: '10 (warm-up)', notes: 'Warm-up' },
      { id: 'lat-pulldown', name: 'Lat Pulldown', sets: 3, repRange: '10–15 → 8–10 → 4–8' },
      { id: 'pec-deck', name: 'Pec Deck / Cable Fly', sets: 3, repRange: '12–15 → 8–10 → 4–8' },
      { id: 't-bar-row', name: 'T-Bar / Barbell Row', sets: 3, repRange: '10–15 → 8–10 → 4–8 (+ partials final set)' },
      { id: 'smith-incline', name: 'Smith Incline Press', sets: 3, repRange: '10–15 → 8–10 → 4–8' },
      { id: 'single-arm-row', name: 'Single Arm Row', sets: 2, repRange: '8–10 → 6–8' },
      { id: 'flat-db-press', name: 'Flat Dumbbell Press', sets: 3, repRange: '12–15 → 7–10 → 4–8' },
      { id: 'db-shrugs', name: 'Dumbbell Shrugs', sets: 3, repRange: 'To failure each set' },
      { id: 'rear-delt-finisher', name: 'Rear Delt Finisher', sets: 3, repRange: '10–15' },
    ],
  },
  {
    key: 'day2',
    label: 'Day 2 — Legs',
    shortLabel: 'Legs',
    exercises: [
      { id: 'leg-extension', name: 'Leg Extensions', sets: 3, repRange: '12–15 → 8–10 → 6–8' },
      { id: 'hamstring-curl', name: 'Hamstring Curls', sets: 3, repRange: '12–15 → 8–10 → 6–8' },
      { id: 'hack-squat', name: 'Hack Squats', sets: 3, repRange: '12–15 → 8–10 → 6–8' },
      { id: 'rdl', name: 'Romanian Deadlifts', sets: 3, repRange: '12–15 → 8–10 → 6–8' },
      { id: 'calf-raise', name: 'Calf Raises', sets: 3, repRange: '12–15 → 8–10 → 6–8' },
      { id: 'adductor', name: 'Adductor Machine', sets: 3, repRange: '12–15 → 8–10 → 6–8' },
      { id: 'hip-thrust', name: 'Barbell Hip Thrust', sets: 3, repRange: '12–15 → 8–10 → 6–8' },
      { id: 'back-extension', name: 'Back Extensions', sets: 3, repRange: '12–15 → 8–10 → 6–8' },
    ],
  },
  {
    key: 'day3',
    label: 'Day 3 — Arms',
    shortLabel: 'Arms',
    exercises: [
      { id: 'dips', name: 'Dips', sets: 3, repRange: '12–15 → 10–12 → 6–10' },
      { id: 'chin-ups', name: 'Chin-Ups', sets: 3, repRange: '12–15 → 10–12 → 6–10' },
      { id: 'hammer-curl', name: 'Hammer Curls', sets: 3, repRange: '12–15 → 10–12 → 6–10' },
      { id: 'cable-pushdown', name: 'Cable Tricep Pushdowns', sets: 3, repRange: '12–15 → 10–12 → 6–10' },
      { id: 'concentration-curl', name: 'Concentration Curls', sets: 3, repRange: '12–15 → 10–12 → 6–10' },
      { id: 'overhead-tricep', name: 'Overhead Tricep Extensions', sets: 3, repRange: '12–15 → 10–12 → 6–10' },
    ],
  },
  {
    key: 'day4',
    label: 'Day 4 — Shoulder Dominant',
    shortLabel: 'Shoulders',
    exercises: [
      { id: 'cable-lateral', name: 'Cable Lateral Raises', sets: 3, repRange: '12–15 → 8–10 → 6–8' },
      { id: 'smith-shoulder-press', name: 'Smith Machine Shoulder Press', sets: 3, repRange: '12–15 → 8–10 → 6–8' },
      { id: 'pec-deck-shoulders', name: 'Pec Deck / Cable Fly', sets: 3, repRange: '12–15 → 8–10 → 6–8' },
      { id: 'cable-front-raise', name: 'Cable Front Raises', sets: 3, repRange: '12–15 → 8–10 → 6–8' },
      { id: 'db-lateral-raise', name: 'Dumbbell Lateral Raises', sets: 3, repRange: '12–15 → 8–10 → 6–8' },
      {
        id: 'lateral-drop-set',
        name: 'Lateral Raise Drop Set (optional finisher)',
        sets: 1,
        repRange: 'Optional',
      },
    ],
  },
  {
    key: 'abs',
    label: 'Abs — 2× per week',
    shortLabel: 'Abs',
    exercises: [
      { id: 'leg-raises', name: 'Leg Raises', sets: 3, repRange: 'To failure' },
      { id: 'cable-crunches', name: 'Cable Crunches', sets: 3, repRange: 'To failure' },
      { id: 'planks', name: 'Planks', sets: 3, repRange: 'To failure (time or reps)' },
    ],
  },
];

export const PROGRAM_NOTES = [
  'Weekly rhythm: D1 → D2 → rest → D3 → D4 → rest → repeat.',
  'Minimum 2 rest days per week.',
  'Heavy compounds: 2–3 min rest. Isolation: 60–90 s.',
  'Progress weight or reps weekly. Top of rep range → increase load next week.',
] as const;

export function getDayByKey(key: DayKey): DayDef | undefined {
  return TRAINING_PROGRAM.find((d) => d.key === key);
}
