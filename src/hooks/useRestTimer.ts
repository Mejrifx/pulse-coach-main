import { useCallback, useEffect, useState } from 'react';
import { OPTIMAL_REST_BETWEEN_SETS_SEC } from '@/constants/restTimer';

export type RestTimerStatus = 'idle' | 'running' | 'paused' | 'done';

export function useRestTimer() {
  const [durationSec, setDurationSec] = useState(OPTIMAL_REST_BETWEEN_SETS_SEC);
  const [remainingSec, setRemainingSec] = useState(OPTIMAL_REST_BETWEEN_SETS_SEC);
  const [status, setStatus] = useState<RestTimerStatus>('idle');

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
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            try {
              navigator.vibrate([80, 40, 80]);
            } catch {
              /* ignore */
            }
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [status]);

  const applyPreset = useCallback((sec: number) => {
    setDurationSec(sec);
    setRemainingSec(sec);
    setStatus('idle');
  }, []);

  const start = useCallback(() => {
    setRemainingSec(durationSec);
    setStatus('running');
  }, [durationSec]);

  const pause = useCallback(() => {
    setStatus((s) => (s === 'running' ? 'paused' : s));
  }, []);

  const resume = useCallback(() => {
    setStatus((s) => (s === 'paused' ? 'running' : s));
  }, []);

  const reset = useCallback(() => {
    setRemainingSec(durationSec);
    setStatus('idle');
  }, [durationSec]);

  return {
    durationSec,
    remainingSec,
    status,
    isRunning: status === 'running',
    applyPreset,
    start,
    pause,
    resume,
    reset,
  };
}

export type RestTimerApi = ReturnType<typeof useRestTimer>;
