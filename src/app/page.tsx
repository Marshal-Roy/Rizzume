'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import ContactForm from '@/components/forms/ContactForm';
import ExperienceForm from '@/components/forms/ExperienceForm';
import ProjectForm from '@/components/forms/ProjectForm';
import EducationForm from '@/components/forms/EducationForm';
import SkillsForm from '@/components/forms/SkillsForm';
import SummaryForm from '@/components/forms/SummaryForm';
import Sidebar from '@/components/Sidebar';

type Tab = 'CONTACT' | 'EXPERIENCE' | 'PROJECT' | 'EDUCATION' | 'SKILLS' | 'SUMMARY' | 'PREVIEW';

const TABS: Tab[] = ['CONTACT', 'EXPERIENCE', 'PROJECT', 'EDUCATION', 'SKILLS', 'SUMMARY'];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('SUMMARY');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderForm = () => {
    switch (activeTab) {
      case 'CONTACT': return <ContactForm />;
      case 'EXPERIENCE': return <ExperienceForm />;
      case 'PROJECT': return <ProjectForm />;
      case 'EDUCATION': return <EducationForm />;
      case 'SKILLS': return <SkillsForm />;
      case 'SUMMARY': return <SummaryForm />;
      case 'PREVIEW': return <div style={{color: 'white', padding: '2rem'}}>Preview not implemented yet (Phase 5)</div>;
      default: return null;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.nav}>
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
        <Sidebar activeTab={activeTab} />

        <section className={styles.content}>
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
