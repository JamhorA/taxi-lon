import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/navigation/Navigation';
import AdminView from './views/AdminView';
import ReceiptView from './views/ReceiptView';
import ProfileView from './components/profile/ProfileView';
import AuthForm from './components/auth/AuthForm';
import AuthGuard from './components/auth/AuthGuard';
import { useAuth } from './hooks/useAuth';
import { useInitialization } from './hooks/useInitialization';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { loading: initLoading } = useInitialization();
  const [activeView, setActiveView] = useState<'receipts' | 'admin' | 'profile'>('receipts');

  if (authLoading || initLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'admin':
        return <AdminView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <ReceiptView />;
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Navigation activeView={activeView} onViewChange={setActiveView} />
        {renderView()}
        <Toaster position="bottom-right" />
      </div>
    </AuthGuard>
  );
}

export default App;