'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Briefcase, MapPin, Calendar } from 'lucide-react'

const education = [
  {
    institution: 'Lovely Professional University',
    location: 'Phagwara, Punjab',
    degree: 'B.Tech — Computer Science & Engineering (AI & ML)',
    duration: 'August 2023 – June 2027',
  },
  {
    institution: 'Bharatiya Vidya Bhavan School',
    location: 'Calicut, Kerala',
    degree: 'Intermediate (Class XII)',
    duration: 'Jun 2022 – Mar 2023',
  },
  {
    institution: 'Bharatiya Vidya Bhavan',
    location: 'Calicut, Kerala',
    degree: 'Matriculation (Class X)',
    duration: 'Jun 2021 – May 2022',
  },
]

const stats = [
  { value: '2+', label: 'Years Coding' },
  { value: '10+', label: 'Projects Built' },
  { value: 'AI/ML', label: 'Specialization' },
  { value: 'LPU', label: 'University' },
]

interface Profile { bio: string; avatarUrl?: string | null }
interface Achievement { id: string; title: string; description: string; date: string }

export default function AboutSection({ profile, achievements }: { profile: Profile; achievements?: Achievement[] }) {
  return (
    <section id="about" className="section-padding relative">
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }} className="text-center mb-20">
          <p className="text-accent text-xs font-medium tracking-[0.25em] uppercase mb-4" style={{ fontFamily: 'var(--font-jetbrains)' }}>Get to know me</p>
          <h2 className="section-title" style={{ fontFamily: 'var(--font-syne)' }}>About <span className="gradient-text">Me</span></h2>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-6 text-center border border-white/5 hover:border-accent/15 transition-all">
              <div className="text-3xl font-bold gradient-text mb-2" style={{ fontFamily: 'var(--font-syne)' }}>{s.value}</div>
              <div className="text-text-muted text-xs uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Main layout — avatar + bio side by side */}
        <div className="grid lg:grid-cols-5 gap-12 items-start mb-20">

          {/* Avatar */}
          {profile.avatarUrl && (
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="lg:col-span-2 flex justify-center">
              <div className="relative">
                {/* Glow behind */}
                <div className="absolute inset-0 bg-accent/8 rounded-3xl blur-2xl scale-110" />
                {/* Border frame */}
                <div className="relative rounded-2xl overflow-hidden border border-accent/15"
                  style={{ width: '280px', maxWidth: '100%' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatarUrl}
                    alt="Haridev Shaji"
                    className="w-full object-cover object-top"
                    style={{
                      maxHeight: '420px',
                      mixBlendMode: 'screen',
                      filter: 'contrast(1.05) brightness(1.02)',
                    }}
                  />
                  {/* Bottom gradient fade */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/50 to-transparent" />
                </div>
                {/* Name badge below image */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.4 }}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass rounded-xl px-4 py-2 border border-accent/20 whitespace-nowrap">
                  <p className="text-accent text-sm font-bold" style={{ fontFamily: 'var(--font-syne)' }}>Haridev Shaji</p>
                  <p className="text-text-muted text-xs text-center">AI/ML Student @ LPU</p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Bio */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className={profile.avatarUrl ? 'lg:col-span-3' : 'lg:col-span-5 max-w-3xl mx-auto text-center'}>
            <h3 className="text-2xl font-bold text-text-primary mb-4" style={{ fontFamily: 'var(--font-syne)' }}>Who I Am</h3>
            <p className="text-text-secondary leading-relaxed mb-5">{profile.bio}</p>
            <div className="glass rounded-xl p-4 border border-emerald-500/15 bg-emerald-500/3">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-sm font-semibold" style={{ fontFamily: 'var(--font-syne)' }}>Currently</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                3rd year B.Tech student at LPU specializing in AI & ML. Actively building projects in machine learning, backend systems, and exploring LLM applications.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Education + Experience */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Education */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <GraduationCap size={20} className="text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-syne)' }}>Education</h3>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-px bg-gradient-to-b from-accent/40 via-accent/10 to-transparent" />
              <div className="space-y-6">
                {education.map((edu, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative pl-12">
                    <div className="absolute left-0 top-2 w-9 h-9 rounded-full bg-surface-2 border border-accent/25 flex items-center justify-center text-accent text-xs font-bold" style={{ fontFamily: 'var(--font-syne)' }}>{i + 1}</div>
                    <div className="glass rounded-xl p-5 border border-white/5 hover:border-accent/12 transition-all">
                      <h4 className="font-semibold text-text-primary mb-1 text-sm" style={{ fontFamily: 'var(--font-syne)' }}>{edu.institution}</h4>
                      <p className="text-accent text-xs mb-2">{edu.degree}</p>
                      <div className="flex flex-wrap gap-3 text-text-muted text-xs">
                        <span className="flex items-center gap-1"><MapPin size={10} />{edu.location}</span>
                        <span className="flex items-center gap-1"><Calendar size={10} />{edu.duration}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Experience */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Briefcase size={20} className="text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary" style={{ fontFamily: 'var(--font-syne)' }}>Experience</h3>
            </div>
            {achievements && achievements.length > 0 ? (
              <div className="space-y-4">
                {achievements.map((exp, i) => (
                  <motion.div key={exp.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="glass rounded-xl p-5 border border-white/5 hover:border-accent/12 transition-all">
                    <h4 className="font-semibold text-text-primary mb-1 text-sm" style={{ fontFamily: 'var(--font-syne)' }}>{exp.title}</h4>
                    <p className="text-text-secondary text-sm leading-relaxed">{exp.description}</p>
                    {exp.date && <span className="inline-flex items-center gap-1 mt-2 text-text-muted text-xs"><Calendar size={10} />{exp.date}</span>}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass rounded-2xl p-8 border border-white/5 text-center">
                <p className="text-text-muted text-sm">Experience entries can be added via the admin panel under Achievements.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
