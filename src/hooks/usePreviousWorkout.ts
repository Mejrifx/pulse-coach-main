import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import type { DayKey } from '@/types/workout';
import type { SetInput } from '@/hooks/useWorkoutSession';

type PrevWorkout = {
  sessionDate: string;
  dayKey: DayKey;
  values: Record<string, SetInput>;
};

function cellKey(exerciseId: string, setIndex: number) {
  return `${exerciseId}-${setIndex}`;
}

/**
 * Loads the most recent workout BEFORE `sessionDate` for the same `dayKey`.
 * Used to show “last time” comparisons inline.
 */
export function usePreviousWorkout(dayKey: DayKey, sessionDate: string, refreshKey: number) {
  const { user } = useAuth();
  const [data, setData] = useState<PrevWorkout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!supabase || !user) {
        setData(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data: prevSession, error: sErr } = await supabase
        .from('workout_sessions')
        .select('id, session_date, day_key')
        .eq('user_id', user.id)
        .eq('day_key', dayKey)
        .lt('session_date', sessionDate)
        .order('session_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;

      if (sErr) {
        console.error(sErr);
        setData(null);
        setLoading(false);
        return;
      }

      if (!prevSession) {
        setData(null);
        setLoading(false);
        return;
      }

      const { data: rows, error: rErr } = await supabase
        .from('workout_sets')
        .select('exercise_id, set_index, weight_kg, reps')
        .eq('session_id', prevSession.id);

      if (cancelled) return;

      if (rErr) {
        console.error(rErr);
        setData(null);
        setLoading(false);
        return;
      }

      const values: Record<string, SetInput> = {};
      rows?.forEach((r) => {
        values[cellKey(r.exercise_id, r.set_index)] = {
          weight: r.weight_kg != null ? String(r.weight_kg) : '',
          reps: r.reps != null ? String(r.reps) : '',
        };
      });

      setData({
        sessionDate: prevSession.session_date,
        dayKey: prevSession.day_key,
        values,
      });
      setLoading(false);
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [user, dayKey, sessionDate, refreshKey]);

  return { data, loading };
}

