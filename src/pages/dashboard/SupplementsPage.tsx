import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { formatLocalDate, formatSessionDateLabel, daysSince } from '@/lib/localDate';
import { useSupplements } from '@/hooks/useSupplements';
import { FlaskConical, Plus, Trash2 } from 'lucide-react';

function useNowTicker() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export default function SupplementsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { rows, loading, busy, add, remove } = useSupplements(refreshKey);
  const now = useNowTicker();

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [startDate, setStartDate] = useState(() => formatLocalDate(new Date()));

  const sorted = useMemo(() => rows, [rows]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = await add({ name, dosage, start_date: startDate });
    if (!ok) return;
    setName('');
    setDosage('');
    setStartDate(formatLocalDate(new Date()));
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400/90">
            <FlaskConical className="h-5 w-5" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wider">Health</span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-stone-50">Supplements</h1>
          <p className="mt-2 max-w-2xl text-stone-400">
            Track what you’re running right now. Each card shows the start date, dosage, and a live day
            counter.
          </p>
        </div>
      </div>

      {/* Add form */}
      <section className="rounded-2xl border border-stone-800 bg-neutral-900/40 p-5">
        <h2 className="text-sm font-semibold text-stone-100">Add supplement</h2>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="text-stone-500">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-stone-700 bg-neutral-950 px-4 py-3 text-stone-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. Creatine"
                autoComplete="off"
                required
              />
            </label>
            <label className="text-sm">
              <span className="text-stone-500">Dosage</span>
              <input
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-stone-700 bg-neutral-950 px-4 py-3 text-stone-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. 5g daily"
                autoComplete="off"
                required
              />
            </label>
          </div>

          <div className="flex items-end justify-between gap-3">
            <label className="text-sm">
              <span className="text-stone-500">Cycle start date</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1.5 rounded-xl border border-stone-700 bg-neutral-950 px-4 py-3 text-stone-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                required
              />
            </label>

            <button
              type="submit"
              disabled={busy}
              className="touch-manipulation inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 disabled:opacity-60"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add
            </button>
          </div>
        </form>
      </section>

      {/* List */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-stone-100">Current & past cycles</h2>
        {loading ? (
          <p className="text-sm text-stone-500">Loading…</p>
        ) : sorted.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-700 bg-neutral-900/30 p-8 text-center text-sm text-stone-500">
            No supplements yet. Add one above.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {sorted.map((s) => {
              const day = daysSince(s.start_date, now) + 1;
              return (
                <article
                  key={s.id}
                  className="rounded-2xl border border-stone-800 bg-neutral-950/60 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-stone-100">{s.name}</h3>
                      <p className="mt-1 text-sm text-stone-400">{s.dosage}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs text-stone-500">Day</p>
                      <p className="text-2xl font-semibold tabular-nums text-emerald-400">
                        {day}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-stone-800 pt-4">
                    <p className="text-sm text-stone-500">
                      Started <span className="text-stone-300">{formatSessionDateLabel(s.start_date)}</span>
                    </p>
                    <button
                      type="button"
                      className="touch-manipulation inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-stone-700 bg-neutral-950 px-3 py-2 text-sm text-stone-200 hover:bg-stone-800/60"
                      onClick={() => void remove(s.id)}
                      disabled={busy}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

