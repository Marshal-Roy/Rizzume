'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import ContactForm from '@/components/forms/ContactForm';
import ExperienceForm from '@/components/forms/ExperienceForm';
import ProjectForm from '@/components/forms/ProjectForm';
import EducationForm from '@/components/forms/EducationForm';
import SkillsForm from '@/components/forms/SkillsForm';
import SummaryForm from '@/components/forms/SummaryForm';
import CertificatesForm from '@/components/forms/CertificatesForm';
import ResumePreview from '@/components/ResumePreview';
import { useResumeStore } from '@/store/useResumeStore';

type Tab = 'SUMMARY' | 'CONTACT' | 'EXPERIENCE' | 'PROJECT' | 'EDUCATION' | 'SKILLS' | 'CERTIFICATES' | 'PREVIEW';

const TABS: Tab[] = ['SUMMARY', 'CONTACT', 'EXPERIENCE', 'PROJECT', 'EDUCATION', 'SKILLS', 'CERTIFICATES'];

export default function BuilderPage() {
  const [activeTab, setActiveTab] = useState<Tab>('SUMMARY');
  const [mounted, setMounted] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const { data } = useResumeStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Ensure active tab is smoothly scrolled into view on smaller screens
  useEffect(() => {
    if (!navRef.current) return;
    const activeBtn = navRef.current.querySelector(`.${styles.active}`) as HTMLElement | null;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [activeTab]);

  const renderForm = () => {
    switch (activeTab) {
      case 'SUMMARY': return <SummaryForm />;
      case 'CONTACT': return <ContactForm />;
      case 'EXPERIENCE': return <ExperienceForm />;
      case 'PROJECT': return <ProjectForm />;
      case 'EDUCATION': return <EducationForm />;
      case 'SKILLS': return <SkillsForm />;
      case 'CERTIFICATES': return <CertificatesForm />;
      case 'PREVIEW': return <ResumePreview />;
      default: return null;
    }
  };

  const templateName = data.selectedTemplate === 'classic-ats' || !data.selectedTemplate 
    ? 'Classic ATS' 
    : data.selectedTemplate;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brandArea}>
          <Link href="/" className={styles.backBtn} title="Back to Templates">
            ← Templates
          </Link>
          <span className={styles.templateBadge}>
            <span className={styles.templateDot} />
            {templateName}
          </span>
        </div>

        <div className={styles.navContainer}>
          <div className={styles.nav} ref={navRef}>
            {TABS.map((tab) => (
              <button 
                key={tab}
                type="button"
                className={`${styles.navItem} ${activeTab === tab ? styles.active : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            type="button"
            className={`${styles.previewBtn} ${activeTab === 'PREVIEW' ? styles.active : ''}`}
            onClick={() => setActiveTab(activeTab === 'PREVIEW' ? 'SUMMARY' : 'PREVIEW')}
          >
            {activeTab === 'PREVIEW' ? '✏️ EDIT RESUME' : 'FINISH UP & PREVIEW'}
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.content} style={activeTab === 'PREVIEW' ? { padding: 0 } : {}}>
          {!mounted ? null : activeTab !== 'PREVIEW' ? (
            <div className={styles.formPanel}>
              {renderForm()}
            </div>
          ) : (
            renderForm()
          )}
        </section>
      </main>
    </div>
  );
}
