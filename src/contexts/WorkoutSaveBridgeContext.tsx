import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type WorkoutSaveHandlers = {
  save: () => void | Promise<void>;
  saving: boolean;
  loading: boolean;
};

type Ctx = {
  handlers: WorkoutSaveHandlers | null;
  register: (next: WorkoutSaveHandlers | null) => void;
};

const WorkoutSaveBridgeContext = createContext<Ctx | null>(null);

export function WorkoutSaveBridgeProvider({ children }: { children: ReactNode }) {
  const [handlers, setHandlers] = useState<WorkoutSaveHandlers | null>(null);

  const register = useCallback((next: WorkoutSaveHandlers | null) => {
    setHandlers(next);
  }, []);

  const value = useMemo(() => ({ handlers, register }), [handlers, register]);

  return (
    <WorkoutSaveBridgeContext.Provider value={value}>{children}</WorkoutSaveBridgeContext.Provider>
  );
}

export function useWorkoutSaveBridge() {
  const ctx = useContext(WorkoutSaveBridgeContext);
  if (!ctx) {
    throw new Error('useWorkoutSaveBridge must be used within WorkoutSaveBridgeProvider');
  }
  return ctx;
}
