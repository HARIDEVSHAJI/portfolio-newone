import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Admin
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'Admin@1234',
    12
  )
  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@haridev.dev' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@haridev.dev',
      password: hashedPassword,
    },
  })
  console.log('✅ Admin created')

  // Profile
  await prisma.profile.upsert({
    where: { id: 'default-profile' },
    update: {},
    create: {
      id: 'default-profile',
      tagline: 'Aspiring AI Engineer & Backend Developer',
      bio: "I'm Haridev Shaji, a Computer Science student specializing in AI & ML at Lovely Professional University. I'm passionate about building intelligent systems, scalable backend architectures, and turning ideas into impactful digital products. I believe in continuous learning and love exploring the intersection of AI and software engineering.",
      github: 'https://github.com/haridevshaji',
      linkedin: 'https://linkedin.com/in/haridevshaji',
      twitter: '',
      instagram: '',
      email: 'haridevshaji@gmail.com',
      location: 'Punjab, India',
      isAvailable: true,
      phone: '',
      typingTexts: ['AI Engineer', 'Backend Developer', 'ML Enthusiast', 'Problem Solver'],
    },
  })
  console.log('✅ Profile created')

  // Skills - AI/ML & Backend Engineering stack
  const skills = [
    // AI/ML
    { name: 'Python', category: 'AI / ML', iconName: 'python', level: 90, order: 1 },
    { name: 'TensorFlow', category: 'AI / ML', iconName: 'tensorflow', level: 80, order: 2 },
    { name: 'PyTorch', category: 'AI / ML', iconName: 'pytorch', level: 75, order: 3 },
    { name: 'Scikit-Learn', category: 'AI / ML', iconName: 'sklearn', level: 85, order: 4 },
    { name: 'Pandas', category: 'AI / ML', iconName: 'pandas', level: 88, order: 5 },
    { name: 'NumPy', category: 'AI / ML', iconName: 'numpy', level: 88, order: 6 },
    { name: 'OpenCV', category: 'AI / ML', iconName: 'opencv', level: 72, order: 7 },
    { name: 'LangChain', category: 'AI / ML', iconName: 'langchain', level: 70, order: 8 },
    // Backend
    { name: 'Node.js', category: 'Backend', iconName: 'nodejs', level: 85, order: 9 },
    { name: 'FastAPI', category: 'Backend', iconName: 'fastapi', level: 82, order: 10 },
    { name: 'Express.js', category: 'Backend', iconName: 'express', level: 85, order: 11 },
    { name: 'Django', category: 'Backend', iconName: 'django', level: 75, order: 12 },
    { name: 'PostgreSQL', category: 'Backend', iconName: 'postgresql', level: 80, order: 13 },
    { name: 'MongoDB', category: 'Backend', iconName: 'mongodb', level: 78, order: 14 },
    { name: 'Redis', category: 'Backend', iconName: 'redis', level: 70, order: 15 },
    { name: 'Docker', category: 'DevOps', iconName: 'docker', level: 75, order: 16 },
    // Frontend
    { name: 'React', category: 'Frontend', iconName: 'react', level: 80, order: 17 },
    { name: 'TypeScript', category: 'Frontend', iconName: 'typescript', level: 78, order: 18 },
    { name: 'Next.js', category: 'Frontend', iconName: 'nextjs', level: 75, order: 19 },
    // Tools
    { name: 'Git', category: 'Tools', iconName: 'git', level: 90, order: 20 },
    { name: 'Linux', category: 'Tools', iconName: 'linux', level: 82, order: 21 },
    { name: 'REST APIs', category: 'Backend', iconName: 'api', level: 90, order: 22 },
  ]

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { id: `skill-${skill.order}` },
      update: {},
      create: { id: `skill-${skill.order}`, ...skill },
    })
  }
  console.log('✅ Skills created')

  // Services
  const services = [
    {
      id: 'svc-1',
      title: 'Backend Development',
      description: 'Building high-performance, scalable server-side applications using Node.js, FastAPI, Django, and modern REST/GraphQL APIs. From architecture to deployment.',
      iconName: 'server',
      order: 1,
    },
    {
      id: 'svc-2',
      title: 'AI / ML Development',
      description: 'Designing and deploying machine learning models, NLP systems, computer vision pipelines, and LLM-powered applications tailored to real-world problems.',
      iconName: 'brain',
      order: 2,
    },
    {
      id: 'svc-3',
      title: 'System Architecture',
      description: 'Designing robust, cloud-ready backend system architectures with microservices, database optimization, caching layers, and CI/CD pipelines.',
      iconName: 'layers',
      order: 3,
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: {},
      create: service,
    })
  }
  console.log('✅ Services created')

  // Achievements
  const achievements = [
    {
      id: 'ach-1',
      title: 'LPU Smart India Hackathon Finalist',
      description: 'Selected as a finalist in the Smart India Hackathon conducted at LPU campus among hundreds of teams.',
      iconName: 'trophy',
      date: '2024',
      order: 1,
    },
    {
      id: 'ach-2',
      title: 'Dean\'s Merit List',
      description: 'Recognized on the Dean\'s Merit List at Lovely Professional University for academic excellence.',
      iconName: 'star',
      date: '2024',
      order: 2,
    },
    {
      id: 'ach-3',
      title: 'AWS Cloud Practitioner Certified',
      description: 'Earned the AWS Cloud Practitioner certification, demonstrating foundational cloud computing expertise.',
      iconName: 'cloud',
      date: '2024',
      order: 3,
    },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { id: achievement.id },
      update: {},
      create: achievement,
    })
  }
  console.log('✅ Achievements created')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
