'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import ContactForm from '@/components/forms/ContactForm';
import ExperienceForm from '@/components/forms/ExperienceForm';
import ProjectForm from '@/components/forms/ProjectForm';
import EducationForm from '@/components/forms/EducationForm';
import SkillsForm from '@/components/forms/SkillsForm';
import SummaryForm from '@/components/forms/SummaryForm';
import Sidebar from '@/components/Sidebar';
import ResumePreview from '@/components/ResumePreview';

type Tab = 'CONTACT' | 'EXPERIENCE' | 'PROJECT' | 'EDUCATION' | 'SKILLS' | 'SUMMARY' | 'PREVIEW';

const TABS: Tab[] = ['CONTACT', 'EXPERIENCE', 'PROJECT', 'EDUCATION', 'SKILLS', 'SUMMARY'];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('SUMMARY');
  const [mounted, setMounted] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

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
      case 'CONTACT': return <ContactForm />;
      case 'EXPERIENCE': return <ExperienceForm />;
      case 'PROJECT': return <ProjectForm />;
      case 'EDUCATION': return <EducationForm />;
      case 'SKILLS': return <SkillsForm />;
      case 'SUMMARY': return <SummaryForm />;
      case 'PREVIEW': return <ResumePreview />;
      default: return null;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.navContainer}>
          <div className={styles.nav} ref={navRef}>
            {TABS.map(tab => (
              <button 
                key={tab}
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
            className={`${styles.previewBtn} ${activeTab === 'PREVIEW' ? styles.active : ''}`}
            onClick={() => setActiveTab('PREVIEW')}
          >
            FINISH UP & PREVIEW
          </button>
          <button className={styles.aiBtn}>AI COVER LETTER</button>
        </div>
      </header>

      <main className={styles.main}>
        {activeTab !== 'PREVIEW' && <Sidebar activeTab={activeTab} />}

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
