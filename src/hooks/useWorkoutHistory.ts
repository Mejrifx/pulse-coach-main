import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import type { DayKey } from '@/types/workout';

export type WorkoutSessionSummary = {
  id: string;
  session_date: string;
  day_key: DayKey;
  updated_at: string;
};

const DEFAULT_DAY_ORDER = ['day1', 'day2', 'day3', 'day4', 'abs'] as const;

/** Order for same-day tie-break; keys not in the list sort last. */
export function useWorkoutHistory(
  refreshKey: number,
  dayOrder: readonly string[] = DEFAULT_DAY_ORDER,
) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<WorkoutSessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!supabase || !user) {
        setSessions([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('id, session_date, day_key, updated_at')
        .eq('user_id', user.id)
        .order('session_date', { ascending: false })
        .limit(120);

      if (cancelled) return;

      if (error) {
        console.error(error);
        setSessions([]);
        setLoading(false);
        return;
      }

      const rank = (k: string) => {
        const i = dayOrder.indexOf(k);
        return i === -1 ? 999 : i;
      };
      const rows = (data ?? []) as WorkoutSessionSummary[];
      rows.sort((a, b) => {
        if (a.session_date !== b.session_date) {
          return b.session_date.localeCompare(a.session_date);
        }
        return rank(b.day_key) - rank(a.day_key);
      });
      setSessions(rows);
      setLoading(false);
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [user, refreshKey, dayOrder]);

  return { sessions, loading };
}
