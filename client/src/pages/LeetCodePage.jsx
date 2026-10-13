import { useEffect, useState } from 'react';
import { api } from '../context/AuthContext';
import { Code2, Trophy, Flame, Target, RefreshCw, TrendingUp } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function LeetCodePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const load = () => { setLoading(true); api.get('/dashboard').then(r => setData(r.data)).finally(() => setLoading(false)); };
  const sync = async () => { setSyncing(true); try { const r = await api.post('/dashboard/sync'); setData(prev => ({...prev, leetcode: r.data.leetcode})); } finally { setSyncing(false); } };

  useEffect(() => { load(); }, []);

  const lc = data?.leetcode || {};
  const total = (lc.easySolved || 0) + (lc.mediumSolved || 0) + (lc.hardSolved || 0);

  const pieData = [
    { name: 'Easy', value: lc.easySolved || 0, color: '#22c55e' },
    { name: 'Medium', value: lc.mediumSolved || 0, color: '#f59e0b' },
    { name: 'Hard', value: lc.hardSolved || 0, color: '#ef4444' },
  ].filter(d => d.value > 0);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-pulse text-lg" style={{ fontFamily: 'Space Mono', color: '#f59e0b' }}>Loading LeetCode...</div></div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <Code2 size={20} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Space Mono' }}>LeetCode Stats</h1>
            {lc.lastSync && <p className="text-xs" style={{ color: '#8b949e' }}>Last synced {new Date(lc.lastSync).toLocaleString()}</p>}
          </div>
        </div>
        <button onClick={sync} disabled={syncing} className="btn-ghost flex items-center gap-2">
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      {/* Hero stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Solved', value: lc.totalSolved || 0, icon: Trophy, color: '#f59e0b' },
          { label: 'Ranking', value: lc.ranking ? `#${lc.ranking.toLocaleString()}` : '—', icon: TrendingUp, color: '#06b6d4' },
          { label: 'Day Streak', value: lc.streak || 0, icon: Flame, color: '#ef4444' },
          { label: 'Easy / Med / Hard', value: `${lc.easySolved || 0}/${lc.mediumSolved || 0}/${lc.hardSolved || 0}`, icon: Target, color: '#7c3aed' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} style={{ color }} />
              <span className="text-xs" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>{label}</span>
            </div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'Space Mono', color }}>{value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pie chart */}
        <div className="card p-5">
          <h2 className="font-semibold text-sm mb-5" style={{ fontFamily: 'Space Mono' }}>Difficulty Breakdown</h2>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-4 flex-1">
                {[
                  { label: 'Easy', value: lc.easySolved || 0, color: '#22c55e' },
                  { label: 'Medium', value: lc.mediumSolved || 0, color: '#f59e0b' },
                  { label: 'Hard', value: lc.hardSolved || 0, color: '#ef4444' },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color: '#8b949e' }}>{label}</span>
                      <span className="font-mono font-bold" style={{ color }}>{value}</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${total > 0 ? (value / total) * 100 : 0}%`, background: color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12" style={{ color: '#8b949e' }}>
              <Code2 size={32} className="mx-auto mb-3 opacity-30" />
              <p>Sync to see LeetCode stats</p>
            </div>
          )}
        </div>

        {/* Profile link & tips */}
        <div className="space-y-4">
          {data?.profile?.leetcodeUsername && (
            <div className="card p-5">
              <h2 className="font-semibold text-sm mb-3" style={{ fontFamily: 'Space Mono' }}>Profile</h2>
              <a href={`https://leetcode.com/${data.profile.leetcodeUsername}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:border-yellow-500/30 transition-all"
                style={{ background: '#161b22', border: '1px solid #21262d' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                  LC
                </div>
                <div>
                  <div className="font-medium text-sm">@{data.profile.leetcodeUsername}</div>
                  <div className="text-xs" style={{ color: '#8b949e' }}>View on LeetCode →</div>
                </div>
              </a>
            </div>
          )}

          <div className="card p-5" style={{ borderColor: 'rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.03)' }}>
            <h2 className="font-semibold text-sm mb-3" style={{ fontFamily: 'Space Mono', color: '#f59e0b' }}>Progress Tips</h2>
            <div className="space-y-2">
              {[
                `Solved ${total} total. ${total < 100 ? 'Target: 100 for entry-level.' : total < 300 ? 'Target: 300 for top companies.' : 'Great progress! Focus on Hard problems.'}`,
                lc.mediumSolved > 0 ? `Medium success rate is key. Keep solving ${lc.mediumSolved} → 150.` : 'Start with Easy problems to build confidence.',
                lc.streak > 0 ? `${lc.streak}-day streak! Daily practice beats cramming.` : 'Start a streak today — even 1 problem/day makes a difference.',
              ].map((tip, i) => (
                <div key={i} className="text-xs p-3 rounded-lg flex gap-2" style={{ background: '#161b22', color: '#8b949e' }}>
                  <span style={{ color: '#f59e0b' }}>{i + 1}.</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
