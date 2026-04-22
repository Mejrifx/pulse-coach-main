import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import type { WorkoutProgramDocument } from '@/types/workout';
import {
  createEmptyWorkoutProgram,
  isProgramUsable,
  parseWorkoutProgramJson,
} from '@/lib/workoutProgram';

type Status = { loading: boolean; error: string | null };

export function useUserWorkoutProgram() {
  const { user } = useAuth();
  const [program, setProgram] = useState<WorkoutProgramDocument | null>(null);
  const [status, setStatus] = useState<Status>({ loading: true, error: null });

  const load = useCallback(async () => {
    if (!supabase || !user) {
      setProgram(null);
      setStatus({ loading: false, error: null });
      return;
    }
    setStatus((s) => ({ ...s, loading: true, error: null }));
    const { data, error } = await supabase
      .from('user_workout_programs')
      .select('program')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error(error);
      setProgram(null);
      setStatus({ loading: false, error: 'Could not load your program.' });
      return;
    }

    const raw = data?.program;
    const parsed = parseWorkoutProgramJson(raw);
    if (raw != null && parsed === null) {
      console.warn('user_workout_programs.program was invalid; resetting to empty');
      setProgram(createEmptyWorkoutProgram());
      setStatus({ loading: false, error: null });
      return;
    }
    setProgram(parsed ?? createEmptyWorkoutProgram());
    setStatus({ loading: false, error: null });
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const saveProgram = useCallback(
    async (next: WorkoutProgramDocument) => {
      if (!supabase || !user) {
        return { ok: false as const, error: 'Not signed in.' };
      }
      if (!isProgramUsable(next)) {
        return { ok: false as const, error: 'Program is not valid.' };
      }
      const { error } = await supabase.from('user_workout_programs').upsert(
        {
          user_id: user.id,
          program: next,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      );
      if (error) {
        console.error(error);
        return { ok: false as const, error: 'Could not save your program. Try again.' };
      }
      setProgram(next);
      return { ok: true as const };
    },
    [user],
  );

  const hasProgram = program != null && isProgramUsable(program);

  return {
    program,
    hasProgram,
    loading: status.loading,
    error: status.error,
    refetch: load,
    saveProgram,
  };
}
