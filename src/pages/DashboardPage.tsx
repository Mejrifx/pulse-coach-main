import { Link } from 'react-router-dom';
import { Dumbbell, LogOut, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { WorkoutTracker } from '@/components/workout/WorkoutTracker';

export default function DashboardPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-[100dvh] bg-neutral-950 text-stone-100 flex flex-col">
      <header className="border-b border-stone-800/80 px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 shadow-lg shadow-emerald-500/20">
              <Zap className="h-4 w-4 text-white" aria-hidden />
            </div>
            <span className="text-lg font-bold tracking-tight">PULSE</span>
            <span className="rounded-md border border-stone-700 px-2 py-0.5 text-xs text-stone-500">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden truncate text-sm text-stone-400 sm:inline max-w-[200px]">
              {user?.email}
            </span>
            <button
              type="button"
              onClick={() => void signOut()}
              className="inline-flex items-center gap-2 rounded-lg border border-stone-700 px-3 py-2 text-sm text-stone-200 hover:bg-stone-800/80 transition-colors"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:py-10">
        <div className="mb-8 flex flex-col gap-2 border-b border-stone-800/80 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400/90">
              <Dumbbell className="h-5 w-5" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-wider">Training</span>
            </div>
            <h1 className="mt-2 text-2xl font-semibold text-stone-50 md:text-3xl">
              Workout log
            </h1>
            <p className="mt-2 max-w-2xl text-stone-400">
              4-day split: track weight and reps every session. Saved rows appear under{' '}
              <strong className="text-stone-300">Past workouts</strong> (tables{' '}
              <code className="rounded bg-neutral-900 px-1 text-stone-500">workout_sessions</code>,{' '}
              <code className="rounded bg-neutral-900 px-1 text-stone-500">workout_sets</code>
              ).
            </p>
          </div>
        </div>

        <WorkoutTracker />

        <p className="mt-12 text-sm text-stone-600">
          <Link to="/" className="text-emerald-500/90 hover:text-emerald-400">
            ← Marketing site
          </Link>
        </p>
      </main>
    </div>
  );
}
