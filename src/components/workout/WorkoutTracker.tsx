import { useMemo, useState } from 'react';
import { Info, Save } from 'lucide-react';
import { TRAINING_PROGRAM, PROGRAM_NOTES } from '@/data/trainingProgram';
import { useWorkoutSession } from '@/hooks/useWorkoutSession';
import { formatLocalDate } from '@/lib/localDate';
import type { DayKey } from '@/types/workout';

const DAY_TABS: { key: DayKey; label: string }[] = [
  { key: 'day1', label: 'D1' },
  { key: 'day2', label: 'D2' },
  { key: 'day3', label: 'D3' },
  { key: 'day4', label: 'D4' },
  { key: 'abs', label: 'Abs' },
];

export function WorkoutTracker() {
  const [sessionDate, setSessionDate] = useState(() => formatLocalDate(new Date()));
  const [activeDay, setActiveDay] = useState<DayKey>('day1');

  const { values, setCell, loading, saving, save } = useWorkoutSession(activeDay, sessionDate);

  const dayDef = useMemo(
    () => TRAINING_PROGRAM.find((d) => d.key === activeDay),
    [activeDay],
  );

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-stone-800 bg-neutral-900/40 p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-stone-100">Session</h2>
            <p className="mt-1 text-sm text-stone-500">
              Pick the calendar date and training day, log weight (kg) and reps per set, then save.
            </p>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-stone-500">Date</span>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="rounded-lg border border-stone-700 bg-neutral-950 px-3 py-2 text-stone-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {DAY_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveDay(t.key)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeDay === t.key
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'border border-stone-700 bg-neutral-950 text-stone-400 hover:border-stone-600 hover:text-stone-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <aside className="rounded-xl border border-stone-800/80 bg-stone-900/30 p-4">
        <div className="flex gap-2 text-stone-400">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500/80" aria-hidden />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Programme notes
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-stone-400">
              {PROGRAM_NOTES.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {loading ? (
        <p className="text-sm text-stone-500">Loading session…</p>
      ) : dayDef ? (
        <section className="space-y-6">
          <div className="flex flex-col gap-2 border-b border-stone-800 pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-stone-50">{dayDef.label}</h3>
              <p className="text-sm text-stone-500">Enter numbers for each set; empty cells stay blank.</p>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => void save()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 disabled:opacity-60"
            >
              <Save className="h-4 w-4" aria-hidden />
              {saving ? 'Saving…' : 'Save workout'}
            </button>
          </div>

          <div className="space-y-8">
            {dayDef.exercises.map((ex) => (
              <article
                key={ex.id}
                className="rounded-2xl border border-stone-800 bg-neutral-950/60 p-4 md:p-5"
              >
                <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                  <h4 className="font-medium text-stone-100">{ex.name}</h4>
                  <span className="text-sm text-emerald-500/90">{ex.repRange}</span>
                </div>
                {ex.notes ? (
                  <p className="mb-3 text-xs text-stone-500">{ex.notes}</p>
                ) : null}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: ex.sets }, (_, i) => {
                    const k = `${ex.id}-${i}`;
                    const cell = values[k] ?? { weight: '', reps: '' };
                    return (
                      <div
                        key={k}
                        className="rounded-xl border border-stone-800/80 bg-neutral-900/50 p-3"
                      >
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-500">
                          Set {i + 1}
                        </p>
                        <div className="flex gap-2">
                          <label className="flex-1 text-xs">
                            <span className="text-stone-500">kg</span>
                            <input
                              type="text"
                              inputMode="decimal"
                              placeholder="—"
                              value={cell.weight}
                              onChange={(e) => setCell(ex.id, i, 'weight', e.target.value)}
                              className="mt-1 w-full rounded-lg border border-stone-700 bg-neutral-950 px-2 py-1.5 text-stone-100 outline-none focus:border-emerald-500"
                            />
                          </label>
                          <label className="flex-1 text-xs">
                            <span className="text-stone-500">reps</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="—"
                              value={cell.reps}
                              onChange={(e) => setCell(ex.id, i, 'reps', e.target.value)}
                              className="mt-1 w-full rounded-lg border border-stone-700 bg-neutral-950 px-2 py-1.5 text-stone-100 outline-none focus:border-emerald-500"
                            />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
