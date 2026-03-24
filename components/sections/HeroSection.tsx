'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Twitter, Instagram, Mail, Download, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const TechGlobe = dynamic(() => import('@/components/three/TechGlobe'), {
  ssr: false, loading: () => <div className="w-full h-full" />
})

// Tech for marquee with emoji icons
const TECH_MARQUEE = [
  { name: 'Python', icon: '🐍' }, { name: 'TensorFlow', icon: '🧠' }, { name: 'PyTorch', icon: '🔥' },
  { name: 'FastAPI', icon: '⚡' }, { name: 'Node.js', icon: '🟢' }, { name: 'PostgreSQL', icon: '🐘' },
  { name: 'Docker', icon: '🐳' }, { name: 'React', icon: '⚛️' }, { name: 'Next.js', icon: '▲' },
  { name: 'Scikit-Learn', icon: '📊' }, { name: 'Pandas', icon: '🐼' }, { name: 'LangChain', icon: '⛓️' },
  { name: 'Redis', icon: '🔴' }, { name: 'MongoDB', icon: '🍃' }, { name: 'TypeScript', icon: '🔷' },
  { name: 'Linux', icon: '🐧' }, { name: 'NumPy', icon: '🔢' }, { name: 'Git', icon: '🌿' },
  { name: 'AWS', icon: '☁️' }, { name: 'Django', icon: '🎸' },
]

function useTyping(texts: string[], speed = 70, pause = 2200) {
  const [display, setDisplay] = useState('')
  const [ti, setTi] = useState(0)
  const [ci, setCi] = useState(0)
  const [del, setDel] = useState(false)

  useEffect(() => {
    if (!texts.length) return
    const cur = texts[ti]
    if (!del && ci < cur.length) {
      const t = setTimeout(() => setCi(c => c + 1), speed)
      return () => clearTimeout(t)
    }
    if (!del && ci === cur.length) {
      const t = setTimeout(() => setDel(true), pause)
      return () => clearTimeout(t)
    }
    if (del && ci > 0) {
      const t = setTimeout(() => setCi(c => c - 1), speed / 2)
      return () => clearTimeout(t)
    }
    if (del && ci === 0) { setDel(false); setTi(i => (i + 1) % texts.length) }
  }, [ci, del, ti, texts, speed, pause])

  useEffect(() => { setDisplay(texts[ti]?.slice(0, ci) ?? '') }, [ci, ti, texts])
  return display
}

interface Profile {
  tagline: string; bio: string; github: string; linkedin: string; twitter: string
  instagram: string; email: string; cvUrl?: string | null; avatarUrl?: string | null
  isAvailable: boolean; typingTexts: string[]
}

export default function HeroSection({ profile }: { profile: Profile }) {
  const texts = profile.typingTexts?.length ? profile.typingTexts : ['AI Engineer', 'Backend Developer', 'ML Enthusiast']
  const typed = useTyping(texts)
  const doubled = [...TECH_MARQUEE, ...TECH_MARQUEE]

  const socials = [
    { icon: Github, href: profile.github, label: 'GitHub' },
    { icon: Linkedin, href: profile.linkedin, label: 'LinkedIn' },
    { icon: Twitter, href: profile.twitter, label: 'Twitter' },
    { icon: Instagram, href: profile.instagram, label: 'Instagram' },
    { icon: Mail, href: profile.email ? `mailto:${profile.email}` : '', label: 'Email' },
  ].filter(s => s.href)

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute inset-0 hex-pattern opacity-100 pointer-events-none" />
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/5 w-[550px] h-[550px] bg-accent/3 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] bg-accent-2/3 rounded-full blur-[110px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24 pb-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center min-h-[calc(100vh-180px)]">

          {/* LEFT */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            {/* Status */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-7">
              <span className="tag">
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${profile.isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {profile.isAvailable ? 'Available for Opportunities' : 'Currently Busy'}
              </span>
            </motion.div>

            {/* Name */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="mb-6">
              <p className="text-text-muted text-xs tracking-[0.28em] uppercase mb-3" style={{ fontFamily: 'var(--font-jetbrains)' }}>Hello, I&apos;m</p>
              <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(3rem, 7.5vw, 6rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95 }}>
                <span className="text-text-primary block">HARIDEV</span>
                <span className="gradient-text block">SHAJI</span>
              </h1>
            </motion.div>

            {/* Typing — big, no "Aspiring" prefix */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mb-9 h-14 flex items-center">
              <span style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--accent)', minWidth: '280px', display: 'inline-block' }}>
                {typed}<span className="cursor-blink" style={{ color: 'var(--accent)' }}>|</span>
              </span>
            </motion.div>

            {/* Socials */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }} className="flex items-center gap-3 mb-9">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer" title={label}
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-text-muted hover:text-accent border border-white/5 hover:border-accent/30 transition-all duration-200 hover:scale-110">
                  <Icon size={17} />
                </a>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }} className="flex flex-wrap gap-3">
              {profile.cvUrl && (
                <a href={profile.cvUrl} download className="btn-primary flex items-center gap-2"><Download size={15} />Download Resume</a>
              )}
              <Link href="/projects" className="btn-outline flex items-center gap-2"><ExternalLink size={15} />View My Work</Link>
              <button onClick={() => scrollTo('contact')}
                className="px-6 py-3 rounded-lg text-sm font-semibold text-text-secondary border border-white/8 hover:border-white/18 hover:text-text-primary transition-all"
                style={{ fontFamily: 'var(--font-syne)' }}>
                Contact Me
              </button>
            </motion.div>
          </div>

          {/* RIGHT — 3D Model */}
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center order-1 lg:order-2 h-[420px] lg:h-[560px]">
            <TechGlobe />
          </motion.div>
        </div>
      </div>

      {/* Marquee with icons */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        className="relative z-10 w-full overflow-hidden border-t border-b border-white/4 py-3.5 bg-white/[0.01]">
        <div className="flex marquee-track whitespace-nowrap">
          {doubled.map((t, i) => (
            <span key={i} className="inline-flex items-center gap-2 mx-6 text-text-muted text-xs" style={{ fontFamily: 'var(--font-jetbrains)' }}>
              <span className="text-base">{t.icon}</span>
              {t.name}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Scroll */}
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        onClick={() => scrollTo('about')}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-text-muted hover:text-accent transition-colors z-10">
        <span className="text-[9px] tracking-[0.25em] uppercase" style={{ fontFamily: 'var(--font-jetbrains)' }}>scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}><ArrowDown size={13} /></motion.div>
      </motion.button>
    </section>
  )
}
