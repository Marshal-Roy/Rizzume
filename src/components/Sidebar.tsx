'use client';
import { useResumeStore } from '@/store/useResumeStore';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeTab: string;
}

export default function Sidebar({ activeTab }: SidebarProps) {
  const { data } = useResumeStore();

  const renderList = () => {
    switch (activeTab) {
      case 'EXPERIENCE':
        return (
          <>
            <div className={styles.sectionHeader}>
              <h3>▼ Experience</h3>
              <button className={styles.addBtn}>+</button>
            </div>
            <div className={styles.itemList}>
              {data.experience.map(exp => (
                <div key={exp.id} className={styles.item}>
                  <div className={styles.itemContent}>
                    <h4>{exp.role || 'New Experience'}</h4>
                    <p>{exp.company} {exp.startDate ? `, ${exp.startDate}` : ''}</p>
                  </div>
                  <div className={styles.itemMenu}>•••</div>
                </div>
              ))}
            </div>
            <div className={styles.toolsList}>
              <div className={styles.toolItem}><span className={styles.toolIcon}>×</span> Short Bullet Points</div>
              <div className={styles.toolItem}><span className={styles.toolIcon}>×</span> Punctuated Bullet Points</div>
              <div className={styles.toolItem}><span className={styles.toolIcon} style={{backgroundColor: '#10b981'}}>✓</span> Personal Pronoun <span className={styles.proBadge}>PRO</span></div>
              <div className={styles.toolItem}><span className={styles.toolIcon} style={{backgroundColor: '#10b981'}}>✓</span> Buzzwords <span className={styles.proBadge}>PRO</span></div>
            </div>
          </>
        );
      case 'EDUCATION':
        return (
          <>
            <div className={styles.sectionHeader}>
              <h3>▼ Education</h3>
              <button className={styles.addBtn}>+</button>
            </div>
            <div className={styles.itemList}>
              {data.education.map(edu => (
                <div key={edu.id} className={styles.item}>
                  <div className={styles.itemContent}>
                    <h4>{edu.degree || 'New Education'}</h4>
                    <p>{edu.school} {edu.date ? `, ${edu.date}` : ''}</p>
                  </div>
                  <div className={styles.itemMenu}>•••</div>
                </div>
              ))}
            </div>
          </>
        );
      case 'PROJECT':
        return (
          <>
            <div className={styles.sectionHeader}>
              <h3>▼ Projects</h3>
              <button className={styles.addBtn}>+</button>
            </div>
            <div className={styles.itemList}>
              {data.projects.map(proj => (
                <div key={proj.id} className={styles.item}>
                  <div className={styles.itemContent}>
                    <h4>{proj.title || 'New Project'}</h4>
                    <p>{proj.subtitle}</p>
                  </div>
                  <div className={styles.itemMenu}>•••</div>
                </div>
              ))}
            </div>
          </>
        );
      case 'SKILLS':
        return (
          <>
            <div className={styles.sectionHeader}>
              <h3>▼ Skills</h3>
              <button className={styles.addBtn}>+</button>
            </div>
            <div className={styles.itemList}>
              {data.skills && (
                <div className={styles.item}>
                  <div className={styles.itemContent}>
                    <h4>Skills 1</h4>
                    <p>{data.skills}</p>
                  </div>
                  <div className={styles.itemMenu}>•••</div>
                </div>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.videoPlaceholder}>
        <span className={styles.playIcon}>▶</span>
      </div>
      <div className={styles.scoreCard}>
        <div className={styles.scoreCircle}>73</div>
        <div className={styles.scoreText}>
          <strong>Your Rezi Score</strong>
          <span>Needs improvement</span>
        </div>
      </div>
      
      {renderList()}
    </aside>
  );
}
