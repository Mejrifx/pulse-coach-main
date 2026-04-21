import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient';
import { PulseLogo } from '@/components/PulseLogo';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setError(null);
    setBusy(true);
    const trimmed = email.trim();
    if (!trimmed || !password) {
      setError('Enter email and password.');
      setBusy(false);
      return;
    }

    if (mode === 'signin') {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: trimmed,
        password,
      });
      setBusy(false);
      if (err) {
        setError(err.message);
        return;
      }
      navigate(from, { replace: true });
      return;
    }

    const { error: err } = await supabase.auth.signUp({
      email: trimmed,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setError(null);
    setMode('signin');
    setPassword('');
    toast.success(
      'Account created. Confirm your email if required by your project, then sign in.',
    );
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-[100dvh] bg-neutral-950 text-stone-100 flex flex-col">
        <header className="border-b border-stone-800/80 px-4 py-4">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-lg outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
            >
              <PulseLogo priority className="h-8" alt="Pulse" />
            </Link>
            <Link
              to="/"
              className="text-sm text-stone-400 hover:text-stone-200 transition-colors"
            >
              Back to site
            </Link>
          </div>
        </header>
        <main className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-12">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/40 p-6 text-amber-100/95">
            <h1 className="text-lg font-semibold text-amber-50">Supabase env not set</h1>
            <p className="mt-2 text-sm leading-relaxed text-amber-100/80">
              This build has no <code className="rounded bg-black/30 px-1">VITE_SUPABASE_URL</code>{' '}
              or <code className="rounded bg-black/30 px-1">VITE_SUPABASE_ANON_KEY</code>. Add
              them in your host (Vercel, Netlify, etc.) and redeploy — Vite bakes these in at{' '}
              <strong>build</strong> time, not runtime.
            </p>
            <p className="mt-4 text-sm text-amber-100/70">
              Locally, copy <code className="rounded bg-black/30 px-1">.env.example</code> to{' '}
              <code className="rounded bg-black/30 px-1">.env</code> and run{' '}
              <code className="rounded bg-black/30 px-1">npm run build</code> again.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-neutral-950 text-stone-100 flex flex-col">
      <header className="border-b border-stone-800/80 px-4 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
          >
            <PulseLogo priority className="h-8" alt="Pulse" />
          </Link>
          <Link
            to="/"
            className="text-sm text-stone-400 hover:text-stone-200 transition-colors"
          >
            Back to site
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-stone-800 bg-neutral-900/50 p-8 shadow-xl">
          <h1 className="text-2xl font-semibold tracking-tight text-stone-50">
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            {mode === 'signin'
              ? 'Use your Pulse credentials to open the dashboard.'
              : 'Sign up — you may need to confirm email depending on project settings.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-stone-300">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-stone-700 bg-neutral-950 px-4 py-3 text-stone-100 placeholder-stone-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-stone-300"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-stone-700 bg-neutral-950 px-4 py-3 text-stone-100 placeholder-stone-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            {error ? (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:opacity-60"
            >
              {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500">
            {mode === 'signin' ? (
              <>
                No account?{' '}
                <button
                  type="button"
                  className="font-medium text-emerald-400 hover:text-emerald-300"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className="font-medium text-emerald-400 hover:text-emerald-300"
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                  }}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  );
}
