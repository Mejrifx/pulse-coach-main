import { Calendar } from 'lucide-react';
import { getDayByKey } from '@/data/trainingProgram';
import { formatSessionDateLabel } from '@/lib/localDate';
import type { WorkoutSessionSummary } from '@/hooks/useWorkoutHistory';
import type { DayKey } from '@/types/workout';

type Props = {
  sessions: WorkoutSessionSummary[];
  loading: boolean;
  activeDate: string;
  activeDay: DayKey;
  onOpen: (date: string, day: DayKey) => void;
};

export function WorkoutHistoryPanel({
  sessions,
  loading,
  activeDate,
  activeDay,
  onOpen,
}: Props) {
  return (
    <section className="rounded-2xl border border-stone-800 bg-neutral-900/40 p-5 md:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-stone-700 bg-neutral-950">
          <Calendar className="h-5 w-5 text-emerald-500/90" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-stone-100">Saved workouts</h2>
          <p className="mt-1 text-sm text-stone-500">
            Stored in your Supabase project (<code className="rounded bg-neutral-950 px-1 text-stone-400">
              workout_sessions
            </code>
            ). Tap a row to load that day and date in the log below.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-stone-500">Loading history…</p>
      ) : sessions.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-stone-700 bg-neutral-950/50 px-4 py-6 text-center text-sm text-stone-500">
          No saved sessions yet. Log a workout and hit <strong className="text-stone-400">Save workout</strong>.
        </p>
      ) : (
        <ul className="mt-4 max-h-[min(360px,50vh)] divide-y divide-stone-800 overflow-y-auto rounded-xl border border-stone-800/80">
          {sessions.map((s) => {
            const day = getDayByKey(s.day_key);
            const label = day?.label ?? s.day_key;
            const isActive = s.session_date === activeDate && s.day_key === activeDay;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onOpen(s.session_date, s.day_key)}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors ${
                    isActive
                      ? 'bg-emerald-950/40 text-stone-100'
                      : 'text-stone-300 hover:bg-stone-800/50'
                  }`}
                >
                  <span className="font-medium text-stone-200">
                    {formatSessionDateLabel(s.session_date)}
                  </span>
                  <span className="shrink-0 text-stone-500">{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
