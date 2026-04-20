import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export type SupplementRow = {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  start_date: string; // YYYY-MM-DD
  created_at: string;
  updated_at: string;
};

export function useSupplements(refreshKey: number) {
  const { user } = useAuth();
  const [rows, setRows] = useState<SupplementRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!supabase || !user) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('supplements')
      .select('id, user_id, name, dosage, start_date, created_at, updated_at')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      setRows([]);
      setLoading(false);
      return;
    }
    setRows((data ?? []) as SupplementRow[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  const add = useCallback(
    async (input: { name: string; dosage: string; start_date: string }) => {
      if (!supabase || !user) {
        toast.error('Not signed in or Supabase not configured.');
        return false;
      }
      const name = input.name.trim();
      const dosage = input.dosage.trim();
      const start_date = input.start_date;
      if (!name) {
        toast.error('Enter supplement name.');
        return false;
      }
      if (!dosage) {
        toast.error('Enter dosage.');
        return false;
      }
      if (!start_date) {
        toast.error('Choose start date.');
        return false;
      }

      setBusy(true);
      const { error } = await supabase.from('supplements').insert({
        user_id: user.id,
        name,
        dosage,
        start_date,
      });
      setBusy(false);
      if (error) {
        console.error(error);
        toast.error('Could not save. Run the supplements SQL migration in Supabase.');
        return false;
      }
      toast.success('Supplement added');
      await load();
      return true;
    },
    [user, load],
  );

  const remove = useCallback(
    async (id: string) => {
      if (!supabase || !user) return;
      setBusy(true);
      const { error } = await supabase.from('supplements').delete().eq('id', id).eq('user_id', user.id);
      setBusy(false);
      if (error) {
        console.error(error);
        toast.error('Could not delete.');
        return;
      }
      toast.success('Removed');
      await load();
    },
    [user, load],
  );

  const byId = useMemo(() => new Map(rows.map((r) => [r.id, r])), [rows]);

  return { rows, byId, loading, busy, add, remove, reload: load };
}

