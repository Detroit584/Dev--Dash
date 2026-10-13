import { useEffect, useState } from 'react';
import { api } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { Globe, Github, Star, Code2, ExternalLink, Trophy, Users, Copy, Check } from 'lucide-react';

export default function PortfolioPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/dashboard'), api.get('/resume')])
      .then(([d, r]) => { setData(d.data); setResume(r.data); })
      .finally(() => setLoading(false));
  }, []);

  const copyPortfolioLink = () => {
    const url = `${window.location.origin}/portfolio/${user?.githubUsername}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gh = data?.github || {};
  const lc = data?.leetcode || {};
  const profile = data?.profile || {};

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-pulse text-lg" style={{ fontFamily: 'Space Mono', color: '#06b6d4' }}>Loading portfolio...</div></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)' }}>
            <Globe size={20} style={{ color: '#06b6d4' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Space Mono' }}>Portfolio Preview</h1>
            <p className="text-xs" style={{ color: '#8b949e' }}>Auto-generated from your data</p>
          </div>
        </div>
        <button onClick={copyPortfolioLink} className="btn-primary flex items-center gap-2">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>

      {/* Portfolio preview card */}
      <div className="card overflow-hidden mb-6" style={{ background: '#0d1117' }}>
        {/* Hero */}
        <div className="relative p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.05) 0%, rgba(124,58,237,0.05) 100%)' }}>
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative z-10">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="w-20 h-20 rounded-full mx-auto mb-4" style={{ border: '3px solid rgba(0,255,136,0.5)', boxShadow: '0 0 30px rgba(0,255,136,0.2)' }} />
            ) : (
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold" style={{ background: 'rgba(0,255,136,0.1)', border: '3px solid rgba(0,255,136,0.3)', color: '#00ff88' }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Mono' }}>{profile.name || user?.name}</h2>
            <div className="flex items-center justify-center gap-2 text-sm mb-3" style={{ color: '#00ff88' }}>
              <Code2 size={14} />
              <span>Software Developer</span>
            </div>
            {profile.bio && <p className="max-w-md mx-auto text-sm" style={{ color: '#8b949e' }}>{profile.bio}</p>}

            <div className="flex items-center justify-center gap-4 mt-5">
              {profile.githubUsername && (
                <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-full transition-all"
                  style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', color: '#00ff88' }}>
                  <Github size={14} /> GitHub
                </a>
              )}
              {profile.leetcodeUsername && (
                <a href={`https://leetcode.com/${profile.leetcodeUsername}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-full transition-all"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b' }}>
                  <Code2 size={14} /> LeetCode
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 divide-x" style={{ borderTop: '1px solid #21262d', borderBottom: '1px solid #21262d', divideColor: '#21262d' }}>
          {[
            { label: 'Repos', value: gh.repos || 0, icon: Github },
            { label: 'Stars', value: gh.stars || 0, icon: Star },
            { label: 'LeetCode', value: lc.totalSolved || 0, icon: Trophy },
            { label: 'Followers', value: gh.followers || 0, icon: Users },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center py-5 px-3" style={{ borderRight: '1px solid #21262d' }}>
              <Icon size={14} className="mb-1.5" style={{ color: '#8b949e' }} />
              <span className="text-xl font-bold" style={{ fontFamily: 'Space Mono', color: '#e6edf3' }}>{value}</span>
              <span className="text-xs mt-0.5" style={{ color: '#8b949e' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Skills */}
        {(profile.skills?.length > 0 || user?.skills?.length > 0) && (
          <div className="p-6" style={{ borderBottom: '1px solid #21262d' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: 'Space Mono' }}>Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(profile.skills || user?.skills || []).map((skill, i) => (
                <span key={i} className="lang-badge">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* Featured projects */}
        {(resume?.projects?.length > 0) && (
          <div className="p-6" style={{ borderBottom: '1px solid #21262d' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: 'Space Mono' }}>Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {resume.projects.slice(0, 4).map((project, i) => (
                <div key={i} className="p-4 rounded-lg" style={{ background: '#161b22', border: '1px solid #21262d' }}>
                  <div className="font-medium text-sm mb-1">{project.title}</div>
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: '#8b949e' }}>{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {(project.techStack || []).slice(0, 3).map((t, ti) => (
                        <span key={ti} className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(0,255,136,0.08)', color: '#00ff88' }}>{t}</span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer"><Github size={14} style={{ color: '#8b949e' }} /></a>}
                      {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} style={{ color: '#00ff88' }} /></a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {resume?.experience?.length > 0 && (
          <div className="p-6">
            <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: 'Space Mono' }}>Experience</h3>
            <div className="space-y-3">
              {resume.experience.slice(0, 3).map((exp, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-0.5 bg-gradient-to-b from-green-500/50 to-transparent mt-1 flex-shrink-0" style={{ minHeight: '40px' }} />
                  <div>
                    <div className="font-medium text-sm">{exp.role}</div>
                    <div className="text-xs mb-1" style={{ color: '#00ff88' }}>{exp.company}</div>
                    <div className="text-xs" style={{ color: '#8b949e' }}>{exp.startDate} — {exp.endDate || 'Present'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-center" style={{ color: '#8b949e' }}>
        This portfolio is auto-generated and updates whenever you sync your data.
      </p>
    </div>
  );
}
