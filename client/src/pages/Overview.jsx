import { useEffect, useState } from 'react';
import { useAuth, api } from '../context/AuthContext';
import { Github, Code2, Star, Users, GitFork, Trophy, Flame, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Overview() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/dashboard').then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  const gh = data?.github || {};
  const lc = data?.leetcode || {};

  const lcTotal = (lc.easySolved || 0) + (lc.mediumSolved || 0) + (lc.hardSolved || 0);
  const lcPct = lcTotal > 0 ? Math.round((lcTotal / (lc.totalQuestions || 1)) * 100) : 0;

  const commitData = Array.isArray(gh.commitActivity) ? gh.commitActivity : 
    Array.from({ length: 12 }, (_, i) => ({ week: `W${i+1}`, commits: Math.floor(Math.random() * 30) + 1 }));

  if (loading) return (
    <div className="flex items-center justify-center h-full min-h-screen">
      <div className="text-center">
        <div className="text-2xl animate-pulse" style={{ fontFamily: 'Space Mono', color: '#00ff88' }}>Loading...</div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 stagger-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Mono' }}>
              gm, <span style={{ color: '#00ff88' }}>{user?.name?.split(' ')[0]}</span>
              <span className="cursor" style={{ color: '#00ff88' }}>_</span>
            </h1>
            <p className="text-sm" style={{ color: '#8b949e' }}>Here's your dev activity at a glance</p>
          </div>
          {data?.profile?.lastSync && (
            <span className="stat-pill text-xs">Last synced {new Date(gh.lastSync).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Repos', value: gh.repos || 0, icon: GitFork, color: '#00ff88', delay: 'stagger-1' },
          { label: 'Stars', value: gh.stars || 0, icon: Star, color: '#f59e0b', delay: 'stagger-2' },
          { label: 'Followers', value: gh.followers || 0, icon: Users, color: '#06b6d4', delay: 'stagger-3' },
          { label: 'Solved', value: lc.totalSolved || 0, icon: Trophy, color: '#7c3aed', delay: 'stagger-4' },
        ].map(({ label, value, icon: Icon, color, delay }) => (
          <div key={label} className={`card p-5 ${delay}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>{label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon size={14} style={{ color }} />
              </div>
            </div>
            <div className="text-3xl font-bold" style={{ fontFamily: 'Space Mono', color }}>
              {value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Commit activity chart */}
        <div className="card p-5 lg:col-span-2 stagger-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Github size={16} style={{ color: '#00ff88' }} />
              <h2 className="font-semibold text-sm" style={{ fontFamily: 'Space Mono' }}>Commit Activity</h2>
            </div>
            <button onClick={() => navigate('/dashboard/github')} className="flex items-center gap-1 text-xs" style={{ color: '#8b949e' }}>
              View all <ArrowRight size={12} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={commitData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <defs>
                <linearGradient id="commitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" tick={{ fill: '#8b949e', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 8, color: '#e6edf3' }}
                cursor={{ stroke: 'rgba(0,255,136,0.2)' }}
              />
              <Area type="monotone" dataKey="commits" stroke="#00ff88" strokeWidth={2} fill="url(#commitGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* LeetCode stats */}
        <div className="card p-5 stagger-3">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Code2 size={16} style={{ color: '#f59e0b' }} />
              <h2 className="font-semibold text-sm" style={{ fontFamily: 'Space Mono' }}>LeetCode</h2>
            </div>
            <button onClick={() => navigate('/dashboard/leetcode')} className="flex items-center gap-1 text-xs" style={{ color: '#8b949e' }}>
              View <ArrowRight size={12} />
            </button>
          </div>

          {/* Circle progress */}
          <div className="flex flex-col items-center my-4">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#21262d" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 40 * lcPct / 100} ${2 * Math.PI * 40}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold" style={{ fontFamily: 'Space Mono', color: '#f59e0b' }}>{lc.totalSolved || 0}</span>
                <span className="text-xs" style={{ color: '#8b949e' }}>solved</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Easy', value: lc.easySolved || 0, color: '#22c55e' },
              { label: 'Medium', value: lc.mediumSolved || 0, color: '#f59e0b' },
              { label: 'Hard', value: lc.hardSolved || 0, color: '#ef4444' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <span style={{ color: '#8b949e' }}>{label}</span>
                <span className="font-mono font-bold" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>

          {lc.streak > 0 && (
            <div className="mt-4 flex items-center gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <Flame size={14} style={{ color: '#ef4444' }} />
              <span className="text-xs font-mono" style={{ color: '#ef4444' }}>{lc.streak} day streak 🔥</span>
            </div>
          )}
        </div>

        {/* Recent repos */}
        <div className="card p-5 lg:col-span-2 stagger-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm" style={{ fontFamily: 'Space Mono' }}>Recent Repositories</h2>
            <span className="stat-pill">{gh.repos || 0} total</span>
          </div>
          <div className="space-y-3">
            {(gh.recentRepos || []).slice(0, 4).map((repo, i) => (
              <a key={i} href={repo.url} target="_blank" rel="noreferrer"
                className="flex items-start justify-between p-3 rounded-lg group transition-all"
                style={{ background: '#161b22', border: '1px solid #21262d' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,255,136,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#21262d'}
              >
                <div className="min-w-0">
                  <div className="font-medium text-sm mb-0.5 group-hover:text-green-400 transition-colors truncate">{repo.name}</div>
                  {repo.description && <div className="text-xs truncate" style={{ color: '#8b949e' }}>{repo.description}</div>}
                  {repo.language && <span className="lang-badge mt-1.5 inline-flex">{repo.language}</span>}
                </div>
                <div className="flex items-center gap-1 ml-3 flex-shrink-0" style={{ color: '#f59e0b' }}>
                  <Star size={12} />
                  <span className="text-xs font-mono">{repo.stars}</span>
                </div>
              </a>
            ))}
            {(!gh.recentRepos || gh.recentRepos.length === 0) && (
              <div className="text-center py-8 text-sm" style={{ color: '#8b949e' }}>
                Sync your data to see repositories
              </div>
            )}
          </div>
        </div>

        {/* AI Insights */}
        <div className="card p-5 stagger-5" style={{ borderColor: 'rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.03)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} style={{ color: '#7c3aed' }} />
            <h2 className="font-semibold text-sm" style={{ fontFamily: 'Space Mono', color: '#7c3aed' }}>AI Insights</h2>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(124,58,237,0.15)', color: '#7c3aed', fontFamily: 'Fira Code' }}>beta</span>
          </div>
          <div className="space-y-3">
            {[
              { icon: TrendingUp, tip: `You've solved ${lc.totalSolved || 0} LeetCode problems. Focus on Medium difficulty to level up.` },
              { icon: Github, tip: `${gh.repos || 0} public repos with ${gh.stars || 0} total stars. Add READMEs to boost visibility.` },
              { icon: Flame, tip: lc.streak > 0 ? `${lc.streak} day streak! Keep the momentum going.` : 'Start a daily LeetCode streak to build consistency.' },
            ].map(({ icon: Icon, tip }, i) => (
              <div key={i} className="flex gap-3 text-xs p-2.5 rounded-lg" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.1)' }}>
                <Icon size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#7c3aed' }} />
                <span style={{ color: '#8b949e', lineHeight: 1.5 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
