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

  const handleAuthSuccess = (token: string, userData: User) => {
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
    <div className="container">
      <header className="header">
        <h1>Number Social Network</h1>
        <div className="auth-section">
          {isAuthenticated ? (
            <>
              <span>Welcome, {user?.username}!</span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={() => openAuthModal('login')}>
                Login
              </button>
              <button className="btn btn-secondary" onClick={() => openAuthModal('register')}>
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

      <div className="calculation-tree">
        <h2 style={{ marginBottom: '20px' }}>Calculation Tree</h2>
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : (
          <CalculationTree
            nodes={calculations}
            onOperationCreated={loadCalculations}
            isAuthenticated={isAuthenticated}
          />
        )}
      </div>
    </div>
  );
};

export default App;
