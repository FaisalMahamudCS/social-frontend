import React, { useState, useEffect } from 'react';
import { OperationNode, User } from './types';
import { getCalculationTree } from './api/calculations';
import AuthModal from './components/AuthModal';
import CalculationTree from './components/CalculationTree';
import CreateStartingNumberForm from './components/CreateStartingNumberForm';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [calculations, setCalculations] = useState<OperationNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userStr));
    }
    loadCalculations();
  }, []);

  const loadCalculations = async () => {
    try {
      const data = await getCalculationTree();
      setCalculations(data);
    } catch (error) {
      console.error('Error loading calculations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (_token: string, userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    loadCalculations();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-transparent px-4 py-6 text-[#0F172A] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-white/90 p-5 shadow-xl shadow-[#5B4BFF1A] backdrop-blur sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A] sm:text-3xl">
              Number Social
            </h1>
            <p className="mt-1 text-sm text-[#475569]">
              Start a number, respond with operations, and watch the conversation evolve.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-[#0F172A]">
                  Signed in as <span className="font-medium text-[#5B4BFF]">@{user?.username}</span>
                </span>
                <button
                  className="inline-flex items-center rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-xs font-medium text-[#0F172A] shadow-sm transition hover:border-[#5B4BFF] hover:text-[#5B4BFF]"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="inline-flex items-center rounded-full bg-[#5B4BFF] px-4 py-2 text-xs font-medium text-white shadow-lg shadow-[#5B4BFF55] transition hover:bg-[#4A3DE0]"
                  onClick={() => openAuthModal('login')}
                >
                  Login
                </button>
                <button
                  className="inline-flex items-center rounded-full border border-[#22D3EE] bg-white px-4 py-2 text-xs font-medium text-[#0F172A] shadow-sm transition hover:border-[#5B4BFF] hover:text-[#5B4BFF]"
                  onClick={() => openAuthModal('register')}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </header>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
          mode={authMode}
        />

        {isAuthenticated && (
          <CreateStartingNumberForm onNumberCreated={loadCalculations} />
        )}

        <section className="rounded-2xl border border-[#E2E8F0] bg-white/90 p-5 shadow-lg shadow-[#5B4BFF1A] backdrop-blur">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Conversation Tree
            </h2>
            {!loading && (
              <span className="text-xs text-[#475569]">
                {calculations.length === 0
                  ? 'No threads yet'
                  : `${calculations.length} active thread${calculations.length > 1 ? 's' : ''}`}
              </span>
            )}
          </div>
          {loading ? (
            <div className="flex items-center justify-center rounded-xl border border-dashed border-[#E2E8F0] px-6 py-12 text-sm text-[#475569] bg-white/70">
              Loading conversation…
            </div>
          ) : (
            <CalculationTree
              nodes={calculations}
              onOperationCreated={loadCalculations}
              isAuthenticated={isAuthenticated}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default App;
