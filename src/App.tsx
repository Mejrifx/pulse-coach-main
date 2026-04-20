import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { AuthProvider } from '@/contexts/AuthContext';
import { GuestOnlyRoute } from '@/components/GuestOnlyRoute';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import DashboardLayout from '@/pages/dashboard/DashboardLayout';
import WorkoutsPage from '@/pages/dashboard/WorkoutsPage';
import SupplementsPage from '@/pages/dashboard/SupplementsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {!isSupabaseConfigured ? (
          <div
            role="status"
            className="border-b border-amber-500/40 bg-amber-950/90 px-4 py-2 text-center text-sm text-amber-100/95"
          >
            Supabase env missing — set <code className="rounded bg-black/25 px-1">VITE_SUPABASE_URL</code>{' '}
            and <code className="rounded bg-black/25 px-1">VITE_SUPABASE_ANON_KEY</code> in your host and
            redeploy.
          </div>
        ) : null}
        <Toaster
          position="bottom-center"
          theme="dark"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast: 'border border-stone-800 bg-neutral-900 text-stone-100',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <GuestOnlyRoute>
                <LoginPage />
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="workouts" replace />} />
            <Route path="workouts" element={<WorkoutsPage />} />
            <Route path="supplements" element={<SupplementsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
