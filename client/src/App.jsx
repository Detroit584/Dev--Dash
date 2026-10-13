import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/Overview';
import GitHubPage from './pages/GitHubPage';
import LeetCodePage from './pages/LeetCodePage';
import ResumePage from './pages/ResumePage';
import PortfolioPage from './pages/PortfolioPage';
import SettingsPage from './pages/SettingsPage';

// Only redirect to dashboard if logged in
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" /> : children;
}

// Block unauthenticated users from dashboard
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#060810' }}>
      <div className="text-center">
        <div className="text-3xl font-mono mb-3" style={{ color: '#00ff88' }}>DevDash</div>
        <div className="text-sm animate-pulse" style={{ color: '#8b949e' }}>Initializing...</div>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/auth" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public landing page */}
          <Route path="/" element={<GuestRoute><LandingPage /></GuestRoute>} />

          {/* Auth page — if already logged in, go to dashboard */}
          <Route path="/auth" element={<GuestRoute><AuthPage /></GuestRoute>} />

          {/* Protected dashboard routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Overview />} />
            <Route path="github" element={<GitHubPage />} />
            <Route path="leetcode" element={<LeetCodePage />} />
            <Route path="resume" element={<ResumePage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
