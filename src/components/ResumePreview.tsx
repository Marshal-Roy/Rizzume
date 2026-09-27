'use client';
import { useResumeStore } from '@/store/useResumeStore';
import styles from './ResumePreview.module.css';

export default function ResumePreview() {
  const { data } = useResumeStore();
  const { contact, summary, experience, projects, education, skills } = data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.previewContainer}>
      <div className={styles.toolbar}>
        <button className={styles.printBtn} onClick={handlePrint}>Download PDF / Print</button>
      </div>
      
      <div className={styles.resumePaper} id="resume-document">
        <header className={styles.header}>
          <h1 className={styles.name}>{contact.fullName || 'Your Name'}</h1>
          <div className={styles.contactInfo}>
            {(contact.city || contact.state || contact.country) && (
              <span>📍 {[contact.city, contact.state, contact.country].filter(Boolean).join(', ')}</span>
            )}
            {contact.email && <span>✉ {contact.email}</span>}
            {contact.phone && <span>📞 {contact.phone}</span>}
            {contact.linkedin && <span>🔗 {contact.linkedin}</span>}
            {contact.website && <span>🌐 {contact.website}</span>}
          </div>
        </header>

        {summary && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>SUMMARY</h2>
            <div className={styles.sectionContent}>
              <p>{summary}</p>
            </div>
          </section>
        )}

        {experience.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>EXPERIENCE</h2>
            <div className={styles.sectionContent}>
              {experience.map(exp => (
                <div key={exp.id} className={styles.entry}>
                  <div className={styles.entryHeader}>
                    <div className={styles.entryTitleGroup}>
                      <h3 className={styles.entryTitle}>{exp.role}</h3>
                      <div className={styles.entrySubtitle}>{exp.company}</div>
                    </div>
                    <div className={styles.entryMeta}>
                      <div className={styles.entryDate}>{exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : exp.startDate || exp.endDate}</div>
                      <div className={styles.entryLocation}>{exp.location}</div>
                    </div>
                  </div>
                  {exp.description && exp.description.length > 0 && (
                    <ul className={styles.bulletList}>
                      {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>PROJECT</h2>
            <div className={styles.sectionContent}>
              {projects.map(proj => (
                <div key={proj.id} className={styles.entry}>
                  <div className={styles.entryHeader}>
                    <div className={styles.entryTitleGroup}>
                      <h3 className={styles.entryTitle}>{proj.title}</h3>
                      <div className={styles.entrySubtitle}>{proj.subtitle}</div>
                    </div>
                  </div>
                  {proj.description && proj.description.length > 0 && (
                    <ul className={styles.bulletList}>
                      {proj.description.map((desc, i) => <li key={i}>{desc}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>EDUCATION</h2>
            <div className={styles.sectionContent}>
              {education.map(edu => (
                <div key={edu.id} className={styles.entry}>
                  <div className={styles.entryHeader}>
                    <div className={styles.entryTitleGroup}>
                      <h3 className={styles.entryTitle}>{edu.degree}</h3>
                      <div className={styles.entrySubtitle}>{edu.school} {edu.minor && `• Minor in ${edu.minor}`}</div>
                    </div>
                    <div className={styles.entryMeta}>
                      <div className={styles.entryDate}>{edu.date}</div>
                      <div className={styles.entryLocation}>{edu.location}</div>
                    </div>
                  </div>
                  {edu.gpa && <div style={{fontSize: '0.875rem', marginTop: '0.25rem'}}>GPA: {edu.gpa}</div>}
                  {edu.additionalInfo && <p style={{fontSize: '0.875rem', marginTop: '0.25rem'}}>{edu.additionalInfo}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {skills && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>SKILLS</h2>
            <div className={styles.sectionContent}>
              <p>{skills}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
