import { Link } from 'react-router-dom';
import { LogOut, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-2xl font-semibold text-stone-50">Welcome back</h1>
        <p className="mt-2 max-w-xl text-stone-400">
          You’re signed in. The coaching workspace will live here — start by wiring your programs
          and clients next.
        </p>
        <div className="mt-10 rounded-2xl border border-dashed border-stone-700 bg-neutral-900/40 p-12 text-center text-stone-500">
          Platform modules coming soon.
        </div>
        <p className="mt-8 text-sm text-stone-600">
          <Link to="/" className="text-emerald-500/90 hover:text-emerald-400">
            ← Marketing site
          </Link>
        </p>
      </main>
    </div>
  );
}
