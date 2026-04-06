import React from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { LayoutDashboard, Receipt, Lightbulb, BookOpen, UserCircle, Sun, Moon, Lock, X, Menu } from 'lucide-react';
import './Layout.css';

export function Layout({ children, currentTab, setCurrentTab }) {
  const { role, setRole } = useFinanceStore();
  const [theme, setTheme] = React.useState('dark');
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);
  const [passwordInput, setPasswordInput] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    if (newRole === 'admin') {
      setShowPasswordModal(true);
      setPasswordError(false);
      setPasswordInput('');
    } else {
      setRole('viewer');
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === 'admin123') {
      setRole('admin');
      setShowPasswordModal(false);
    } else {
      setPasswordError(true);
    }
  };

  return (
    <div className="layout-grid">
      <aside className={`sidebar glass-panel ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon"></div>
            <h2 className="text-gradient">CoinFlow</h2>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setCurrentTab('dashboard'); setMobileOpen(false); }}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button 
            className={`nav-item ${currentTab === 'transactions' ? 'active' : ''}`}
            onClick={() => { setCurrentTab('transactions'); setMobileOpen(false); }}
          >
            <Receipt size={20} />
            <span>Transactions</span>
          </button>
          <button 
            className={`nav-item ${currentTab === 'insights' ? 'active' : ''}`}
            onClick={() => { setCurrentTab('insights'); setMobileOpen(false); }}
          >
            <Lightbulb size={20} />
            <span>Insights</span>
          </button>
          <button 
            className={`nav-item ${currentTab === 'story' ? 'active' : ''}`}
            onClick={() => { setCurrentTab('story'); setMobileOpen(false); }}
          >
            <BookOpen size={20} />
            <span>Story Wrap</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="role-switcher glass-panel">
            <div className="role-header">
              <UserCircle size={16} />
              <span>Current Role</span>
            </div>
            <select 
              className="input-field" 
              value={role} 
              onChange={handleRoleChange}
              style={{ padding: '8px', fontSize: '0.8rem', marginTop: '8px' }}
            >
              <option value="admin">Administrator (Edit)</option>
              <option value="viewer">Viewer (Read Only)</option>
            </select>
          </div>
          
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <><Sun size={18} /> Light Mode</>
            ) : (
              <><Moon size={18} /> Dark Mode</>
            )}
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}

      <main className="main-content">
        <header className="top-header">
          <div>
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu">
              <Menu size={20} />
            </button>
            <h1>
              {currentTab === 'dashboard' ? 'Overview' : 
               currentTab === 'transactions' ? 'All Transactions' : 
               currentTab === 'insights' ? 'Financial Insights' : 
               'Your Financial Wrap'}
            </h1>
            <p className="text-secondary">Welcome back. Here's what's happening today.</p>
          </div>
          <div className="header-actions">
            <div className="user-avatar">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff" alt="User" />
            </div>
          </div>
        </header>

        <div className="content-area animate-fade-in">
          {children}
        </div>
      </main>

      {showPasswordModal && (
        <div className="modal-backdrop">
          <div className="password-modal glass-panel slide-down">
            <button className="close-modal" onClick={() => setShowPasswordModal(false)}>
              <X size={20} />
            </button>
            <div className="modal-header-icon">
              <Lock size={32} color="#6366f1" />
            </div>
            <h3>Administrator Access</h3>
            <p className="text-secondary" style={{marginBottom: '24px', fontSize: '0.9rem', textAlign: 'center'}}>
              Please enter the admin password to unlock edit capabilities.
            </p>
            <form onSubmit={handlePasswordSubmit} style={{width: '100%'}}>
              <input 
                type="password" 
                className={`input-field ${passwordError ? 'error-shake' : ''}`}
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                autoFocus
              />
              {passwordError && <div className="error-text">Incorrect password. Try again.</div>}
              <button type="submit" className="custom-btn primary" style={{width: '100%', marginTop: '16px'}}>
                Unlock Dashboard
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
