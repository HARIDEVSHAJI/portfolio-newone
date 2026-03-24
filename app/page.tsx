import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ServicesSection from '@/components/sections/ServicesSection'
import AchievementsSection from '@/components/sections/AchievementsSection'
import ContactSection from '@/components/sections/ContactSection'
import CursorGlow from '@/components/ui/CursorGlow'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [profile, skills, services, achievements] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.skill.findMany({ orderBy: { order: 'asc' } }),
    prisma.service.findMany({ orderBy: { order: 'asc' } }),
    prisma.achievement.findMany({ orderBy: { order: 'asc' } }),
  ])

  const p = profile ?? {
    tagline: 'AI Engineer & Backend Developer',
    bio: "I'm Haridev Shaji, a Computer Science student at Lovely Professional University specializing in AI & ML. Passionate about building intelligent systems and scalable backend architectures.",
    github: 'https://github.com/haridevshaji',
    linkedin: 'https://linkedin.com/in/haridevshaji',
    twitter: '', instagram: '',
    email: 'haridevshaji@gmail.com',
    phone: '',
    location: 'Punjab, India',
    cvUrl: null, avatarUrl: null,
    isAvailable: true,
    typingTexts: ['AI Engineer', 'Backend Developer', 'ML Enthusiast', 'Problem Solver'],
  }

  return (
    <main className="min-h-screen bg-background noise-overlay">
      <CursorGlow />
      <Navbar cvUrl={p.cvUrl} />
      <HeroSection profile={p} />
      <AboutSection profile={p} achievements={achievements} />
      <SkillsSection skills={skills} />
      <ServicesSection services={services} />
      <AchievementsSection achievements={achievements} />
      <ContactSection profile={p} />
      <Footer profile={p} />
    </main>
  )
}
