'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useResumeStore } from '@/store/useResumeStore';

interface TemplateItem {
  id: string;
  name: string;
  badge: string;
  isAvailable: boolean;
  description: string;
  tags: string[];
  features: string[];
}

const TEMPLATES: TemplateItem[] = [
  {
    id: 'classic-ats',
    name: 'Classic ATS (Ivy League)',
    badge: 'Available & Ready',
    isAvailable: true,
    description: 'Clean single-column layout in Georgia serif with optimized margins, bold dates, and vertical contact dividers. 100% recruiter and parser approved.',
    tags: ['ATS-Proof', '1-Page Fit', 'Georgia Serif', 'Zero Watermark'],
    features: ['Semantic table hierarchy', 'Smart overflow prevention', 'Vector PDF download'],
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { data, setSelectedTemplate } = useResumeStore();

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    router.push('/builder');
  };

  return (
    <div className={styles.landingContainer}>
      {/* Background ambient lighting */}
      <div className={styles.ambientGlowTop} />
      <div className={styles.ambientGlowMid} />

      {/* Navigation Header */}
      <header className={styles.navbar}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>⚡</div>
          <span>Rizzume</span>
        </Link>

        <nav className={styles.navLinks}>
          <a href="#templates" className={styles.navLink}>Templates</a>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#why-ats" className={styles.navLink}>Why ATS?</a>
        </nav>

        <Link href="/builder" className={styles.navCtaBtn}>
          Open Builder →
        </Link>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.pillBadge}>
          <span>✨</span>
          <span>Next-Gen ATS Resume Builder • Free & Fast</span>
        </div>

        <h1 className={styles.heroTitle}>
          Build an ATS-Friendly Resume <br />
          <span className={styles.gradientText}>That Lands Top Interviews</span>
        </h1>

        <p className={styles.heroSubtitle}>
          Create recruiter-approved, single-page resumes with automated layout locking, 
          zero watermarks, and instant vector PDF export. Pick a template and start building in seconds.
        </p>

        <div className={styles.heroActions}>
          <a href="#templates" className={styles.primaryCta}>
            Choose a Template ↓
          </a>
          <Link href="/builder" className={styles.secondaryCta}>
            Open Resume Builder →
          </Link>
        </div>

        {/* Hero Interactive Document Showcase */}
        <div className={styles.showcaseContainer}>
          <div className={styles.chip2}>
            <span>⚡</span> Zero Watermarks
          </div>
          <div className={styles.chip3}>
            <span>📐</span> Guaranteed Single Page
          </div>

          <div 
            className={styles.mockupPaper}
            onClick={() => handleSelectTemplate('classic-ats')}
            title="Click to edit with this template"
          >
            <div className={styles.mockupName}>ALEXANDER WRIGHT</div>
            <div className={styles.mockupContact}>
              <span>San Francisco, CA</span>
              <span className={styles.mockupDivider} />
              <span>alex.wright@example.com</span>
              <span className={styles.mockupDivider} />
              <span>(555) 234-5678</span>
              <span className={styles.mockupDivider} />
              <span>linkedin.com/in/alexwright</span>
              <span className={styles.mockupDivider} />
              <span>github.com/alexwright</span>
            </div>

            <div className={styles.mockupSectionTitle}>SUMMARY</div>
            <p style={{ fontSize: '0.72rem', color: '#222', lineHeight: '1.4', marginBottom: '0.5rem' }}>
              Results-driven Senior Software Engineer with 6+ years of expertise architecting high-throughput distributed systems, 
              cloud infrastructure, and scalable React web applications. Proven track record reducing latency by 42%.
            </p>

            <div className={styles.mockupSectionTitle}>EXPERIENCE</div>
            <div className={styles.mockupRow}>
              <span className={styles.mockupBold}>Senior Full-Stack Engineer</span>
              <span className={styles.mockupItalic}>March 2022 – Present</span>
            </div>
            <div className={styles.mockupRow} style={{ color: '#333', marginBottom: '3px' }}>
              <span>Stripe Technologies</span>
              <span className={styles.mockupItalic}>San Francisco, CA</span>
            </div>
            <ul className={styles.mockupBullets}>
              <li>Architected and deployed microservices handling 25M+ daily requests with 99.99% uptime.</li>
              <li>Spearheaded performance overhaul reducing P99 API response times from 340ms to 78ms.</li>
            </ul>

            <div className={styles.mockupSectionTitle}>PROJECTS</div>
            <div className={styles.mockupRow}>
              <span className={styles.mockupBold}>Distributed Stream Cache</span>
              <span className={styles.mockupItalic}>August 2023 – October 2023</span>
            </div>
            <ul className={styles.mockupBullets}>
              <li>Built high-speed in-memory key-value cache engine in Go with Raft consensus.</li>
            </ul>

            <div className={styles.mockupSectionTitle}>EDUCATION</div>
            <div className={styles.mockupRow}>
              <span className={styles.mockupBold}>B.S. in Computer Science</span>
              <span className={styles.mockupItalic}>2016 – 2020</span>
            </div>
            <div className={styles.mockupRow} style={{ color: '#333' }}>
              <span>University of California, Berkeley</span>
              <span className={styles.mockupItalic}>GPA: 3.85 / 4.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className={styles.templatesSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Resume Templates</span>
          <h2 className={styles.sectionTitle}>Choose Your Resume Template</h2>
          <p className={styles.sectionSubtitle}>
            Every template is engineered to pass Applicant Tracking Systems (ATS) while presenting your career with executive polish.
          </p>
        </div>

        <div className={styles.templatesGrid}>
          {TEMPLATES.map((tmpl) => (
            <div 
              key={tmpl.id} 
              className={`${styles.templateCard} ${tmpl.id === (data.selectedTemplate || 'classic-ats') ? styles.cardActiveBorder : ''}`}
            >
              {/* Miniature visual thumbnail */}
              <div className={styles.previewThumb}>
                <div className={styles.previewOverlay} />
                <div className={styles.thumbHeader}>
                  <div className={styles.thumbName}>CANDIDATE NAME</div>
                  <div className={styles.thumbSub}>
                    <span>Email</span>
                    <span>|</span>
                    <span>Phone</span>
                    <span>|</span>
                    <span>LinkedIn</span>
                  </div>
                </div>

                <div className={styles.thumbHeading}>SUMMARY</div>
                <div className={styles.thumbLine} style={{ width: '92%' }} />
                <div className={styles.thumbLine} style={{ width: '85%' }} />

                <div className={styles.thumbHeading}>EXPERIENCE</div>
                <div className={styles.thumbLine} style={{ width: '70%', height: '5px', background: '#cbd5e1' }} />
                <div className={styles.thumbLine} style={{ width: '96%' }} />
                <div className={styles.thumbLine} style={{ width: '88%' }} />

                <div className={styles.thumbHeading}>EDUCATION</div>
                <div className={styles.thumbLine} style={{ width: '65%' }} />
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardHeaderRow}>
                  <h3 className={styles.cardTitle}>{tmpl.name}</h3>
                  {tmpl.isAvailable ? (
                    <span className={styles.statusActive}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
                      {tmpl.badge}
                    </span>
                  ) : (
                    <span className={styles.statusComingSoon}>{tmpl.badge}</span>
                  )}
                </div>

                <p className={styles.cardDesc}>{tmpl.description}</p>

                <div className={styles.cardTags}>
                  {tmpl.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>

                {tmpl.isAvailable ? (
                  <button 
                    type="button"
                    className={styles.selectTemplateBtn}
                    onClick={() => handleSelectTemplate(tmpl.id)}
                  >
                    Select Template & Edit →
                  </button>
                ) : (
                  <button type="button" disabled className={styles.disabledBtn}>
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Key Capabilities</span>
          <h2 className={styles.sectionTitle}>Why Professionals Choose Rizzume</h2>
          <p className={styles.sectionSubtitle}>
            Built specifically to solve the most painful resume problems: ATS parsing failures, bad page breaks, and sneaky paid watermarks.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎯</div>
            <h3 className={styles.featureTitle}>100% ATS Compliant</h3>
            <p className={styles.featureDesc}>
              Structured with semantic headings, plain-text parseability, and standard sections so Workday, Taleo, and Greenhouse parse your resume flawlessly.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📐</div>
            <h3 className={styles.featureTitle}>Guaranteed 1-Page Layout</h3>
            <p className={styles.featureDesc}>
              Dynamic typography scaling and real-time print page margin calculation prevent orphan lines and unwanted second pages.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3 className={styles.featureTitle}>Zero-Watermark PDF Export</h3>
            <p className={styles.featureDesc}>
              Download clean, vector-sharp PDFs with browser watermarks, URLs, and dates automatically stripped out. No sign-up or paywalls.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3 className={styles.featureTitle}>100% Private & In-Browser</h3>
            <p className={styles.featureDesc}>
              Your sensitive career history stays in your browser. All data is persisted locally in your device storage with zero server telemetry.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className={styles.bottomCtaSection}>
        <h2 className={styles.ctaTitle}>Ready to Create Your Standout Resume?</h2>
        <p className={styles.ctaSubtitle}>
          Join thousands of applicants crafting ATS-compliant, single-page resumes that capture recruiters' attention.
        </p>
        <button 
          type="button"
          onClick={() => handleSelectTemplate('classic-ats')}
          className={styles.primaryCta}
        >
          Start Building with Classic ATS →
        </button>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', color: '#fff' }}>
            <span>⚡ Rizzume</span>
            <span style={{ color: '#64748b', fontWeight: 'normal' }}>— The Open, Free ATS Resume Builder</span>
          </div>

          <div>
            Built with Next.js, React, and pure CSS. Zero watermarks guaranteed.
          </div>
        </div>
      </footer>
    </div>
  );
}
