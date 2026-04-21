import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, ChevronUp, History, Info, Save } from 'lucide-react';
import { TRAINING_PROGRAM, PROGRAM_NOTES } from '@/data/trainingProgram';
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory';
import { usePreviousWorkout } from '@/hooks/usePreviousWorkout';
import { useWorkoutSession } from '@/hooks/useWorkoutSession';
import { useWorkoutSaveBridge } from '@/contexts/WorkoutSaveBridgeContext';
import { formatLocalDate, formatSessionDateLabel } from '@/lib/localDate';
import { getDayByKey } from '@/data/trainingProgram';
import { cn } from '@/lib/utils';
import type { DayKey } from '@/types/workout';

const DAY_TABS: { key: DayKey; label: string }[] = [
  { key: 'day1', label: 'D1' },
  { key: 'day2', label: 'D2' },
  { key: 'day3', label: 'D3' },
  { key: 'day4', label: 'D4' },
  { key: 'abs', label: 'Abs' },
];

export function WorkoutTracker() {
  const { register } = useWorkoutSaveBridge();
  const [sessionDate, setSessionDate] = useState(() => formatLocalDate(new Date()));
  const [activeDay, setActiveDay] = useState<DayKey>('day1');
  const [historyKey, setHistoryKey] = useState(0);
  const bumpHistory = useCallback(() => setHistoryKey((k) => k + 1), []);
  
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(null);
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set());
  const exerciseRefs = useRef<Record<string, HTMLElement | null>>({});

  const { sessions: historySessions, loading: historyLoading } = useWorkoutHistory(historyKey);

  const { values, setCell, isSavedSession, loading, saving, save } = useWorkoutSession(
    activeDay,
    sessionDate,
    { onSaved: bumpHistory },
  );

  useEffect(() => {
    register({
      save: () => void save(),
      saving,
      loading,
    });
    return () => register(null);
  }, [register, save, saving, loading]);

  const dayDef = useMemo(
    () => TRAINING_PROGRAM.find((d) => d.key === activeDay),
    [activeDay],
  );

  const openSession = useCallback((date: string, day: DayKey) => {
    setSessionDate(date);
    setActiveDay(day);
    setCompletedExercises(new Set());
    setCurrentExerciseId(null);
    setExpandedExercises(new Set());
  }, []);

  const toggleExerciseComplete = useCallback((exerciseId: string) => {
    setCompletedExercises((prev) => {
      const next = new Set(prev);
      if (next.has(exerciseId)) {
        next.delete(exerciseId);
        // When uncompleting, expand it
        setExpandedExercises((exp) => {
          const nextExp = new Set(exp);
          nextExp.add(exerciseId);
          return nextExp;
        });
      } else {
        next.add(exerciseId);
        // When completing, collapse it
        setExpandedExercises((exp) => {
          const nextExp = new Set(exp);
          nextExp.delete(exerciseId);
          return nextExp;
        });
        // Auto-scroll to next incomplete after a brief delay
        setTimeout(() => {
          const nextIncomplete = dayDef?.exercises.find(
            (ex) => !next.has(ex.id) && ex.id !== exerciseId
          );
          if (nextIncomplete) {
            setCurrentExerciseId(nextIncomplete.id);
            exerciseRefs.current[nextIncomplete.id]?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
        }, 300);
      }
      return next;
    });
  }, [dayDef]);

  const toggleExpanded = useCallback((exerciseId: string) => {
    setExpandedExercises((prev) => {
      const next = new Set(prev);
      if (next.has(exerciseId)) {
        next.delete(exerciseId);
      } else {
        next.add(exerciseId);
      }
      return next;
    });
  }, []);

  const scrollToExercise = useCallback((exerciseId: string) => {
    setCurrentExerciseId(exerciseId);
    exerciseRefs.current[exerciseId]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, []);

  const { data: prev, loading: prevLoading } = usePreviousWorkout(activeDay, sessionDate, historyKey);

  const status = isSavedSession ? 'Saved workout' : 'New workout';

  const lastTimeLabel = useMemo(() => {
    if (!prev) return null;
    const d = getDayByKey(prev.dayKey);
    return `${formatSessionDateLabel(prev.sessionDate)} • ${d?.shortLabel ?? prev.dayKey}`;
  }, [prev]);

  const progressStats = useMemo(() => {
    if (!dayDef) return { completed: 0, total: 0, percentage: 0 };
    const total = dayDef.exercises.length;
    const completed = dayDef.exercises.filter((ex) => completedExercises.has(ex.id)).length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  }, [dayDef, completedExercises]);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-stone-800 bg-neutral-900/40 p-5 md:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Current workout
              </p>
              <h2 className="mt-1 text-lg font-semibold text-stone-100">
                {formatSessionDateLabel(sessionDate)}
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Status:{' '}
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                    isSavedSession
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-stone-700 bg-neutral-950 text-stone-400'
                  }`}
                >
                  {status}
                </span>
              </p>
            </div>

            <label className="flex shrink-0 flex-col gap-1 text-sm">
              <span className="text-stone-500">Date</span>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="rounded-lg border border-stone-700 bg-neutral-950 px-3 py-2 text-stone-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {DAY_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveDay(t.key)}
                className={`touch-manipulation rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeDay === t.key
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'border border-stone-700 bg-neutral-950 text-stone-400 hover:border-stone-600 hover:text-stone-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-stone-800 bg-neutral-950/60 p-4">
            <p className="text-sm text-stone-400">
              {isSavedSession ? (
                <>
                  You're <strong className="text-stone-200">viewing a saved workout</strong>. Edit
                  numbers and hit <strong className="text-stone-200">Save workout</strong> to
                  overwrite this session.
                </>
              ) : (
                <>
                  You're starting a <strong className="text-stone-200">new workout</strong> for this
                  date/day. It won't show in history until you save.
                </>
              )}
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-stone-500">
                {prevLoading ? (
                  <>Loading last time…</>
                ) : lastTimeLabel ? (
                  <>
                    Last time for this day: <span className="text-stone-300">{lastTimeLabel}</span>
                  </>
                ) : (
                  <>No previous session for this day yet.</>
                )}
              </div>
              {prev ? (
                <button
                  type="button"
                  onClick={() => openSession(prev.sessionDate, prev.dayKey)}
                  className="touch-manipulation inline-flex items-center justify-center rounded-lg border border-stone-700 bg-neutral-950 px-3 py-2 text-sm text-stone-200 hover:bg-stone-800/60"
                >
                  Open last time
                </button>
              ) : null}
            </div>
          </div>
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
          {/* Progress indicator */}
          <div className="sticky top-[120px] z-10 rounded-2xl border border-stone-800 bg-neutral-900/95 p-4 backdrop-blur-xl md:top-[130px]">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-stone-50">{dayDef.label}</h3>
                <p className="text-xs text-stone-500">
                  {progressStats.completed} of {progressStats.total} exercises complete
                </p>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={() => void save()}
                className="touch-manipulation inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 disabled:opacity-60"
              >
                <Save className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">{saving ? 'Saving…' : 'Save'}</span>
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-stone-800">
              <div
                className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                style={{ width: `${progressStats.percentage}%` }}
              />
            </div>

            {/* Quick jump nav */}
            <div className="scrollbar-thin mt-3 flex gap-1.5 overflow-x-auto pb-1">
              {dayDef.exercises.map((ex, idx) => {
                const isCompleted = completedExercises.has(ex.id);
                const isCurrent = currentExerciseId === ex.id;
                return (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => scrollToExercise(ex.id)}
                    className={cn(
                      'touch-manipulation shrink-0 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors',
                      isCurrent && 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-neutral-900',
                      isCompleted
                        ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                        : 'border-stone-800 bg-neutral-950 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                    )}
                    aria-label={`Jump to ${ex.name}`}
                    title={ex.name}
                  >
                    {idx + 1}
                    {isCompleted && <Check className="ml-1 inline h-3 w-3" aria-hidden />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            {dayDef.exercises.map((ex) => {
              const isCompleted = completedExercises.has(ex.id);
              const isCurrent = currentExerciseId === ex.id;
              const isExpanded = expandedExercises.has(ex.id) || !isCompleted;

              return (
                <article
                  key={ex.id}
                  ref={(el) => {
                    exerciseRefs.current[ex.id] = el;
                  }}
                  className={cn(
                    'rounded-2xl border p-4 transition-all duration-300 md:p-5',
                    isCurrent && !isCompleted
                      ? 'border-emerald-500/50 bg-emerald-500/5 shadow-lg shadow-emerald-500/10'
                      : isCompleted
                        ? 'border-stone-800/60 bg-neutral-950/40'
                        : 'border-stone-800 bg-neutral-950/60'
                  )}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleExerciseComplete(ex.id)}
                        className={cn(
                          'touch-manipulation mt-0.5 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 transition-colors',
                          isCompleted
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-stone-700 bg-neutral-950 hover:border-emerald-500/50'
                        )}
                        aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {isCompleted && <Check className="h-4 w-4" aria-hidden />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <h4
                          className={cn(
                            'font-medium',
                            isCompleted ? 'text-stone-400 line-through' : 'text-stone-100'
                          )}
                        >
                          {ex.name}
                        </h4>
                        <span className="text-sm text-emerald-500/90">{ex.repRange}</span>
                        {ex.notes ? (
                          <p className="mt-1 text-xs text-stone-500">{ex.notes}</p>
                        ) : null}
                      </div>
                    </div>
                    {isCompleted && (
                      <button
                        type="button"
                        onClick={() => toggleExpanded(ex.id)}
                        className="touch-manipulation flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-stone-500 hover:bg-stone-800/50 hover:text-stone-300"
                        aria-label={isExpanded ? 'Collapse exercise' : 'Expand exercise'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" aria-hidden />
                        ) : (
                          <ChevronDown className="h-4 w-4" aria-hidden />
                        )}
                      </button>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {Array.from({ length: ex.sets }, (_, i) => {
                        const k = `${ex.id}-${i}`;
                        const cell = values[k] ?? { weight: '', reps: '' };
                        const prevCell = prev?.values?.[k];
                        const prevText =
                          prevCell && (prevCell.weight || prevCell.reps)
                            ? `${prevCell.weight || '—'}kg × ${prevCell.reps || '—'}`
                            : null;
                        return (
                          <div
                            key={k}
                            className="rounded-xl border border-stone-800/80 bg-neutral-900/50 p-3"
                          >
                            <div className="mb-2 flex items-center justify-between gap-2">
                              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                                Set {i + 1}
                              </p>
                              {prevText ? (
                                <p className="text-[11px] text-stone-500">
                                  Last: <span className="text-stone-400">{prevText}</span>
                                </p>
                              ) : null}
                            </div>
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
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      <details className="group rounded-2xl border border-stone-800 bg-neutral-900/40 p-5 md:p-6">
        <summary className="touch-manipulation flex cursor-pointer list-none items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-emerald-500/90" aria-hidden />
            <span className="text-sm font-semibold text-stone-100">Past workouts</span>
            <span className="rounded-full border border-stone-700 bg-neutral-950 px-2 py-0.5 text-xs text-stone-500">
              {historyLoading ? '…' : historySessions.length}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-stone-500 transition-transform group-open:rotate-180" aria-hidden />
        </summary>

        <p className="mt-3 text-sm text-stone-500">
          These are your saved sessions. Open one to compare or edit it.
        </p>

        {historyLoading ? (
          <p className="mt-4 text-sm text-stone-500">Loading…</p>
        ) : historySessions.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-stone-700 bg-neutral-950/50 px-4 py-6 text-center text-sm text-stone-500">
            No saved sessions yet.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-stone-800 overflow-hidden rounded-xl border border-stone-800/80">
            {historySessions.slice(0, 40).map((s) => {
              const day = getDayByKey(s.day_key);
              const isActive = s.session_date === sessionDate && s.day_key === activeDay;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => openSession(s.session_date, s.day_key)}
                    className={`touch-manipulation flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors ${
                      isActive
                        ? 'bg-emerald-950/40 text-stone-100'
                        : 'text-stone-300 hover:bg-stone-800/50'
                    }`}
                  >
                    <span className="font-medium text-stone-200">
                      {formatSessionDateLabel(s.session_date)}
                    </span>
                    <span className="shrink-0 text-stone-500">
                      {day?.shortLabel ?? s.day_key}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {historySessions.length > 40 ? (
          <p className="mt-3 text-xs text-stone-600">
            Showing the most recent 40 sessions.
          </p>
        ) : null}
      </details>
    </div>
  );
}
