import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import {
  Terminal, Github, Code2, FileText, Globe, Zap,
  ArrowRight, Star, GitFork, Trophy, Flame,
  ChevronRight, Play, Check, Users
} from 'lucide-react';

// Animated counter
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}


// Floating card component     
function FloatCard({ children, style, className = '' }) {
  return (
    <div className={`absolute rounded-xl p-3 ${className}`}
      style={{
        background: 'rgba(13,17,23,0.9)',
        border: '1px solid rgba(0,255,136,0.2)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        ...style
      }}>
      {children}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handle = (e) => setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  const goAuth = (tab = 'login') => navigate(`/auth?tab=${tab}`);

  const features = [
    {
      icon: Github,
      color: '#00ff88',
      bg: 'rgba(0,255,136,0.08)',
      border: 'rgba(0,255,136,0.2)',
      title: 'GitHub Integration',
      desc: 'Auto-sync repos, stars, commit activity, language breakdown — all in real time.'
    },
    {
      icon: Code2,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.08)',
      border: 'rgba(245,158,11,0.2)',
      title: 'LeetCode Tracker',
      desc: 'Track Easy / Medium / Hard problems solved, ranking, streaks and daily progress.'
    },
    {
      icon: FileText,
      color: '#06b6d4',
      bg: 'rgba(6,182,212,0.08)',
      border: 'rgba(6,182,212,0.2)',
      title: 'Auto Resume Builder',
      desc: 'Your resume updates itself. Add experience, projects — export with one click.'
    },
    {
      icon: Globe,
      color: '#7c3aed',
      bg: 'rgba(124,58,237,0.08)',
      border: 'rgba(124,58,237,0.2)',
      title: 'Portfolio Generator',
      desc: 'A beautiful portfolio auto-generated from your GitHub and LeetCode activity.'
    },
    {
      icon: Zap,
      color: '#f43f5e',
      bg: 'rgba(244,63,94,0.08)',
      border: 'rgba(244,63,94,0.2)',
      title: 'AI Insights',
      desc: 'Personalized tips on consistency, skill gaps and what to work on next.'
    },
    {
      icon: Flame,
      color: '#fb923c',
      bg: 'rgba(251,146,60,0.08)',
      border: 'rgba(251,146,60,0.2)',
      title: 'Auto Sync Every 6h',
      desc: 'Data refreshes automatically. Always stay up to date without lifting a finger.'
    },
  ];

  const steps = [
    { n: '01', title: 'Create Account', desc: 'Register with your email and add your GitHub & LeetCode usernames.' },
    { n: '02', title: 'Sync Your Data', desc: 'One click syncs all your public activity — repos, stars, problems solved.' },
    { n: '03', title: 'Get Your Dashboard', desc: 'Your live developer profile, resume, and portfolio — always up to date.' },
  ];

  return (
    <div style={{ background: '#060810', color: '#e6edf3', fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(6,8,16,0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Terminal size={16} color="#00ff88" />
            </div>
            <span style={{ fontFamily: 'Space Mono', fontWeight: 700, fontSize: 18, color: '#00ff88', letterSpacing: '-0.5px' }}>DevDash</span>
          </div>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {['Features', 'How it Works', 'Stats'].map(label => (
              <button key={label}
                onClick={() => document.getElementById(label.toLowerCase().replace(' ', '-'))?.scrollIntoView({ behavior: 'smooth' })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b949e', fontSize: 14, padding: '8px 14px', borderRadius: 8, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#e6edf3'}
                onMouseLeave={e => e.target.style.color = '#8b949e'}
              >
                {label}
              </button>
            ))}

            <div style={{ width: 1, height: 20, background: '#21262d', margin: '0 4px' }} />

            {user ? (
              <button onClick={() => navigate('/')} style={{
                background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
                color: '#060810', fontWeight: 700, padding: '8px 18px',
                borderRadius: 8, border: 'none', cursor: 'pointer',
                fontFamily: 'Space Mono', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6
              }}>
                Dashboard <ArrowRight size={13} />
              </button>
            ) : (
              <>
                <button onClick={() => goAuth('login')} style={{
                  background: 'transparent', border: '1px solid #21262d',
                  color: '#e6edf3', padding: '8px 16px', borderRadius: 8,
                  cursor: 'pointer', fontSize: 14, transition: 'all 0.2s'
                }}
                  onMouseEnter={e => { e.target.style.borderColor = 'rgba(0,255,136,0.4)'; e.target.style.color = '#00ff88'; }}
                  onMouseLeave={e => { e.target.style.borderColor = '#21262d'; e.target.style.color = '#e6edf3'; }}
                >
                  Sign In
                </button>
                <button onClick={() => goAuth('register')} style={{
                  background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
                  color: '#060810', fontWeight: 700, padding: '8px 18px',
                  borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontFamily: 'Space Mono', fontSize: 13
                }}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingTop: 80 }}>
        {/* Animated background */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {/* Grid */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.4,
            backgroundImage: 'linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
          {/* Dynamic glow that follows mouse */}
          <div style={{
            position: 'absolute', width: 800, height: 800, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)',
            left: `${mousePos.x * 100}%`, top: `${mousePos.y * 100}%`,
            transform: 'translate(-50%, -50%)', transition: 'left 0.5s ease, top 0.5s ease',
            pointerEvents: 'none'
          }} />
          {/* Static glows */}
          <div style={{ position: 'absolute', top: '20%', right: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.25)', borderRadius: 999, padding: '6px 16px', marginBottom: 32, animation: 'fadeIn 0.6s ease-out' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88' }} />
            <span style={{ fontFamily: 'Fira Code', fontSize: 12, color: '#00ff88' }}>Now with AI Insights — beta</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'Space Mono', fontWeight: 700, lineHeight: 1.1,
            fontSize: 'clamp(42px, 7vw, 80px)', marginBottom: 24,
            animation: 'slideUp 0.6s ease-out 0.1s both'
          }}>
            Your Developer{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00ff88, #06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              Command Center
            </span>
          </h1>

          {/* Subheadline */}
          <p style={{ fontSize: 20, color: '#8b949e', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6, animation: 'slideUp 0.6s ease-out 0.2s both' }}>
            Connect GitHub + LeetCode. Get a live dashboard, auto-updated resume, and portfolio — all in one place.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', animation: 'slideUp 0.6s ease-out 0.3s both' }}>
            <button onClick={() => goAuth('register')} style={{
              background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
              color: '#060810', fontWeight: 700, padding: '14px 28px',
              borderRadius: 10, border: 'none', cursor: 'pointer',
              fontFamily: 'Space Mono', fontSize: 15,
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 0 40px rgba(0,255,136,0.25)',
              transition: 'all 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Get Started Free <ArrowRight size={16} />
            </button>
            <button onClick={() => goAuth('login')} style={{
              background: 'transparent', border: '1px solid #30363d',
              color: '#e6edf3', padding: '14px 28px', borderRadius: 10,
              cursor: 'pointer', fontSize: 15,
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,136,0.4)'; e.currentTarget.style.color = '#00ff88'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.color = '#e6edf3'; }}
            >
              Sign In <ChevronRight size={16} />
            </button>
          </div>

          {/* Trust signals */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 48, flexWrap: 'wrap', animation: 'slideUp 0.6s ease-out 0.4s both' }}>
            {[
              { icon: Check, label: 'Free forever' },
              { icon: Check, label: 'No credit card' },
              { icon: Check, label: 'Auto-sync every 6h' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8b949e', fontSize: 13 }}>
                <Icon size={13} color="#00ff88" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Floating UI cards around hero */}
        <FloatCard style={{ top: '18%', left: '4%', animation: 'float 4s ease-in-out infinite' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Github size={14} color="#00ff88" />
            <span style={{ fontFamily: 'Fira Code', fontSize: 11, color: '#00ff88' }}>+47 commits today</span>
          </div>
        </FloatCard>

        <FloatCard style={{ top: '25%', right: '3%', animation: 'float 5s ease-in-out infinite 1s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Flame size={14} color="#ef4444" />
            <span style={{ fontFamily: 'Fira Code', fontSize: 11, color: '#ef4444' }}>42 day streak 🔥</span>
          </div>
        </FloatCard>

        <FloatCard style={{ bottom: '25%', left: '3%', animation: 'float 4.5s ease-in-out infinite 0.5s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Code2 size={13} color="#f59e0b" />
            <span style={{ fontFamily: 'Fira Code', fontSize: 11, color: '#8b949e' }}>LeetCode</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {[['Easy', 145, '#22c55e'], ['Med', 87, '#f59e0b'], ['Hard', 23, '#ef4444']].map(([l, v, c]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Mono', fontSize: 14, fontWeight: 700, color: c }}>{v}</div>
                <div style={{ fontSize: 10, color: '#8b949e' }}>{l}</div>
              </div>
            ))}
          </div>
        </FloatCard>

        <FloatCard style={{ bottom: '22%', right: '4%', animation: 'float 5.5s ease-in-out infinite 1.5s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Star size={12} color="#f59e0b" />
            <span style={{ fontFamily: 'Fira Code', fontSize: 11, color: '#8b949e' }}>Total Stars</span>
          </div>
          <div style={{ fontFamily: 'Space Mono', fontSize: 20, fontWeight: 700, color: '#f59e0b' }}>1,247</div>
        </FloatCard>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────── */}
      <section id="stats" style={{ padding: '80px 24px', borderTop: '1px solid #161b22', borderBottom: '1px solid #161b22' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, textAlign: 'center' }}>
            {[
              { value: 5000, suffix: '+', label: 'Developers', color: '#00ff88' },
              { value: 2400000, suffix: '+', label: 'Commits Tracked', color: '#06b6d4' },
              { value: 850000, suffix: '+', label: 'Problems Synced', color: '#f59e0b' },
              { value: 98, suffix: '%', label: 'Uptime', color: '#7c3aed' },
            ].map(({ value, suffix, label, color }) => (
              <div key={label}>
                <div style={{ fontFamily: 'Space Mono', fontSize: 40, fontWeight: 700, color, lineHeight: 1 }}>
                  <Counter target={value} suffix={suffix} />
                </div>
                <div style={{ color: '#8b949e', fontSize: 14, marginTop: 8 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <section id="features" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Section label */}
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ fontFamily: 'Fira Code', fontSize: 12, color: '#00ff88', letterSpacing: 2, textTransform: 'uppercase' }}>Features</span>
            <h2 style={{ fontFamily: 'Space Mono', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, marginTop: 12, marginBottom: 16 }}>
              Everything a developer needs
            </h2>
            <p style={{ color: '#8b949e', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
              One dashboard to rule your entire dev presence — no more switching tabs.
            </p>
          </div>

          {/* Feature grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {features.map(({ icon: Icon, color, bg, border, title, desc }) => (
              <div key={title} style={{
                background: bg, border: `1px solid ${border}`,
                borderRadius: 16, padding: 28,
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${color}15`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={20} color={color} />
                </div>
                <h3 style={{ fontFamily: 'Space Mono', fontSize: 16, fontWeight: 700, marginBottom: 10, color: '#e6edf3' }}>{title}</h3>
                <p style={{ color: '#8b949e', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '100px 24px', background: 'rgba(13,17,23,0.5)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ fontFamily: 'Fira Code', fontSize: 12, color: '#7c3aed', letterSpacing: 2, textTransform: 'uppercase' }}>How it works</span>
            <h2 style={{ fontFamily: 'Space Mono', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, marginTop: 12 }}>
              Up and running in 3 steps
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {steps.map(({ n, title, desc }, i) => (
              <div key={n} style={{ display: 'flex', gap: 28, position: 'relative', paddingBottom: i < steps.length - 1 ? 40 : 0 }}>
                {/* Number + line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Space Mono', fontWeight: 700, fontSize: 14,
                    background: 'rgba(0,255,136,0.1)', border: '2px solid rgba(0,255,136,0.4)',
                    color: '#00ff88', flexShrink: 0
                  }}>{n}</div>
                  {i < steps.length - 1 && (
                    <div style={{ width: 2, flex: 1, marginTop: 8, background: 'linear-gradient(to bottom, rgba(0,255,136,0.4), rgba(0,255,136,0.05))' }} />
                  )}
                </div>
                {/* Content */}
                <div style={{ paddingTop: 12, paddingBottom: i < steps.length - 1 ? 40 : 0 }}>
                  <h3 style={{ fontFamily: 'Space Mono', fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#e6edf3' }}>{title}</h3>
                  <p style={{ color: '#8b949e', fontSize: 15, lineHeight: 1.6, maxWidth: 500 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS / SOCIAL PROOF ────────────────────── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontFamily: 'Fira Code', fontSize: 12, color: '#06b6d4', letterSpacing: 2, textTransform: 'uppercase' }}>Loved by devs</span>
            <h2 style={{ fontFamily: 'Space Mono', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, marginTop: 12 }}>What developers say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { name: 'Arjun Sharma', handle: '@arjun_dev', role: 'SDE @ Flipkart', text: 'DevDash saved me so much time. My GitHub stats and LeetCode are all in one place — no more manual resume updates!', avatar: 'A' },
              { name: 'Priya Nair', handle: '@priya_codes', role: 'Full Stack Dev', text: 'The portfolio auto-generate feature is 🔥. Shared it in my job application and the recruiter was impressed.', avatar: 'P' },
              { name: 'Rahul Gupta', handle: '@rahul_hacks', role: 'CS Student @ IIT', text: 'As a student tracking my LeetCode streak alongside GitHub activity helps me stay consistent. Love the AI insights!', avatar: 'R' },
            ].map(({ name, handle, role, text, avatar }) => (
              <div key={name} style={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 16, padding: 24, transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,255,136,0.25)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#21262d'}
              >
                <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p style={{ color: '#8b949e', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>"{text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#00ff88' }}>{avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3' }}>{name}</div>
                    <div style={{ fontSize: 12, color: '#8b949e' }}>{handle} · {role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ────────────────────────────────────── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.05) 0%, rgba(124,58,237,0.05) 100%)', border: '1px solid rgba(0,255,136,0.15)', borderRadius: 24, padding: '64px 40px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,136,0.1) 0%, transparent 70%)' }} />
            <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)' }} />

            <Terminal size={40} color="#00ff88" style={{ marginBottom: 20 }} />
            <h2 style={{ fontFamily: 'Space Mono', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, marginBottom: 16, lineHeight: 1.2 }}>
              Ready to level up<br />your dev profile?
            </h2>
            <p style={{ color: '#8b949e', fontSize: 16, marginBottom: 36, lineHeight: 1.6 }}>
              Join thousands of developers who track their progress with DevDash. Free. Always.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => goAuth('register')} style={{
                background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
                color: '#060810', fontWeight: 700, padding: '14px 32px',
                borderRadius: 10, border: 'none', cursor: 'pointer',
                fontFamily: 'Space Mono', fontSize: 15,
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 0 40px rgba(0,255,136,0.3)',
                transition: 'transform 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Create Free Account <ArrowRight size={16} />
              </button>
              <button onClick={() => goAuth('login')} style={{
                background: 'transparent', border: '1px solid #30363d',
                color: '#e6edf3', padding: '14px 28px', borderRadius: 10,
                cursor: 'pointer', fontSize: 15, transition: 'all 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#00ff88'; e.currentTarget.style.color = '#00ff88'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.color = '#e6edf3'; }}
              >
                Already have an account?
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #161b22', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Terminal size={16} color="#00ff88" />
            <span style={{ fontFamily: 'Space Mono', fontSize: 15, color: '#00ff88', fontWeight: 700 }}>DevDash</span>
            <span style={{ color: '#8b949e', fontSize: 13 }}>— Built for developers</span>
          </div>
          <div style={{ color: '#8b949e', fontSize: 13 }}>
            © {new Date().getFullYear()} DevDash. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Global keyframes */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes float {
          0%, 100% { transform: translateY(0px) }
          50% { transform: translateY(-10px) }
        }
      `}</style>
    </div>
  );
}
