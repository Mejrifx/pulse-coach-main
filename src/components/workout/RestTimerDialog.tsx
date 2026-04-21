import { useEffect, useId, useState } from 'react';
import { BellOff, Check, Pause, Play, RotateCcw, Timer } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OPTIMAL_REST_BETWEEN_SETS_SEC, REST_TIMER_PRESETS } from '@/constants/restTimer';
import type { RestTimerApi } from '@/hooks/useRestTimer';
import { cn } from '@/lib/utils';

type TimerApi = RestTimerApi;

function formatClock(totalSec: number) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

type RestTimerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timer: TimerApi;
};

export function RestTimerDialog({ open, onOpenChange, timer }: RestTimerDialogProps) {
  const {
    durationSec,
    remainingSec,
    status,
    alarmPlaying,
    applyPreset,
    start,
    pause,
    resume,
    reset,
    stopAlarm,
  } = timer;
  const reducedMotion = usePrefersReducedMotion();
  const labelId = useId();
  const presetsLocked = status === 'running' || status === 'paused';

  const progress =
    status === 'done'
      ? 1
      : durationSec > 0
        ? Math.max(0, Math.min(1, remainingSec / durationSec))
        : 0;
  const radius = 44;
  const c = 2 * Math.PI * radius;
  const dashOffset = c * (1 - progress);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-labelledby={labelId}
        className="gap-0 border-stone-800 bg-neutral-900/95 p-0 shadow-2xl sm:max-w-[22rem]"
        showCloseButton
      >
        <div className="border-b border-stone-800/80 px-6 pb-4 pt-6">
          <DialogHeader className="gap-1 text-center sm:text-center">
            <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/30">
              <Timer className="h-5 w-5 text-emerald-400" aria-hidden />
            </div>
            <DialogTitle id={labelId} className="text-xl text-stone-50">
              Rest between sets
            </DialogTitle>
            <DialogDescription className="text-stone-400">
              Default {formatClock(OPTIMAL_REST_BETWEEN_SETS_SEC)} matches most accessory work; use
              longer presets for heavy compounds (see program notes).
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex flex-col items-center px-6 pb-2 pt-6">
          <div
            className="relative flex aspect-square w-[min(100%,220px)] items-center justify-center"
            role="timer"
            aria-live="polite"
            aria-atomic="true"
            aria-label={`Rest timer, ${formatClock(remainingSec)} remaining`}
          >
            <svg
              className="absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 100 100"
              aria-hidden
            >
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-stone-800"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                className={cn(
                  'text-emerald-500 transition-[stroke-dashoffset] duration-1000 ease-linear',
                  reducedMotion && 'transition-none',
                  status === 'done' && 'text-emerald-400/90',
                )}
                style={{
                  strokeDasharray: c,
                  strokeDashoffset: dashOffset,
                }}
              />
            </svg>
            <div className="relative z-10 flex flex-col items-center gap-1">
              <span className="font-mono text-5xl font-semibold tabular-nums tracking-tight text-stone-50">
                {formatClock(remainingSec)}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                {status === 'done'
                  ? 'Time'
                  : status === 'paused'
                    ? 'Paused'
                    : status === 'running'
                      ? 'Resting'
                      : 'Ready'}
              </span>
            </div>
          </div>

          {status === 'done' ? (
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-400/95">
              <Check className="h-4 w-4 shrink-0" aria-hidden />
              Time&apos;s up — next set
            </p>
          ) : (
            <p className="mt-4 text-center text-xs text-stone-500">
              {presetsLocked ? 'Pause or reset to change duration' : 'Tap a preset or start'}
            </p>
          )}
        </div>

        <div className="px-6 pb-4">
          <p className="mb-2 text-center text-[11px] font-medium uppercase tracking-wider text-stone-500">
            Duration
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {REST_TIMER_PRESETS.map((p) => {
              const active = durationSec === p.seconds;
              return (
                <button
                  key={p.seconds}
                  type="button"
                  disabled={presetsLocked}
                  onClick={() => applyPreset(p.seconds)}
                  className={cn(
                    'cursor-pointer rounded-xl border px-2 py-2.5 text-center text-sm font-semibold transition-colors',
                    active
                      ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200'
                      : 'border-stone-800 bg-neutral-950/80 text-stone-300 hover:border-stone-700 hover:bg-stone-900/80',
                    presetsLocked && 'cursor-not-allowed opacity-50',
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-stone-800/80 px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {alarmPlaying ? (
            <button
              type="button"
              onClick={stopAlarm}
              className="cursor-pointer inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-amber-500/35 bg-amber-500/15 px-4 text-sm font-semibold text-amber-100 transition-colors hover:bg-amber-500/25"
            >
              <BellOff className="h-4 w-4" aria-hidden />
              Stop alarm
            </button>
          ) : null}
          <div className="grid grid-cols-2 gap-2">
            {status === 'running' ? (
              <button
                type="button"
                onClick={pause}
                className="cursor-pointer inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-stone-700 bg-stone-900/90 px-4 text-sm font-semibold text-stone-100 transition-colors hover:bg-stone-800"
              >
                <Pause className="h-4 w-4" aria-hidden />
                Pause
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (status === 'paused') resume();
                  else start();
                }}
                className="cursor-pointer inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/20 px-4 text-sm font-semibold text-emerald-100 transition-colors hover:bg-emerald-500/30"
              >
                <Play className="h-4 w-4" aria-hidden />
                {status === 'paused' ? 'Resume' : status === 'done' ? 'Start again' : 'Start'}
              </button>
            )}
            <button
              type="button"
              onClick={reset}
              className="cursor-pointer inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-stone-700 bg-neutral-950 px-4 text-sm font-semibold text-stone-200 transition-colors hover:bg-stone-900"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
