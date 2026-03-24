'use client'

import React, { useState, useCallback } from 'react'
import { signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Code, Briefcase, FolderOpen, Award, Trophy, MessageSquare,
  LogOut, Upload, Save, Trash2, Plus, X, Eye, EyeOff, ChevronDown,
  Home, Loader2, CheckCircle, Mail, ShieldCheck, Settings
} from 'lucide-react'
import Link from 'next/link'
import { ServicesTab, ProjectsTab, CertificatesTab, AchievementsTab, MessagesTab } from './AdminTabComponents'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Profile {
  id?: string; tagline: string; bio: string; github: string; linkedin: string
  twitter: string; instagram: string; email: string; location: string
  cvUrl?: string | null; avatarUrl?: string | null; isAvailable: boolean
  phone: string; typingTexts: string[]
}
interface Skill { id: string; name: string; category: string; iconName: string; level: number; order: number }
interface Service { id: string; title: string; description: string; iconName: string; order: number }
interface Project {
  id: string; title: string; slug: string; description: string; longDesc: string
  techStack: string[]; images: string[]; githubUrl?: string | null
  liveUrl?: string | null; featured: boolean; order: number
}
interface Certificate {
  id: string; title: string; issuer: string; issueDate: string
  description: string; imageUrl?: string | null; credentialUrl?: string | null; order: number
}
interface Achievement { id: string; title: string; description: string; iconName: string; date: string; order: number }
interface Message { id: string; name: string; email: string; message: string; isRead: boolean; createdAt: string }

interface InitialData {
  profile: Profile | null; skills: Skill[]; services: Service[]; projects: Project[]
  certificates: Certificate[]; achievements: Achievement[]; messages: Message[]
}

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const NAV = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'skills', label: 'Skills', icon: Code },
  { key: 'services', label: 'Services', icon: Briefcase },
  { key: 'projects', label: 'Projects', icon: FolderOpen },
  { key: 'certificates', label: 'Certificates', icon: Award },
  { key: 'achievements', label: 'Achievements', icon: Trophy },
  { key: 'messages', label: 'Messages', icon: MessageSquare },
]

// ─── Toast helper ─────────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const show = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }
  return { toast, show }
}

// ─── File uploader helper ─────────────────────────────────────────────────────
async function uploadFile(file: File, type: string): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('type', type)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Upload failed')
  const { url } = await res.json()
  return url
}


// ─── DB Status Widget ─────────────────────────────────────────────────────────
function DbStatusBadge() {
  const [status, setStatus] = React.useState<{ database: boolean; storage: boolean; dbLatency: number; storageConfigured: boolean; errors: string[] } | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch('/api/db-status').then(r => r.json()).then(d => { setStatus(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-white/5 text-text-muted text-xs">
      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      Checking...
    </div>
  )

  if (!status) return null

  const allOk = status.database && status.storage
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${allOk ? 'glass border-emerald-500/20 text-emerald-400' : 'glass border-red-500/20 text-red-400'}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${allOk ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
      <span>DB: {status.database ? `✓ ${status.dbLatency}ms` : '✗ Error'}</span>
      <span className="opacity-40">|</span>
      <span>Storage: {status.storageConfigured ? (status.storage ? '✓ Supabase' : '✗ Error') : '✓ Local'}</span>
      {status.errors.length > 0 && (
        <span title={status.errors.join('; ')} className="cursor-help opacity-60 ml-1">⚠</span>
      )}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminDashboardClient({ initialData }: { initialData: InitialData }) {
  const [tab, setTab] = useState('profile')
  const [data, setData] = useState(initialData)
  const { toast, show } = useToast()

  const refresh = useCallback(async (section: string) => {
    try {
      const res = await fetch(`/api/${section}`)
      const json = await res.json()
      setData((prev) => ({ ...prev, [section]: json }))
    } catch { /* ignore */ }
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar flex-shrink-0 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <ShieldCheck size={18} className="text-accent" />
            </div>
            <div>
              <p className="font-bold text-text-primary text-sm" style={{ fontFamily: 'var(--font-syne)' }}>
                Admin Panel
              </p>
              <p className="text-text-muted text-xs">Portfolio CMS</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                tab === key
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/4'
              }`}
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              <Icon size={17} />
              {label}
              {key === 'messages' && data.messages.filter((m) => !m.isRead).length > 0 && (
                <span className="ml-auto bg-accent text-background text-xs font-bold px-2 py-0.5 rounded-full">
                  {data.messages.filter((m) => !m.isRead).length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/4 transition-all"
          >
            <Home size={17} />
            View Portfolio
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/admin' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-400/8 transition-all"
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-30 glass-strong border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-text-primary" style={{ fontFamily: 'var(--font-syne)' }}>
            {NAV.find((n) => n.key === tab)?.label}
          </h2>
          <div className="flex items-center gap-3">
            <DbStatusBadge />
            <div className="hidden lg:flex items-center gap-2 text-xs text-text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Logged in as Admin
            </div>
          </div>
        </div>

        <div className="p-6 max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {tab === 'profile' && (
                <ProfileTab
                  profile={data.profile}
                  onSave={async (p) => {
                    const res = await fetch('/api/profile', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(p),
                    })
                    if (res.ok) { show('Profile saved!'); await refresh('profile') }
                    else show('Save failed', 'error')
                  }}
                  show={show}
                />
              )}
              {tab === 'skills' && (
                <SkillsTab data={data.skills} refresh={() => refresh('skills')} show={show} />
              )}
              {tab === 'services' && (
                <ServicesTab data={data.services} refresh={() => refresh('services')} show={show} />
              )}
              {tab === 'projects' && (
                <ProjectsTab data={data.projects} refresh={() => refresh('projects')} show={show} />
              )}
              {tab === 'certificates' && (
                <CertificatesTab data={data.certificates} refresh={() => refresh('certificates')} show={show} />
              )}
              {tab === 'achievements' && (
                <AchievementsTab data={data.achievements} refresh={() => refresh('achievements')} show={show} />
              )}
              {tab === 'messages' && (
                <MessagesTab data={data.messages} refresh={() => refresh('messages')} show={show} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-green-950 border-green-700/40 text-green-300'
                : 'bg-red-950 border-red-700/40 text-red-300'
            }`}
          >
            <CheckCircle size={16} />
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Shared UI helpers ────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-2"
        style={{ fontFamily: 'var(--font-jetbrains)' }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`form-input ${props.className ?? ''}`} />
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`form-input resize-none ${props.className ?? ''}`} />
}

function SaveBtn({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={loading} className="btn-primary flex items-center gap-2">
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
      Save Changes
    </button>
  )
}

function DeleteBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm transition-all"
    >
      <Trash2 size={15} />
      Delete
    </button>
  )
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab({
  profile, onSave, show
}: {
  profile: Profile | null
  onSave: (p: Profile) => Promise<void>
  show: (msg: string, type?: 'success' | 'error') => void
}) {
  const def: Profile = {
    tagline: '', bio: '', github: '', linkedin: '', twitter: '',
    instagram: '', email: '', location: '', isAvailable: true,
    cvUrl: null, avatarUrl: null, phone: '', typingTexts: ['AI Engineer', 'Backend Developer', 'ML Enthusiast', 'Problem Solver'],
  }
  const [form, setForm] = useState<Profile>(profile ?? def)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const set = (k: keyof Profile, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }))

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFile(file, 'cv')
      set('cvUrl', url)
      show('CV uploaded!')
    } catch { show('Upload failed', 'error') }
    setUploading(false)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFile(file, 'avatar')
      set('avatarUrl', url)
      show('Avatar uploaded!')
    } catch { show('Upload failed', 'error') }
    setUploading(false)
  }

  const save = async () => {
    setLoading(true)
    await onSave(form)
    setLoading(false)
  }

  return (
    <div className="space-y-8">
      {/* Avatar + CV upload */}
      <div className="glass rounded-2xl p-6 border border-white/5">
        <h3 className="font-bold text-text-primary mb-6" style={{ fontFamily: 'var(--font-syne)' }}>
          Media Files
        </h3>
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Avatar */}
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wider mb-3" style={{ fontFamily: 'var(--font-jetbrains)' }}>
              Profile Avatar
            </p>
            {form.avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.avatarUrl} alt="avatar" className="w-20 h-20 rounded-2xl object-cover border border-white/10 mb-3" />
            )}
            <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-accent/30 text-text-secondary hover:text-accent cursor-pointer transition-all text-sm w-fit">
              <Upload size={15} />
              {uploading ? 'Uploading...' : 'Upload Avatar'}
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>
          {/* CV */}
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wider mb-3" style={{ fontFamily: 'var(--font-jetbrains)' }}>
              Resume / CV (PDF)
            </p>
            {form.cvUrl && (
              <a href={form.cvUrl} target="_blank" rel="noopener noreferrer" className="block text-accent text-xs mb-3 hover:underline">
                Current: {form.cvUrl.split('/').pop()}
              </a>
            )}
            <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-accent/30 text-accent hover:bg-accent/8 cursor-pointer transition-all text-sm w-fit">
              <Upload size={15} />
              {uploading ? 'Uploading...' : 'Upload CV (PDF)'}
              <input type="file" accept="application/pdf" onChange={handleCVUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="glass rounded-2xl p-6 border border-white/5 space-y-5">
        <h3 className="font-bold text-text-primary" style={{ fontFamily: 'var(--font-syne)' }}>
          Bio & Info
        </h3>
        <Field label="Tagline (shown under name)">
          <Input value={form.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="Aspiring AI Engineer & Backend Developer" />
        </Field>
        <Field label="Bio (About section)">
          <Textarea value={form.bio} onChange={(e) => set('bio', e.target.value)} rows={5} placeholder="Tell your story..." />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Email">
            <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </Field>
          <Field label="Location">
            <Input value={form.location} onChange={(e) => set('location', e.target.value)} />
          </Field>
        </div>
        <Field label="Availability">
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={() => set('isAvailable', !form.isAvailable)}
              className={`relative w-12 h-6 rounded-full transition-colors ${form.isAvailable ? 'bg-accent' : 'bg-white/20'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.isAvailable ? 'left-7' : 'left-1'}`} />
            </button>
            <span className="text-text-secondary text-sm">
              {form.isAvailable ? 'Available for Opportunities' : 'Not Currently Available'}
            </span>
          </div>
        </Field>
      </div>

      {/* Social Links */}
      <div className="glass rounded-2xl p-6 border border-white/5 space-y-5">
        <h3 className="font-bold text-text-primary" style={{ fontFamily: 'var(--font-syne)' }}>
          Social Links
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="GitHub URL">
            <Input value={form.github} onChange={(e) => set('github', e.target.value)} placeholder="https://github.com/..." />
          </Field>
          <Field label="LinkedIn URL">
            <Input value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
          </Field>
          <Field label="Twitter URL (optional)">
            <Input value={form.twitter} onChange={(e) => set('twitter', e.target.value)} placeholder="https://twitter.com/..." />
          </Field>
          <Field label="Instagram URL (optional)">
            <Input value={form.instagram} onChange={(e) => set('instagram', e.target.value)} placeholder="https://instagram.com/..." />
          </Field>
        </div>
      </div>

      {/* Phone */}
      <div className="glass rounded-2xl p-6 border border-white/5 space-y-5">
        <h3 className="font-bold text-text-primary" style={{ fontFamily: 'var(--font-syne)' }}>Contact & Typed Texts</h3>
        <Field label="Phone Number (optional, e.g. +91 98765 43210)">
          <Input value={form.phone || ''} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" />
        </Field>
        <Field label="Typing Animation Texts (shown on homepage — one per line)">
          <Textarea
            value={(form.typingTexts || []).join('\n')}
            onChange={(e) => setForm((p) => ({ ...p, typingTexts: e.target.value.split('\n').filter(Boolean) }))}
            rows={5}
            placeholder={"AI Engineer\nBackend Developer\nML Enthusiast\nProblem Solver"}
          />
          <p className="text-text-muted text-xs mt-1">Each line = one text. The homepage will cycle through these.</p>
        </Field>
      </div>

      <div className="flex justify-end">
        <SaveBtn loading={loading} onClick={save} />
      </div>
    </div>
  )
}

// ─── Skills Tab ───────────────────────────────────────────────────────────────
function SkillsTab({ data, refresh, show }: { data: Skill[]; refresh: () => void; show: (m: string, t?: 'success' | 'error') => void }) {
  const blank = (): Omit<Skill, 'id'> => ({ name: '', category: 'AI / ML', iconName: 'code', level: 80, order: data.length })
  const [adding, setAdding] = useState(false)
  const [newSkill, setNewSkill] = useState(blank())
  const [loading, setLoading] = useState(false)

  const add = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/skills', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newSkill) })
      if (res.ok) { show('Skill added!'); setAdding(false); setNewSkill(blank()); refresh() }
      else show('Failed to add', 'error')
    } finally { setLoading(false) }
  }

  const del = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    await fetch('/api/skills', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    show('Skill deleted'); refresh()
  }

  const categories = ['AI / ML', 'Backend', 'Frontend', 'DevOps', 'Tools']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-text-secondary text-sm">{data.length} skills total</p>
        <button onClick={() => setAdding(!adding)} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
          <Plus size={15} /> Add Skill
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl p-6 border border-accent/20 space-y-4">
            <h3 className="font-bold text-text-primary" style={{ fontFamily: 'var(--font-syne)' }}>New Skill</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Skill Name"><Input value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} placeholder="Python" /></Field>
              <Field label="Category">
                <select value={newSkill.category} onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="form-input">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Icon Name (emoji shortcode)">
                <Input value={newSkill.iconName} onChange={(e) => setNewSkill({ ...newSkill, iconName: e.target.value })} placeholder="python" />
              </Field>
              <Field label={`Proficiency Level: ${newSkill.level}%`}>
                <input type="range" min={10} max={100} value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: Number(e.target.value) })}
                  className="w-full accent-accent" />
              </Field>
            </div>
            <div className="flex gap-3">
              <button onClick={add} disabled={loading} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add
              </button>
              <button onClick={() => setAdding(false)} className="btn-outline py-2 px-4 text-sm">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills list grouped by category */}
      {categories.map((cat) => {
        const catSkills = data.filter((s) => s.category === cat)
        if (catSkills.length === 0) return null
        return (
          <div key={cat} className="glass rounded-2xl p-6 border border-white/5">
            <h3 className="font-semibold text-accent text-sm mb-4" style={{ fontFamily: 'var(--font-syne)' }}>{cat}</h3>
            <div className="space-y-3">
              {catSkills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-4 p-3 rounded-xl bg-surface-2/50 hover:bg-surface-2 transition-colors">
                  <div className="flex-1">
                    <p className="text-text-primary text-sm font-medium">{skill.name}</p>
                    <div className="progress-bar mt-1.5 w-40">
                      <div className="progress-fill" style={{ width: `${skill.level}%` }} />
                    </div>
                  </div>
                  <span className="text-text-muted text-xs" style={{ fontFamily: 'var(--font-jetbrains)' }}>{skill.level}%</span>
                  <DeleteBtn onClick={() => del(skill.id)} />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
