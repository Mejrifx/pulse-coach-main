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

const DAY_SORT: Record<DayKey, number> = {
  day1: 1,
  day2: 2,
  day3: 3,
  day4: 4,
  abs: 5,
};

/** `refreshKey` — bump after a save so the list reloads. */
export function useWorkoutHistory(refreshKey: number) {
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

      const rows = (data ?? []) as WorkoutSessionSummary[];
      rows.sort((a, b) => {
        if (a.session_date !== b.session_date) {
          return b.session_date.localeCompare(a.session_date);
        }
        return (DAY_SORT[b.day_key] ?? 0) - (DAY_SORT[a.day_key] ?? 0);
      });
      setSessions(rows);
      setLoading(false);
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [user, refreshKey]);

  return { sessions, loading };
}
