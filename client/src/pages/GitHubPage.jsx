import { useEffect, useState } from 'react';
import { api } from '../context/AuthContext';
import { Github, Star, Users, GitFork, ExternalLink, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function GitHubPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/dashboard').then(r => setData(r.data)).finally(() => setLoading(false));
  };

  const sync = async () => {
    setSyncing(true);
    try {
      const r = await api.post('/dashboard/sync');
      setData(prev => ({ ...prev, github: r.data.github }));
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const gh = data?.github || {};
  const langData = (gh.recentRepos || []).reduce((acc, r) => {
    if (r.language) { acc[r.language] = (acc[r.language] || 0) + 1; }
    return acc;
  }, {});
  const langChartData = Object.entries(langData).map(([name, count]) => ({ name, count }));

  if (loading) return <div className="flex items-center justify-center h-full min-h-screen"><div className="animate-pulse text-lg" style={{ fontFamily: 'Space Mono', color: '#00ff88' }}>Loading GitHub...</div></div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)' }}>
            <Github size={20} style={{ color: '#00ff88' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Space Mono' }}>GitHub Stats</h1>
            {gh.lastSync && <p className="text-xs" style={{ color: '#8b949e' }}>Last synced {new Date(gh.lastSync).toLocaleString()}</p>}
          </div>
        </div>
        <button onClick={sync} disabled={syncing} className="btn-ghost flex items-center gap-2">
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Public Repos', value: gh.repos || 0, icon: GitFork, color: '#00ff88' },
          { label: 'Total Stars', value: gh.stars || 0, icon: Star, color: '#f59e0b' },
          { label: 'Followers', value: gh.followers || 0, icon: Users, color: '#06b6d4' },
          { label: 'Following', value: gh.following || 0, icon: Users, color: '#8b949e' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} style={{ color }} />
              <span className="text-xs" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>{label}</span>
            </div>
            <div className="text-3xl font-bold" style={{ fontFamily: 'Space Mono', color }}>{value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Language distribution */}
        {langChartData.length > 0 && (
          <div className="card p-5">
            <h2 className="font-semibold text-sm mb-5" style={{ fontFamily: 'Space Mono' }}>Language Distribution</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={langChartData} margin={{ left: -20 }}>
                <XAxis dataKey="name" tick={{ fill: '#8b949e', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid #21262d', borderRadius: 8, color: '#e6edf3' }} />
                <Bar dataKey="count" fill="#00ff88" radius={[4, 4, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Profile summary */}
        <div className="card p-5">
          <h2 className="font-semibold text-sm mb-5" style={{ fontFamily: 'Space Mono' }}>Profile Summary</h2>
          {data?.profile?.avatarUrl && (
            <div className="flex items-center gap-4 mb-5 p-4 rounded-lg" style={{ background: '#161b22' }}>
              <img src={data.profile.avatarUrl} alt="" className="w-14 h-14 rounded-full" style={{ border: '2px solid rgba(0,255,136,0.4)' }} />
              <div>
                <div className="font-bold">{data?.profile?.name}</div>
                <div className="text-sm" style={{ color: '#00ff88' }}>@{data?.profile?.githubUsername}</div>
                <a href={`https://github.com/${data?.profile?.githubUsername}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1 text-xs mt-1 hover:text-green-400 transition-colors" style={{ color: '#8b949e' }}>
                  View on GitHub <ExternalLink size={10} />
                </a>
              </div>
            </div>
          )}
          <div className="space-y-3">
            {[
              { label: 'Repos per follower', value: gh.followers > 0 ? (gh.repos / gh.followers).toFixed(2) : '—' },
              { label: 'Avg stars per repo', value: gh.repos > 0 ? (gh.stars / gh.repos).toFixed(1) : '—' },
              { label: 'Unique languages', value: Object.keys(langData).length },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#161b22' }}>
                <span className="text-xs" style={{ color: '#8b949e' }}>{label}</span>
                <span className="text-sm font-mono font-bold" style={{ color: '#00ff88' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All repos */}
      <div className="card p-5">
        <h2 className="font-semibold text-sm mb-5" style={{ fontFamily: 'Space Mono' }}>Recent Repositories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(gh.recentRepos || []).map((repo, i) => (
            <a key={i} href={repo.url} target="_blank" rel="noreferrer"
              className="block p-4 rounded-lg group transition-all"
              style={{ background: '#161b22', border: '1px solid #21262d' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,255,136,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#21262d'}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-medium text-sm group-hover:text-green-400 transition-colors">{repo.name}</span>
                <div className="flex items-center gap-1" style={{ color: '#f59e0b' }}>
                  <Star size={12} />
                  <span className="text-xs font-mono">{repo.stars}</span>
                </div>
              </div>
              {repo.description && <p className="text-xs mb-3 line-clamp-2" style={{ color: '#8b949e' }}>{repo.description}</p>}
              <div className="flex items-center justify-between">
                {repo.language && <span className="lang-badge">{repo.language}</span>}
                <span className="text-xs" style={{ color: '#8b949e' }}>{new Date(repo.updatedAt).toLocaleDateString()}</span>
              </div>
            </a>
          ))}
          {(!gh.recentRepos || gh.recentRepos.length === 0) && (
            <div className="col-span-2 text-center py-12" style={{ color: '#8b949e' }}>
              <Github size={32} className="mx-auto mb-3 opacity-30" />
              <p>No repositories found. Set your GitHub username in Settings and sync.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
