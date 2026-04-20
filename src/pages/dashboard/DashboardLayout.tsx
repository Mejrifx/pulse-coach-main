import { Link, NavLink, Outlet, useMatch } from 'react-router-dom';
import { Dumbbell, FlaskConical, LogOut, Save, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { WorkoutSaveBridgeProvider, useWorkoutSaveBridge } from '@/contexts/WorkoutSaveBridgeContext';

const navItems = [
  { to: '/dashboard/supplements', label: 'Supplements', icon: FlaskConical },
  { to: '/dashboard/workouts', label: 'Workouts', icon: Dumbbell },
] as const;

function DashboardLayoutInner() {
  const { user, signOut } = useAuth();
  const { handlers } = useWorkoutSaveBridge();
  const onWorkouts = Boolean(useMatch({ path: '/dashboard/workouts', end: true }));
  const showQuickSave = onWorkouts && handlers;

  return (
    <div className="min-h-[100dvh] bg-neutral-950 text-stone-100">
      <header className="sticky top-0 z-50 border-b border-stone-800/80 bg-neutral-950/85 backdrop-blur-xl">
        <div className="px-4 py-3">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 shadow-lg shadow-emerald-500/20">
                <Zap className="h-4 w-4 text-white" aria-hidden />
              </div>
              <div className="leading-tight">
                <p className="text-[13px] font-semibold tracking-tight text-stone-100">PULSE</p>
                <p className="text-[11px] text-stone-500">Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden max-w-[220px] truncate text-sm text-stone-400 sm:inline">
                {user?.email}
              </span>
              {showQuickSave ? (
                <button
                  type="button"
                  onClick={() => void handlers.save()}
                  disabled={handlers.loading || handlers.saving}
                  aria-label={handlers.saving ? 'Saving workout' : 'Save workout'}
                  className="touch-manipulation inline-flex min-h-[40px] min-w-[40px] items-center justify-center gap-1.5 rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3"
                >
                  <Save className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="hidden sm:inline">{handlers.saving ? 'Saving…' : 'Save'}</span>
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => void signOut()}
                className="touch-manipulation inline-flex items-center gap-2 rounded-lg border border-stone-700 bg-neutral-950 px-3 py-2 text-sm text-stone-200 hover:bg-stone-800/60 transition-colors"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile-first top nav: big targets, clear active state */}
        <nav aria-label="Dashboard sections" className="px-4 pb-3">
          <div className="mx-auto w-full max-w-6xl">
            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-stone-800 bg-neutral-950/60 p-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end
                    className={({ isActive }) =>
                      [
                        'touch-manipulation flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500',
                        isActive
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                          : 'text-stone-400 hover:bg-stone-800/60 hover:text-stone-100',
                      ].join(' ')
                    }
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
        <Outlet />
        <div className="mt-10">
          <Link
            to="/"
            className="text-sm text-emerald-500/90 hover:text-emerald-400 transition-colors"
          >
            ← Marketing site
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <WorkoutSaveBridgeProvider>
      <DashboardLayoutInner />
    </WorkoutSaveBridgeProvider>
  );
}

