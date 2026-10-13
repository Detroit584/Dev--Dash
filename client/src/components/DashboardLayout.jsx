import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal, LayoutDashboard, Github, Code2, FileText, Globe, Settings, LogOut, RefreshCw, Zap } from 'lucide-react';
import { useState } from 'react';
import { api } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/dashboard/github', label: 'GitHub', icon: Github },
  { path: '/dashboard/leetcode', label: 'LeetCode', icon: Code2 },
  { path: '/dashboard/resume', label: 'Resume', icon: FileText },
  { path: '/dashboard/portfolio', label: 'Portfolio', icon: Globe },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg('');
    try {
      const res = await api.post('/dashboard/sync');
      const d = res.data;
      if (d.githubSynced && d.leetcodeSynced) setSyncMsg('All synced ✅');
      else if (d.githubSynced) setSyncMsg('GitHub ✅ LC ❌');
      else if (d.leetcodeSynced) setSyncMsg('GitHub ❌ LC ✅');
      else setSyncMsg('Sync failed ❌');
      setTimeout(() => setSyncMsg(''), 4000);
      // Reload page to show new data
      window.location.reload();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error syncing';
      setSyncMsg(msg.length > 20 ? 'Error ❌' : msg);
      setTimeout(() => setSyncMsg(''), 4000);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#060810' }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col" style={{ background: '#0d1117', borderRight: '1px solid #21262d' }}>
        {/* Logo */}
        <div className="p-5 flex items-center gap-3" style={{ borderBottom: '1px solid #21262d' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)' }}>
            <Terminal size={16} style={{ color: '#00ff88' }} />
          </div>
          <div>
            <div className="font-bold text-sm" style={{ fontFamily: 'Space Mono', color: '#00ff88' }}>DevDash</div>
            <div className="text-xs" style={{ color: '#8b949e' }}>v1.0.0</div>
          </div>
        </div>

        {/* User */}
        <div className="p-4" style={{ borderBottom: '1px solid #21262d' }}>
          <div className="flex items-center gap-3">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-9 h-9 rounded-full" style={{ border: '2px solid rgba(0,255,136,0.3)' }} />
            ) : (
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'rgba(0,255,136,0.1)', border: '2px solid rgba(0,255,136,0.3)', color: '#00ff88' }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{user?.name}</div>
              <div className="text-xs truncate" style={{ color: '#00ff88' }}>@{user?.githubUsername || 'developer'}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`nav-link w-full ${location.pathname === path ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 space-y-1" style={{ borderTop: '1px solid #21262d' }}>
          {/* Sync button */}
          <button
            onClick={handleSync}
            disabled={syncing}
            className="nav-link w-full"
            style={{ color: syncing ? '#00ff88' : undefined }}
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            <span>{syncMsg || (syncing ? 'Syncing...' : 'Sync Data')}</span>
          </button>

          <button onClick={() => navigate('/dashboard/settings')} className={`nav-link w-full ${location.pathname === '/dashboard/settings' ? 'active' : ''}`}>
            <Settings size={16} />
            <span>Settings</span>
          </button>

          <button onClick={logout} className="nav-link w-full" style={{ color: '#ef4444' }}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        {/* AI badge */}
        <div className="p-3">
          <div className="p-2.5 rounded-lg flex items-center gap-2" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <Zap size={12} style={{ color: '#7c3aed' }} />
            <span className="text-xs" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>AI insights active</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
