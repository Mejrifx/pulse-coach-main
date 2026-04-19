import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { getDayByKey } from '@/data/trainingProgram';
import type { DayKey } from '@/types/workout';

export type SetInput = { weight: string; reps: string };

function cellKey(exerciseId: string, setIndex: number) {
  return `${exerciseId}-${setIndex}`;
}

export function useWorkoutSession(dayKey: DayKey, sessionDate: string) {
  const { user } = useAuth();
  const [values, setValues] = useState<Record<string, SetInput>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!supabase || !user) {
      setValues({});
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data: session, error: sErr } = await supabase
      .from('workout_sessions')
      .select('id')
      .eq('user_id', user.id)
      .eq('session_date', sessionDate)
      .eq('day_key', dayKey)
      .maybeSingle();

    if (sErr) {
      console.error(sErr);
      setLoading(false);
      return;
    }

    if (!session) {
      setValues({});
      setLoading(false);
      return;
    }

    const { data: rows, error: rErr } = await supabase
      .from('workout_sets')
      .select('exercise_id, set_index, weight_kg, reps')
      .eq('session_id', session.id);

    if (rErr) {
      console.error(rErr);
      setLoading(false);
      return;
    }

    const next: Record<string, SetInput> = {};
    rows?.forEach((r) => {
      const k = cellKey(r.exercise_id, r.set_index);
      next[k] = {
        weight: r.weight_kg != null ? String(r.weight_kg) : '',
        reps: r.reps != null ? String(r.reps) : '',
      };
    });
    setValues(next);
    setLoading(false);
  }, [user, dayKey, sessionDate]);

  useEffect(() => {
    void load();
  }, [load]);

  const setCell = useCallback(
    (exerciseId: string, setIndex: number, field: 'weight' | 'reps', val: string) => {
      const k = cellKey(exerciseId, setIndex);
      setValues((prev) => ({
        ...prev,
        [k]: { ...(prev[k] ?? { weight: '', reps: '' }), [field]: val },
      }));
    },
    [],
  );

  const save = useCallback(async () => {
    if (!supabase || !user) {
      toast.error('Not signed in or Supabase not configured.');
      return;
    }
    const day = getDayByKey(dayKey);
    if (!day) return;

    setSaving(true);
    try {
      const { data: upserted, error: uErr } = await supabase
        .from('workout_sessions')
        .upsert(
          {
            user_id: user.id,
            session_date: sessionDate,
            day_key: dayKey,
          },
          { onConflict: 'user_id,session_date,day_key' },
        )
        .select('id')
        .single();

      if (uErr) throw uErr;
      const sid = upserted.id;

      const { error: dErr } = await supabase.from('workout_sets').delete().eq('session_id', sid);
      if (dErr) throw dErr;

      const batch: {
        session_id: string;
        exercise_id: string;
        set_index: number;
        weight_kg: number | null;
        reps: number | null;
      }[] = [];

      for (const ex of day.exercises) {
        for (let i = 0; i < ex.sets; i++) {
          const k = cellKey(ex.id, i);
          const cell = values[k] ?? { weight: '', reps: '' };
          const wRaw = cell.weight.trim();
          const rRaw = cell.reps.trim();
          const w = wRaw === '' ? null : Number.parseFloat(wRaw);
          const r = rRaw === '' ? null : Number.parseInt(rRaw, 10);
          batch.push({
            session_id: sid,
            exercise_id: ex.id,
            set_index: i,
            weight_kg: w != null && !Number.isNaN(w) ? w : null,
            reps: r != null && !Number.isNaN(r) ? r : null,
          });
        }
      }

      if (batch.length > 0) {
        const { error: iErr } = await supabase.from('workout_sets').insert(batch);
        if (iErr) throw iErr;
      }

      toast.success('Workout saved');
      await load();
    } catch (e) {
      console.error(e);
      toast.error(
        'Could not save. Run the workout SQL migration in Supabase (see supabase/migrations).',
      );
    } finally {
      setSaving(false);
    }
  }, [user, dayKey, sessionDate, values, load]);

  return { values, setCell, loading, saving, save, reload: load };
}
