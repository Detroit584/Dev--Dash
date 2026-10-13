import { useState } from 'react';
import { useAuth, api } from '../context/AuthContext';
import { Settings, Github, Code2, User, Save, Check } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    githubUsername: user?.githubUsername || '',
    leetcodeUsername: user?.leetcodeUsername || '',
    linkedinUrl: user?.linkedinUrl || '',
    skills: (user?.skills || []).join(', '),
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/profile', {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)' }}>
          <Settings size={20} style={{ color: '#7c3aed' }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'Space Mono' }}>Settings</h1>
          <p className="text-xs" style={{ color: '#8b949e' }}>Manage your profile & integrations</p>
        </div>
      </div>

      {/* Profile */}
      <div className="card p-5 mb-5">
        <div className="flex items-center gap-2 mb-5">
          <User size={15} style={{ color: '#8b949e' }} />
          <h2 className="font-semibold text-sm" style={{ fontFamily: 'Space Mono' }}>Profile</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>name</label>
              <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>linkedin</label>
              <input className="input" placeholder="https://linkedin.com/in/..." value={form.linkedinUrl} onChange={e => setForm({...form, linkedinUrl: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>bio</label>
            <textarea className="input" rows={3} placeholder="Tell the world about yourself..." value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>skills (comma separated)</label>
            <input className="input" placeholder="React, Node.js, Python, MongoDB..." value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} />
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="card p-5 mb-5">
        <div className="flex items-center gap-2 mb-5">
          <Github size={15} style={{ color: '#8b949e' }} />
          <h2 className="font-semibold text-sm" style={{ fontFamily: 'Space Mono' }}>Integrations</h2>
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ background: '#161b22', border: '1px solid #21262d' }}>
            <div className="flex items-center gap-2 mb-3">
              <Github size={14} style={{ color: '#00ff88' }} />
              <span className="text-sm font-medium">GitHub</span>
              {form.githubUsername && <span className="stat-pill">connected</span>}
            </div>
            <label className="block text-xs mb-1.5" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>username</label>
            <input className="input" placeholder="octocat" value={form.githubUsername} onChange={e => setForm({...form, githubUsername: e.target.value})} />
          </div>

          <div className="p-4 rounded-lg" style={{ background: '#161b22', border: '1px solid #21262d' }}>
            <div className="flex items-center gap-2 mb-3">
              <Code2 size={14} style={{ color: '#f59e0b' }} />
              <span className="text-sm font-medium">LeetCode</span>
              {form.leetcodeUsername && <span className="stat-pill">connected</span>}
            </div>
            <label className="block text-xs mb-1.5" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>username</label>
            <input className="input" placeholder="leetcode_user" value={form.leetcodeUsername} onChange={e => setForm({...form, leetcodeUsername: e.target.value})} />
          </div>
        </div>
      </div>

      {/* Save button */}
      <button onClick={handleSave} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
        {saved ? <><Check size={16} /> Saved!</> : saving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
      </button>

      {/* Info box */}
      <div className="mt-5 p-4 rounded-lg" style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)' }}>
        <p className="text-xs" style={{ color: '#8b949e' }}>
          💡 After updating your usernames, use the <strong style={{ color: '#06b6d4' }}>Sync Data</strong> button in the sidebar to fetch your latest stats from GitHub and LeetCode.
        </p>
      </div>
    </div>
  );
}
