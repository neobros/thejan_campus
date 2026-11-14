import { BookOpen, Eye, Gem, Globe, GraduationCap, Handshake, Layers, type LucideIcon, Medal, Play, Target, Users } from 'lucide-react'
import { cn } from '@/lib/cn'
import { AppLink } from '@/components/ui/AppLink'
import { Seo } from '@/lib/seo'
import styles from './AboutPage.module.css'

/** Official AIT launch documentary — set this URL when available. */
const DOCUMENTARY_URL = ''

const NAV: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'Our Story', href: '#our-story', icon: BookOpen },
  { label: 'Our Leadership', href: '#leadership', icon: Users },
  { label: 'Vision, Mission & Values', href: '#vision', icon: Target },
  { label: 'A Journey From AusAsia', href: '#journey', icon: Layers },
  { label: 'Our Commitment', href: '#commitment', icon: Handshake },
]

const PILLARS: { label: string; icon: LucideIcon }[] = [
  { label: 'Quality Education', icon: Medal },
  { label: 'Learner Success', icon: GraduationCap },
  { label: 'Industry Relevance', icon: Users },
  { label: 'Global Opportunities', icon: Globe },
  { label: 'Trusted Partnerships', icon: Handshake },
]

export default function AboutPage() {
  return (
    <div className={styles.aboutRoot}>
      <Seo
        title="About AIT"
        description="A new vision for international education in Sri Lanka — the story, the leadership and the beliefs that shape the Australian Institute of Technology."
      />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.wrap}>
          <h1>About AIT</h1>
          <h2>A New Vision for International Education in Sri Lanka</h2>
          <p>The story, purpose and people behind the Australian Institute of Technology.</p>
        </div>
      </section>

      {/* Floating section navigation */}
      <div className={styles.wrap}>
        <nav className={styles.jump} aria-label="On this page">
          {NAV.map(({ label, href, icon: Icon }) => (
            <a key={href} href={href}>
              <Icon className={styles.icon} />
              {label}
            </a>
          ))}
        </nav>
      </div>

      {/* Our Story & Leadership */}
      <section id="our-story" className={styles.section}>
        <div className={cn(styles.wrap, styles.story)}>
          <div className={styles.storyCopy}>
            <p className={styles.eyebrow}>
              <span aria-hidden className={styles.slash} />
              Our Story
            </p>
            <h2>The Story Behind AIT</h2>
            <p>
              The Australian Institute of Technology (AIT) was established with a vision to bring international education and globally relevant learning opportunities closer to Sri
              Lankan learners.
            </p>
            <p>
              Built on industry experience and strong international partnerships, AIT connects students and professionals with selected Australian education programmes, practical
              training and skills for a wider future.
            </p>
            <button
              type="button"
              disabled={!DOCUMENTARY_URL}
              onClick={() => DOCUMENTARY_URL && window.open(DOCUMENTARY_URL, '_blank', 'noopener')}
              className={cn(styles.btn, styles.watch)}
            >
              <span className={styles.play}>
                <Play width={18} height={18} fill="currentColor" />
              </span>
              <span>
                <strong>Watch Our Story</strong>
                <small>The AIT Documentary</small>
              </span>
            </button>
          </div>

          <div className={styles.portrait}>
            <img
              src="/people/founder-niroshan-800.png"
              srcSet="/people/founder-niroshan-800.png 800w, /people/founder-niroshan-1200.png 1200w"
              sizes="(min-width: 1024px) 26vw, 70vw"
              width={800}
              height={738}
              alt="Dr Niroshan Ranaweera, Founder &amp; Director of AIT"
              loading="lazy"
            />
          </div>

          <div id="leadership" className={cn(styles.quote, styles.section)}>
            <blockquote>
              Education is constantly evolving, and we believe that access to quality international education should create meaningful opportunities for people to develop their
              knowledge, strengthen their skills and pursue their ambitions.
            </blockquote>
            <div className={styles.person}>
              <h3>Dr Niroshan Ranaweera</h3>
              <p>
                Founder &amp; Director
                <br />
                Australian Institute of Technology – Sri Lanka
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* A Journey From AusAsia */}
      <section id="journey" className={styles.section}>
        <div className={cn(styles.wrap, styles.journey)}>
          <h2 className={styles.sectionHeading}>A Journey From AusAsia</h2>
          <p>
            AIT is a progression of the vision and experience of AusAsia Education and Migration Consultants, a trusted name in international education and student guidance. Building
            on AusAsia&rsquo;s industry knowledge, partnerships and global network, AIT was established to create a broader educational platform, expand academic collaborations and
            deliver meaningful learning opportunities for Sri Lankan learners.
          </p>
          {/* TODO: replace with the supplied AusAsia logo <img> */}
          <div className={styles.ausasia}>
            <strong>AusAsia</strong>
            <span>Education &amp; Migration Consultants</span>
          </div>
        </div>
      </section>

      {/* Vision, Mission & Values */}
      <section id="vision" className={styles.section}>
        <div className={cn(styles.wrap, styles.values)}>
          <h2 className={styles.sectionHeading}>Our Vision, Mission &amp; Values</h2>
          <div className={styles.cards}>
            <div className={styles.card}>
              <Eye className={styles.icon} />
              <h3>Our Vision</h3>
              <p>To shape a world where education transcends borders, knowledge drives progress and opportunity knows no limits.</p>
            </div>
            <div className={styles.card}>
              <Target className={styles.icon} />
              <h3>Our Mission</h3>
              <p>To connect learners with quality education, industry and global opportunities through trusted partnerships and innovative learning.</p>
            </div>
            <div className={styles.card}>
              <Gem className={styles.icon} />
              <h3>Our Values</h3>
              <ul>
                <li>Excellence</li>
                <li>Collaboration</li>
                <li>Innovation</li>
                <li>Inclusivity &amp; Opportunity</li>
                <li>Industry Relevance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section id="commitment" className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.commitment}>
            <div>
              <h2>Our Commitment</h2>
              <p>At AIT, we are committed to delivering quality education experiences, fostering industry-relevant skills and creating pathways for personal and professional growth.</p>
            </div>
            <div className={styles.pillars}>
              {PILLARS.map(({ label, icon: Icon }) => (
                <div key={label} className={styles.pillar}>
                  <Icon className={styles.icon} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Explore Our Programmes */}
      <section className={styles.section}>
        <div className={cn(styles.wrap, styles.exploreWrap)}>
          <div className={styles.explore}>
            <div>
              <h2>Explore Our Programmes</h2>
              <p>Discover internationally aligned education opportunities at AIT.</p>
            </div>
            <AppLink href="/courses" className={styles.btn}>
              View Programmes <span>&rarr;</span>
            </AppLink>
          </div>
        </div>
      </section>
    </div>
  )
}
