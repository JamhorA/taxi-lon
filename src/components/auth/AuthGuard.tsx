import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useUserStatus } from '../../hooks/useUserStatus';
import { Loader2 } from 'lucide-react';
import InactiveUserMessage from './InactiveUserMessage';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const { isActive, loading: statusLoading } = useUserStatus();

  if (authLoading || statusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isActive) {
    return <InactiveUserMessage />;
  }

  return <>{children}</>;
}