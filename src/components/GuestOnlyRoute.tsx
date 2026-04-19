import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthLoadingScreen } from '@/components/AuthLoadingScreen';

/** Renders children only when there is no session (e.g. login page). */
export function GuestOnlyRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) return <AuthLoadingScreen />;
  if (session) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
