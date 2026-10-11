'use client';
import { useResumeStore } from '@/store/useResumeStore';
import { useRef, useEffect, useState, useCallback } from 'react';
import styles from './ResumePreview.module.css';

const A4_HEIGHT_PX = 1122; // approx 297mm in pixels
const A4_WIDTH_PX = 794;  // approx 210mm in pixels

export default function ResumePreview() {
  const { data } = useResumeStore();
  const { contact, summary, experience, projects, education, skills } = data;
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);
  const [paperHeight, setPaperHeight] = useState<number>(0);
  const [scaleMode, setScaleMode] = useState<'fit' | 'full'>('fit');
  const [scale, setScale] = useState(1);

  // Measure paper height and calculate page breaks
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      const height = el.scrollHeight;
      setPaperHeight(height);
      const pages = Math.ceil(height / A4_HEIGHT_PX);
      setPageCount(Math.max(1, pages));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [data]);

  // Handle responsive scale calculation
  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    // Allow padding
    const availableWidth = containerWidth - 24;

    if (availableWidth < A4_WIDTH_PX && scaleMode === 'fit') {
      const computedScale = Math.min(1, Math.max(0.3, availableWidth / A4_WIDTH_PX));
      setScale(computedScale);
    } else {
      setScale(1);
    }
  }, [scaleMode]);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  const handlePrint = () => window.print();

  const contactItems = [
    contact.city || contact.state || contact.country
      ? [contact.city, contact.state, contact.country].filter(Boolean).join(', ')
      : null,
    contact.email,
    contact.phone,
    contact.linkedin,
    contact.website,
  ].filter(Boolean) as string[];

  return (
    <div className={styles.previewContainer} ref={containerRef}>
      <div className={styles.toolbar}>
        <div className={styles.viewControls}>
          <button
            type="button"
            className={`${styles.viewBtn} ${scaleMode === 'fit' ? styles.active : ''}`}
            onClick={() => setScaleMode('fit')}
          >
            Fit Screen
          </button>
          <button
            type="button"
            className={`${styles.viewBtn} ${scaleMode === 'full' ? styles.active : ''}`}
            onClick={() => setScaleMode('full')}
          >
            100% Size
          </button>
        </div>
        <button type="button" className={styles.printBtn} onClick={handlePrint}>
          ↓ Download PDF / Print
        </button>
      </div>

      <div
        className={styles.paperWrapper}
        style={
          scale < 1
            ? {
                width: `${Math.round(A4_WIDTH_PX * scale)}px`,
                height: paperHeight ? `${Math.round(paperHeight * scale)}px` : 'auto',
                overflow: 'visible',
              }
            : {}
        }
      >
        <div
          className={styles.resumePaper}
          id="resume-document"
          ref={contentRef}
          style={
            scale < 1
              ? {
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                }
              : {}
          }
        >
          {/* Page Break Markers */}
          {Array.from({ length: pageCount - 1 }).map((_, i) => (
            <div
              key={`marker-${i}`}
              className={styles.pageMarker}
              style={{ top: `${(i + 1) * A4_HEIGHT_PX}px` }}
            >
              Page Break
            </div>
          ))}

          <table className={styles.printTable}>
            <thead>
              <tr>
                <td>
                  <div className={styles.printMarginTop} />
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {/* ── Header ── */}
                  <div className={styles.header}>
                    <h1 className={styles.name}>{contact.fullName || 'Your Name'}</h1>
                    {contactItems.length > 0 && (
                      <div className={styles.contactInfo}>
                        {contactItems.map((item, i) => (
                          <span key={i} className={styles.contactItem}>
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ── Summary ── */}
                  {summary && (
                    <section className={styles.section}>
                      <h2 className={styles.sectionTitle}>Summary</h2>
                      <div className={styles.sectionContent}>
                        <p>{summary}</p>
                      </div>
                    </section>
                  )}

                  {/* ── Experience ── */}
                  {experience.length > 0 && (
                    <section className={styles.section}>
                      <h2 className={styles.sectionTitle}>Experience</h2>
                      <div className={styles.sectionContent}>
                        {experience.map((exp) => (
                          <div key={exp.id} className={styles.entry}>
                            <div className={styles.entryTopRow}>
                              <h3 className={styles.entryTitle}>{exp.role}</h3>
                              <span className={styles.entryDates}>
                                {[exp.startDate, exp.endDate].filter(Boolean).join(' – ')}
                              </span>
                            </div>
                            <div className={styles.entryBottomRow}>
                              <span className={styles.entryCompany}>{exp.company}</span>
                              {exp.location && (
                                <span className={styles.entryLocation}>{exp.location}</span>
                              )}
                            </div>
                            {exp.description && exp.description.length > 0 && (
                              <ul className={styles.bulletList}>
                                {exp.description.map((desc, i) => (
                                  <li key={i}>{desc}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* ── Projects ── */}
                  {projects.length > 0 && (
                    <section className={styles.section}>
                      <h2 className={styles.sectionTitle}>Project</h2>
                      <div className={styles.sectionContent}>
                        {projects.map((proj) => (
                          <div key={proj.id} className={styles.entry}>
                            <div className={styles.entryTopRow}>
                              <h3 className={styles.entryTitle}>{proj.title}</h3>
                            </div>
                            {proj.subtitle && (
                              <div className={styles.entryBottomRow}>
                                <span className={styles.entryCompany}>{proj.subtitle}</span>
                              </div>
                            )}
                            {proj.description && proj.description.length > 0 && (
                              <ul className={styles.bulletList}>
                                {proj.description.map((desc, i) => (
                                  <li key={i}>{desc}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* ── Education ── */}
                  {education.length > 0 && (
                    <section className={styles.section}>
                      <h2 className={styles.sectionTitle}>Education</h2>
                      <div className={styles.sectionContent}>
                        {education.map((edu) => (
                          <div key={edu.id} className={styles.entry}>
                            <div className={styles.entryTopRow}>
                              <h3 className={styles.entryTitle}>{edu.degree}</h3>
                              {edu.date && <span className={styles.eduDate}>{edu.date}</span>}
                            </div>
                            <div className={styles.eduRow}>
                              <span className={styles.eduSchool}>
                                {edu.school}
                                {edu.minor ? ` • Minor in ${edu.minor}` : ''}
                              </span>
                              {edu.location && (
                                <span className={styles.eduDate}>{edu.location}</span>
                              )}
                            </div>
                            {edu.gpa && (
                              <div style={{ fontSize: '10pt', marginTop: '2pt' }}>
                                GPA: {edu.gpa}
                              </div>
                            )}
                            {edu.additionalInfo && (
                              <p style={{ fontSize: '10pt', margin: '2pt 0 0 0' }}>
                                {edu.additionalInfo}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* ── Skills ── */}
                  {skills && (
                    <section className={styles.section}>
                      <h2 className={styles.sectionTitle}>Skills</h2>
                      <div className={styles.sectionContent}>
                        <p>{skills}</p>
                      </div>
                    </section>
                  )}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <div className={styles.printMarginBottom} />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
