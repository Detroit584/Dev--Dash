import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal, Github, Code2, Zap, CheckCircle } from 'lucide-react';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', githubUsername: '', leetcodeUsername: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const { login, register } = useAuth();
  const [searchParams] = useSearchParams();

  // Read ?tab=register or ?tab=login from URL (set by landing page buttons)
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'register' || tab === 'login') setMode(tab);
  }, [searchParams]);
  const navigate = useNavigate();

  // Switch tabs and reset state
  const switchMode = (m) => {
    setMode(m);
    setError('');
    setRegisterSuccess(false);
    setForm({ name: '', email: m === 'login' ? registeredEmail : '', password: '', githubUsername: '', leetcodeUsername: '' });
  };

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        // LOGIN → go to dashboard
        await login(form.email, form.password);
        navigate('/');
      } else {
        // REGISTER → do NOT auto-login, show success, then redirect to login tab
        await register(form);
        // Clear token so user is NOT auto-logged in
        localStorage.removeItem('devdash_token');
        const email = form.email;
        setRegisteredEmail(email);
        setRegisterSuccess(true);
        // After 2.5s auto-switch to login with email pre-filled
        setTimeout(() => {
          setRegisterSuccess(false);
          setMode('login');
          setForm({ name: '', email: email, password: '', githubUsername: '', leetcodeUsername: '' });
        }, 2500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center relative overflow-hidden" style={{ background: '#060810' }}>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5" style={{ background: '#00ff88', filter: 'blur(100px)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5" style={{ background: '#7c3aed', filter: 'blur(100px)' }} />

      <div className="w-full max-w-md px-4 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)' }}>
              <Terminal size={20} style={{ color: '#00ff88' }} />
            </div>
            <span className="text-2xl font-bold" style={{ fontFamily: 'Space Mono', color: '#00ff88' }}>DevDash</span>
          </div>
          <p className="text-sm" style={{ color: '#8b949e' }}>Your developer command center</p>
        </div>

        {/* Card */}
        <div className="card p-8">

          {/* Registration success screen */}
          {registerSuccess ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(0,255,136,0.1)', border: '2px solid rgba(0,255,136,0.4)' }}>
                <CheckCircle size={32} style={{ color: '#00ff88' }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Space Mono', color: '#00ff88' }}>
                Account Created!
              </h3>
              <p className="text-sm mb-1" style={{ color: '#8b949e' }}>Successfully registered as</p>
              <p className="text-sm font-mono font-bold mb-6 px-4 py-2 rounded-lg inline-block" style={{ color: '#e6edf3', background: '#161b22', border: '1px solid #21262d' }}>
                {registeredEmail}
              </p>
              <div className="flex items-center justify-center gap-2 text-xs animate-pulse" style={{ color: '#8b949e' }}>
                <span style={{ color: '#00ff88' }}>›</span>
                Redirecting to login page...
              </div>
            </div>
          ) : (
            <>
              {/* Mode toggle */}
              <div className="flex mb-8 p-1 rounded-lg" style={{ background: '#161b22' }}>
                {['login', 'register'].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    className="flex-1 py-2 rounded-md text-sm font-medium transition-all"
                    style={{
                      fontFamily: 'Space Mono',
                      background: mode === m ? 'rgba(0,255,136,0.1)' : 'transparent',
                      color: mode === m ? '#00ff88' : '#8b949e',
                      border: mode === m ? '1px solid rgba(0,255,136,0.25)' : '1px solid transparent'
                    }}
                  >
                    {m === 'login' ? '> login' : '> register'}
                  </button>
                ))}
              </div>

              <form onSubmit={handle} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>name</label>
                    <input className="input" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                )}

                <div>
                  <label className="block text-xs mb-1.5" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>email</label>
                  <input className="input" type="email" placeholder="dev@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>

                <div>
                  <label className="block text-xs mb-1.5" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>password</label>
                  <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                </div>

                {mode === 'register' && (
                  <>
                    <div>
                      <label className="block text-xs mb-1.5" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>
                        github username <span style={{ color: '#30363d' }}>(optional)</span>
                      </label>
                      <input className="input" placeholder="octocat" value={form.githubUsername} onChange={e => setForm({ ...form, githubUsername: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs mb-1.5" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>
                        leetcode username <span style={{ color: '#30363d' }}>(optional)</span>
                      </label>
                      <input className="input" placeholder="leetcode_user" value={form.leetcodeUsername} onChange={e => setForm({ ...form, leetcodeUsername: e.target.value })} />
                    </div>

                    <div className="p-3 rounded-lg text-xs flex gap-2" style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', color: '#8b949e' }}>
                      <span style={{ color: '#06b6d4' }}>ℹ</span>
                      After registering, you'll need to login with your credentials.
                    </div>
                  </>
                )}

                {error && (
                  <div className="text-sm p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
                    ⚠ {error}
                  </div>
                )}

                <button className="btn-primary w-full mt-2" type="submit" disabled={loading}>
                  {loading
                    ? (mode === 'login' ? 'Logging in...' : 'Creating account...')
                    : mode === 'login'
                      ? '$ ssh devdash --login'
                      : '$ init new-dev --register'
                  }
                </button>
              </form>

              {/* Switch mode link at bottom */}
              <p className="text-center text-xs mt-5" style={{ color: '#8b949e' }}>
                {mode === 'login' ? (
                  <>Don't have an account?{' '}
                    <button type="button" onClick={() => switchMode('register')}
                      style={{ color: '#00ff88', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}>
                      Register here
                    </button>
                  </>
                ) : (
                  <>Already have an account?{' '}
                    <button type="button" onClick={() => switchMode('login')}
                      style={{ color: '#00ff88', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}>
                      Login here
                    </button>
                  </>
                )}
              </p>

              {/* Features footer */}
              <div className="mt-6 pt-5" style={{ borderTop: '1px solid #21262d' }}>
                <p className="text-xs mb-3 text-center" style={{ color: '#8b949e' }}>What you get</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Github, label: 'GitHub Stats' },
                    { icon: Code2, label: 'LeetCode Tracker' },
                    { icon: Zap, label: 'Auto Resume' },
                    { icon: Terminal, label: 'Portfolio' }
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-xs" style={{ color: '#8b949e' }}>
                      <Icon size={12} style={{ color: '#00ff88' }} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
