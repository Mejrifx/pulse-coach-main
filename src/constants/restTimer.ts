/**
 * Default rest between sets — aligns with PROGRAM_NOTES isolation band (60–90s)
 * and works as a single “ready to go” preset for most accessories.
 */
export const OPTIMAL_REST_BETWEEN_SETS_SEC = 90;

export const REST_TIMER_PRESETS = [
  { seconds: 60, label: '1 min' },
  { seconds: 90, label: '1:30' },
  { seconds: 120, label: '2 min' },
  { seconds: 180, label: '3 min' },
] as const;
