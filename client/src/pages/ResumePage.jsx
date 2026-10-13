import { useEffect, useState } from 'react';
import { api } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { FileText, Plus, Trash2, Download, Briefcase, GraduationCap, Code2, Award, ExternalLink } from 'lucide-react';

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(6,8,16,0.85)', backdropFilter: 'blur(4px)' }}>
      <div className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold" style={{ fontFamily: 'Space Mono' }}>{title}</h3>
          <button onClick={onClose} className="btn-ghost py-1 px-3 text-sm">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function ResumePage() {
  const { user } = useAuth();
  const [resume, setResume] = useState({ experience: [], education: [], projects: [], certifications: [] });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    api.get('/resume').then(r => setResume(r.data || { experience: [], education: [], projects: [], certifications: [] })).finally(() => setLoading(false));
  }, []);

  const save = async (section, newData) => {
    const updated = { ...resume, [section]: newData };
    setResume(updated);
    await api.put('/resume', updated);
  };

  const addItem = async (section) => {
    const updated = [...(resume[section] || []), form];
    await save(section, updated);
    setModal(null);
    setForm({});
  };

  const removeItem = async (section, idx) => {
    const updated = resume[section].filter((_, i) => i !== idx);
    await save(section, updated);
  };

  const downloadResume = () => {
    const content = `
${user?.name?.toUpperCase()}
${user?.email || ''} | github.com/${user?.githubUsername || ''} | leetcode.com/${user?.leetcodeUsername || ''}

EXPERIENCE
${(resume.experience || []).map(e => `${e.role} @ ${e.company} (${e.startDate} - ${e.endDate || 'Present'})\n${e.description}`).join('\n\n')}

EDUCATION
${(resume.education || []).map(e => `${e.degree} in ${e.field} - ${e.institution} (${e.startDate} - ${e.endDate})`).join('\n')}

PROJECTS
${(resume.projects || []).map(p => `${p.title}: ${p.description}\nStack: ${(p.techStack || []).join(', ')}`).join('\n\n')}

CERTIFICATIONS
${(resume.certifications || []).map(c => `${c.title} - ${c.issuer} (${c.date})`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user?.name?.replace(' ', '_')}_Resume.txt`;
    a.click();
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-pulse text-lg" style={{ fontFamily: 'Space Mono', color: '#06b6d4' }}>Loading resume...</div></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)' }}>
            <FileText size={20} style={{ color: '#06b6d4' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Space Mono' }}>Resume Builder</h1>
            <p className="text-xs" style={{ color: '#8b949e' }}>Auto-updated from your GitHub & LeetCode</p>
          </div>
        </div>
        <button onClick={downloadResume} className="btn-primary flex items-center gap-2">
          <Download size={14} />
          Export
        </button>
      </div>

      {/* Sections */}
      {[
        {
          key: 'experience', label: 'Experience', icon: Briefcase, color: '#00ff88',
          renderItem: (item, i) => (
            <div key={i} className="p-4 rounded-lg" style={{ background: '#161b22', border: '1px solid #21262d' }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{item.role}</div>
                  <div className="text-sm" style={{ color: '#00ff88' }}>{item.company}</div>
                  <div className="text-xs mt-1" style={{ color: '#8b949e' }}>{item.startDate} — {item.endDate || 'Present'}</div>
                  {item.description && <p className="text-sm mt-2" style={{ color: '#8b949e' }}>{item.description}</p>}
                </div>
                <button onClick={() => removeItem('experience', i)} className="p-1 rounded hover:bg-red-500/10 transition-colors" style={{ color: '#8b949e' }}><Trash2 size={14} /></button>
              </div>
            </div>
          ),
          form: (
            <div className="space-y-3">
              {[['role', 'Job Title'], ['company', 'Company'], ['startDate', 'Start Date'], ['endDate', 'End Date (or blank for Present)'], ['description', 'Description']].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-xs mb-1.5" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>{label}</label>
                  {key === 'description' ? <textarea className="input" rows={3} value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })} /> : <input className="input" value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })} />}
                </div>
              ))}
            </div>
          )
        },
        {
          key: 'education', label: 'Education', icon: GraduationCap, color: '#7c3aed',
          renderItem: (item, i) => (
            <div key={i} className="p-4 rounded-lg" style={{ background: '#161b22', border: '1px solid #21262d' }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{item.degree} in {item.field}</div>
                  <div className="text-sm" style={{ color: '#7c3aed' }}>{item.institution}</div>
                  <div className="text-xs mt-1" style={{ color: '#8b949e' }}>{item.startDate} — {item.endDate} {item.gpa && `• GPA: ${item.gpa}`}</div>
                </div>
                <button onClick={() => removeItem('education', i)} className="p-1 rounded hover:bg-red-500/10 transition-colors" style={{ color: '#8b949e' }}><Trash2 size={14} /></button>
              </div>
            </div>
          ),
          form: (
            <div className="space-y-3">
              {[['institution', 'Institution'], ['degree', 'Degree'], ['field', 'Field of Study'], ['startDate', 'Start Year'], ['endDate', 'End Year'], ['gpa', 'GPA (optional)']].map(([key, label]) => (
                <div key={key}><label className="block text-xs mb-1.5" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>{label}</label><input className="input" value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })} /></div>
              ))}
            </div>
          )
        },
        {
          key: 'projects', label: 'Projects', icon: Code2, color: '#f59e0b',
          renderItem: (item, i) => (
            <div key={i} className="p-4 rounded-lg" style={{ background: '#161b22', border: '1px solid #21262d' }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.title}</span>
                    {item.featured && <span className="stat-pill text-xs">featured</span>}
                  </div>
                  <p className="text-sm mt-1" style={{ color: '#8b949e' }}>{item.description}</p>
                  {item.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {item.techStack.map((t, ti) => <span key={ti} className="lang-badge">{t}</span>)}
                    </div>
                  )}
                  <div className="flex gap-3 mt-2">
                    {item.githubUrl && <a href={item.githubUrl} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1" style={{ color: '#8b949e' }}>GitHub <ExternalLink size={10} /></a>}
                    {item.liveUrl && <a href={item.liveUrl} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1" style={{ color: '#00ff88' }}>Live <ExternalLink size={10} /></a>}
                  </div>
                </div>
                <button onClick={() => removeItem('projects', i)} className="p-1 rounded hover:bg-red-500/10 transition-colors" style={{ color: '#8b949e' }}><Trash2 size={14} /></button>
              </div>
            </div>
          ),
          form: (
            <div className="space-y-3">
              {[['title', 'Project Title'], ['description', 'Description'], ['techStack', 'Tech Stack (comma separated)'], ['githubUrl', 'GitHub URL'], ['liveUrl', 'Live URL']].map(([key, label]) => (
                <div key={key}><label className="block text-xs mb-1.5" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>{label}</label><input className="input" value={key === 'techStack' ? (form[key] || []).join(', ') : form[key] || ''} onChange={e => setForm({ ...form, [key]: key === 'techStack' ? e.target.value.split(',').map(s => s.trim()) : e.target.value })} /></div>
              ))}
            </div>
          )
        },
      ].map(({ key, label, icon: Icon, color, renderItem, form: formContent }) => (
        <div key={key} className="card p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon size={16} style={{ color }} />
              <h2 className="font-semibold text-sm" style={{ fontFamily: 'Space Mono' }}>{label}</h2>
              <span className="stat-pill">{(resume[key] || []).length}</span>
            </div>
            <button onClick={() => { setModal(key); setForm({}); }} className="btn-ghost flex items-center gap-1.5 text-xs py-1.5 px-3">
              <Plus size={12} /> Add
            </button>
          </div>
          <div className="space-y-3">
            {(resume[key] || []).map((item, i) => renderItem(item, i))}
            {(!resume[key] || resume[key].length === 0) && (
              <p className="text-sm text-center py-6" style={{ color: '#8b949e' }}>No {label.toLowerCase()} added yet</p>
            )}
          </div>
        </div>
      ))}

      {modal && (
        <Modal title={`Add ${modal.charAt(0).toUpperCase() + modal.slice(1)}`} onClose={() => setModal(null)}>
          {modal === 'experience' && <div className="space-y-3">{[['role', 'Job Title'], ['company', 'Company'], ['startDate', 'Start Date'], ['endDate', 'End Date'], ['description', 'Description']].map(([key, label]) => (<div key={key}><label className="block text-xs mb-1.5" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>{label}</label>{key === 'description' ? <textarea className="input" rows={3} value={form[key] || ''} onChange={e => setForm({...form, [key]: e.target.value})} /> : <input className="input" value={form[key] || ''} onChange={e => setForm({...form, [key]: e.target.value})} />}</div>))}</div>}
          {modal === 'education' && <div className="space-y-3">{[['institution', 'Institution'], ['degree', 'Degree'], ['field', 'Field'], ['startDate', 'Start'], ['endDate', 'End'], ['gpa', 'GPA']].map(([key, label]) => (<div key={key}><label className="block text-xs mb-1.5" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>{label}</label><input className="input" value={form[key] || ''} onChange={e => setForm({...form, [key]: e.target.value})} /></div>))}</div>}
          {modal === 'projects' && <div className="space-y-3">{[['title', 'Title'], ['description', 'Description'], ['techStack', 'Tech Stack (comma separated)'], ['githubUrl', 'GitHub URL'], ['liveUrl', 'Live URL']].map(([key, label]) => (<div key={key}><label className="block text-xs mb-1.5" style={{ color: '#8b949e', fontFamily: 'Fira Code' }}>{label}</label><input className="input" value={key === 'techStack' ? (form[key] || []).join(', ') : form[key] || ''} onChange={e => setForm({...form, [key]: key === 'techStack' ? e.target.value.split(',').map(s => s.trim()) : e.target.value})} /></div>))}</div>}
          <div className="flex justify-end gap-3 mt-5">
            <button onClick={() => setModal(null)} className="btn-ghost">Cancel</button>
            <button onClick={() => addItem(modal)} className="btn-primary">Add {modal}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
