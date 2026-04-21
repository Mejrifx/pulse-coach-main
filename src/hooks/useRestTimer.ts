import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OPTIMAL_REST_BETWEEN_SETS_SEC } from '@/constants/restTimer';

export type RestTimerStatus = 'idle' | 'running' | 'paused' | 'done';

const ALARM_MAX_MS = 10_000;

export function useRestTimer() {
  const [durationSec, setDurationSec] = useState(OPTIMAL_REST_BETWEEN_SETS_SEC);
  const [remainingSec, setRemainingSec] = useState(OPTIMAL_REST_BETWEEN_SETS_SEC);
  const [status, setStatus] = useState<RestTimerStatus>('idle');
  const [alarmPlaying, setAlarmPlaying] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const alarmStopRef = useRef<(() => void) | null>(null);
  const alarmTimeoutRef = useRef<number | null>(null);

  const vibrate = useMemo(
    () =>
      typeof navigator !== 'undefined' && 'vibrate' in navigator
        ? (pattern: number | number[]) => {
            try {
              navigator.vibrate(pattern);
            } catch {
              /* ignore */
            }
          }
        : null,
    [],
  );

  const ensureAudioContext = useCallback(async () => {
    if (typeof window === 'undefined') return null;
    const AnyAudioContext = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AnyAudioContext) return null;
    if (!audioCtxRef.current) audioCtxRef.current = new AnyAudioContext();
    const ctx = audioCtxRef.current;
    try {
      if (ctx.state === 'suspended') await ctx.resume();
    } catch {
      // iOS can throw if not from a user gesture; we still keep the ctx around
    }
    return ctx;
  }, []);

  const stopAlarm = useCallback(() => {
    if (alarmTimeoutRef.current) {
      window.clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }
    try {
      alarmStopRef.current?.();
    } catch {
      /* ignore */
    }
    alarmStopRef.current = null;
    setAlarmPlaying(false);
  }, []);

  const playAlarm = useCallback(async () => {
    stopAlarm();
    const ctx = await ensureAudioContext();
    if (!ctx) return;

    // Short repeating beeps (annoying enough to notice, not harsh)
    const gain = ctx.createGain();
    gain.gain.value = 0.0001;
    gain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 880;
    osc.connect(gain);
    osc.start();

    const interval = window.setInterval(() => {
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      // quick ramp up/down to avoid clicks
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.015);
      gain.gain.linearRampToValueAtTime(0.0001, now + 0.18);
    }, 500);

    alarmStopRef.current = () => {
      window.clearInterval(interval);
      try {
        osc.stop();
      } catch {
        /* ignore */
      }
      try {
        osc.disconnect();
      } catch {
        /* ignore */
      }
      try {
        gain.disconnect();
      } catch {
        /* ignore */
      }
    };

    setAlarmPlaying(true);
    alarmTimeoutRef.current = window.setTimeout(() => {
      stopAlarm();
    }, ALARM_MAX_MS);
  }, [ensureAudioContext, stopAlarm]);

  useEffect(() => {
    if (status === 'idle') {
      setRemainingSec(durationSec);
    }
  }, [durationSec, status]);

  useEffect(() => {
    if (status !== 'running') return;
    const id = window.setInterval(() => {
      setRemainingSec((r) => {
        if (r <= 1) {
          setStatus('done');
          vibrate?.([80, 40, 80]);
          void playAlarm();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [playAlarm, status, vibrate]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopAlarm();
    };
  }, [stopAlarm]);

  const applyPreset = useCallback((sec: number) => {
    stopAlarm();
    setDurationSec(sec);
    setRemainingSec(sec);
    setStatus('idle');
  }, [stopAlarm]);

  const start = useCallback(() => {
    stopAlarm();
    void ensureAudioContext();
    setRemainingSec(durationSec);
    setStatus('running');
  }, [durationSec, ensureAudioContext, stopAlarm]);

  const pause = useCallback(() => {
    setStatus((s) => (s === 'running' ? 'paused' : s));
  }, []);

  const resume = useCallback(() => {
    void ensureAudioContext();
    setStatus((s) => (s === 'paused' ? 'running' : s));
  }, [ensureAudioContext]);

  const reset = useCallback(() => {
    stopAlarm();
    setRemainingSec(durationSec);
    setStatus('idle');
  }, [durationSec, stopAlarm]);

  return {
    durationSec,
    remainingSec,
    status,
    isRunning: status === 'running',
    alarmPlaying,
    applyPreset,
    start,
    pause,
    resume,
    reset,
    stopAlarm,
  };
}

export type RestTimerApi = ReturnType<typeof useRestTimer>;
