'use client';
import { useResumeStore } from '@/store/useResumeStore';
import { useRef, useEffect, useState } from 'react';
import styles from './ResumePreview.module.css';

const A4_HEIGHT_PX = 1122; // approx 297mm in pixels

const formatUrl = (url?: string) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const cleanDisplayUrl = (url?: string) => {
  if (!url) return '';
  return url.trim().replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const formatSingleDate = (raw?: string): string => {
  if (!raw) return '';
  const str = raw.trim();
  if (!str) return '';

  if (/^(present|current|now)$/i.test(str)) {
    return 'Present';
  }

  // Already "Month YYYY" like "March 2025" or "August 2024" or "Mar 2025"
  const monthYearRegex = /^(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)[,\s]+(\d{4})$/i;
  const myMatch = str.match(monthYearRegex);
  if (myMatch) {
    const monthPrefix = myMatch[1].toLowerCase().slice(0, 3);
    const year = myMatch[2];
    const monthIndex = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(monthPrefix);
    if (monthIndex >= 0) {
      return `${MONTH_NAMES[monthIndex]} ${year}`;
    }
  }

  // Just year, e.g. "2023"
  if (/^\d{4}$/.test(str)) {
    return str;
  }

  // Check DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const dmyMatch = str.match(/^(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{4})$/);
  if (dmyMatch) {
    const first = parseInt(dmyMatch[1], 10);
    const second = parseInt(dmyMatch[2], 10);
    const year = dmyMatch[3];

    // Standard date in user's region is DD/MM/YYYY (e.g. 01/03/2023 -> 1st March 2023)
    let monthNum = second;
    if (second > 12 && first <= 12) {
      // MM/DD/YYYY fallback
      monthNum = first;
    }
    if (monthNum >= 1 && monthNum <= 12) {
      return `${MONTH_NAMES[monthNum - 1]} ${year}`;
    }
  }

  // Check YYYY-MM-DD or YYYY-MM
  const ymdMatch = str.match(/^(\d{4})[\/\.-](\d{1,2})(?:[\/\.-](\d{1,2}))?$/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const monthNum = parseInt(ymdMatch[2], 10);
    if (monthNum >= 1 && monthNum <= 12) {
      return `${MONTH_NAMES[monthNum - 1]} ${year}`;
    }
  }

  // Check MM/YYYY
  const myNumMatch = str.match(/^(\d{1,2})[\/\.-](\d{4})$/);
  if (myNumMatch) {
    const monthNum = parseInt(myNumMatch[1], 10);
    const year = myNumMatch[2];
    if (monthNum >= 1 && monthNum <= 12) {
      return `${MONTH_NAMES[monthNum - 1]} ${year}`;
    }
  }

  return str;
};

const formatRawDateRange = (raw?: string): string => {
  if (!raw) return '';
  const str = raw.trim();
  if (!str) return '';

  const parts = str.split(/\s*(?:[-–—]|\bto\b)\s*/);
  if (parts.length === 2) {
    return `${formatSingleDate(parts[0])} – ${formatSingleDate(parts[1])}`;
  }
  return formatSingleDate(str);
};

const parseProjectInfo = (proj: { title: string; subtitle?: string; startDate?: string; endDate?: string }) => {
  if (proj.startDate || proj.endDate) {
    const dates = [formatSingleDate(proj.startDate), formatSingleDate(proj.endDate)].filter(Boolean).join(' – ');
    return {
      companyOrSubtitle: proj.subtitle || '',
      dateStr: dates,
    };
  }

  if (proj.subtitle) {
    // If subtitle contains bullet or pipe like "Coddle Technologies • March 2025 - May 2025"
    const bulletParts = proj.subtitle.split(/\s+[•|]\s+/);
    if (bulletParts.length >= 2) {
      const possibleDate = bulletParts[bulletParts.length - 1].trim();
      if (/\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4})\b/i.test(possibleDate)) {
        const company = bulletParts.slice(0, -1).join(' • ').trim();
        return {
          companyOrSubtitle: company,
          dateStr: formatRawDateRange(possibleDate),
        };
      }
    }

    // Check if subtitle itself is a date range
    if (/^\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}[\/\.-]\d{1,2}[\/\.-]|\d{4})[^\n]*)\s*(?:[-–—]|\bto\b)\s*[^\n]+$/i.test(proj.subtitle)) {
      return {
        companyOrSubtitle: '',
        dateStr: formatRawDateRange(proj.subtitle),
      };
    }
  }

  return {
    companyOrSubtitle: proj.subtitle || '',
    dateStr: '',
  };
};

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export default function ResumePreview() {
  const { data } = useResumeStore();
  const { contact, summary, experience, projects, education, skills, certificates = [] } = data;
  const contentRef = useRef<HTMLDivElement>(null);
  const [pageBreaks, setPageBreaks] = useState<number[]>([]);

  // Measure content layout and calculate exact print page breaks
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measurePages = () => {
      const paper = contentRef.current;
      if (!paper) return;

      const paperRect = paper.getBoundingClientRect();
      if (paperRect.width <= 0) return;

      // 1 mm in pixels according to the rendered width of 210mm A4 paper
      const pxPerMm = paperRect.width / 210;

      // In print mode:
      // Total page height = 297mm
      // repeating thead (top margin repeated each page) = 12mm
      // repeating tfoot (bottom margin repeated each page) = 12mm
      // Usable content height per page = 273mm (297 - 12 - 12)
      const topPaddingPx = 12 * pxPerMm;
      const usablePageHeightPx = 273 * pxPerMm;

      interface ContentUnit {
        top: number;
        bottom: number;
        prevBottom: number;
      }
      const units: ContentUnit[] = [];
      let lastBottom = topPaddingPx;

      // 1. Header
      const header = paper.querySelector(`.${styles.header}`) as HTMLElement | null;
      if (header) {
        const r = header.getBoundingClientRect();
        const top = r.top - paperRect.top;
        const bottom = r.bottom - paperRect.top;
        units.push({ top, bottom, prevBottom: lastBottom });
        lastBottom = bottom;
      }

      // 2. Sections
      const sections = Array.from(paper.querySelectorAll(`.${styles.section}`)) as HTMLElement[];
      for (const sec of sections) {
        const entries = Array.from(sec.querySelectorAll(`.${styles.entry}`)) as HTMLElement[];
        const title = sec.querySelector(`.${styles.sectionTitle}`) as HTMLElement | null;

        if (entries.length > 0 && title) {
          // If section has entries: title + first entry stay together (break-after: avoid)
          const titleRect = title.getBoundingClientRect();
          const firstEntryRect = entries[0].getBoundingClientRect();
          const unitTop = titleRect.top - paperRect.top;
          const unitBottom = firstEntryRect.bottom - paperRect.top;

          units.push({
            top: unitTop,
            bottom: unitBottom,
            prevBottom: lastBottom,
          });
          lastBottom = unitBottom;

          // Subsequent entries in this section
          for (let i = 1; i < entries.length; i++) {
            const entryRect = entries[i].getBoundingClientRect();
            const top = entryRect.top - paperRect.top;
            const bottom = entryRect.bottom - paperRect.top;
            units.push({
              top,
              bottom,
              prevBottom: lastBottom,
            });
            lastBottom = bottom;
          }
        } else {
          // Single unit section (e.g. Summary, Skills)
          const secRect = sec.getBoundingClientRect();
          const top = secRect.top - paperRect.top;
          const bottom = secRect.bottom - paperRect.top;
          units.push({
            top,
            bottom,
            prevBottom: lastBottom,
          });
          lastBottom = bottom;
        }
      }

      // Simulate Chromium print page pagination
      const breaks: number[] = [];
      let currentPageStart = topPaddingPx;

      for (let i = 0; i < units.length; i++) {
        const unit = units[i];
        if (unit.bottom - currentPageStart > usablePageHeightPx) {
          // Element overflows current page: break occurs before this element
          const breakPoint = (unit.prevBottom + unit.top) / 2;
          breaks.push(Math.round(breakPoint));
          currentPageStart = unit.top;
        }
      }

      setPageBreaks(breaks);
    };

    const frameId = requestAnimationFrame(measurePages);
    const observer = new ResizeObserver(measurePages);
    observer.observe(el);
    const table = el.querySelector('table');
    if (table) observer.observe(table);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [data]);

  const handlePrint = () => window.print();

  const locationText = [contact.city, contact.state, contact.country]
    .filter(Boolean)
    .join(', ');

  interface ContactField {
    id: string;
    icon: React.ReactNode;
    label: string;
    href?: string;
    isExternal?: boolean;
  }

  const contactFields: ContactField[] = [];

  if (locationText) {
    contactFields.push({
      id: 'location',
      icon: <LocationIcon />,
      label: locationText,
    });
  }

  if (contact.email?.trim()) {
    contactFields.push({
      id: 'email',
      icon: <MailIcon />,
      label: contact.email.trim(),
      href: `mailto:${contact.email.trim()}`,
    });
  }

  if (contact.phone?.trim()) {
    contactFields.push({
      id: 'phone',
      icon: <PhoneIcon />,
      label: contact.phone.trim(),
      href: `tel:${contact.phone.trim().replace(/\s+/g, '')}`,
    });
  }

  if (contact.linkedin?.trim()) {
    contactFields.push({
      id: 'linkedin',
      icon: <LinkedInIcon />,
      label: cleanDisplayUrl(contact.linkedin),
      href: formatUrl(contact.linkedin),
      isExternal: true,
    });
  }

  if (contact.github?.trim()) {
    contactFields.push({
      id: 'github',
      icon: <GitHubIcon />,
      label: cleanDisplayUrl(contact.github),
      href: formatUrl(contact.github),
      isExternal: true,
    });
  }

  if (contact.website?.trim()) {
    contactFields.push({
      id: 'website',
      icon: <GlobeIcon />,
      label: cleanDisplayUrl(contact.website),
      href: formatUrl(contact.website),
      isExternal: true,
    });
  }

  return (
    <div className={styles.previewContainer}>
      <div className={styles.toolbar}>
        <button type="button" className={styles.printBtn} onClick={handlePrint}>
          ↓ Download PDF / Print
        </button>
      </div>

      <div className={styles.paperWrapper}>
        <div className={styles.resumePaper} id="resume-document" ref={contentRef}>
          {/* Page Break Markers placed outside the paper */}
          {pageBreaks.map((breakTop, i) => (
            <div
              key={`marker-${i}`}
              className={styles.pageMarker}
              style={{ top: `${breakTop}px` }}
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
                    {contactFields.length > 0 && (
                      <div className={styles.contactInfo}>
                        {contactFields.map((field) => (
                          <span key={field.id} className={styles.contactItem}>
                            {field.href ? (
                              <a
                                href={field.href}
                                target={field.isExternal ? '_blank' : undefined}
                                rel={field.isExternal ? 'noopener noreferrer' : undefined}
                                className={styles.contactLink}
                              >
                                <span className={styles.contactIcon}>{field.icon}</span>
                                <span>{field.label}</span>
                              </a>
                            ) : (
                              <span className={styles.contactText}>
                                <span className={styles.contactIcon}>{field.icon}</span>
                                <span>{field.label}</span>
                              </span>
                            )}
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
                        {experience.map((exp) => {
                          const formattedDates = [formatSingleDate(exp.startDate), formatSingleDate(exp.endDate)]
                            .filter(Boolean)
                            .join(' – ');
                          return (
                            <div key={exp.id} className={styles.entry}>
                              <div className={styles.entryTopRow}>
                                <h3 className={styles.entryTitle}>{exp.role}</h3>
                                {formattedDates && (
                                  <span className={styles.entryDates}>{formattedDates}</span>
                                )}
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
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* ── Projects ── */}
                  {projects.length > 0 && (
                    <section className={styles.section}>
                      <h2 className={styles.sectionTitle}>Project</h2>
                      <div className={styles.sectionContent}>
                        {projects.map((proj) => {
                          const { companyOrSubtitle, dateStr } = parseProjectInfo(proj);
                          return (
                            <div key={proj.id} className={styles.entry}>
                              <div className={styles.entryTopRow}>
                                <h3 className={styles.entryTitle}>{proj.title}</h3>
                                {dateStr && <span className={styles.entryDates}>{dateStr}</span>}
                              </div>
                              {(companyOrSubtitle || proj.link) && (
                                <div className={styles.entryBottomRow}>
                                  <div className={styles.projectSubInfo}>
                                    {companyOrSubtitle && <span className={styles.entryCompany}>{companyOrSubtitle}</span>}
                                    {companyOrSubtitle && proj.link && <span className={styles.projectDot}>•</span>}
                                    {proj.link && (
                                      <a
                                        href={formatUrl(proj.link)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.projectLink}
                                      >
                                        <ExternalLinkIcon />
                                        <span>{cleanDisplayUrl(proj.link)}</span>
                                      </a>
                                    )}
                                  </div>
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
                          );
                        })}
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
                              {edu.date && <span className={styles.eduDate}>{formatRawDateRange(edu.date)}</span>}
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
                              <div className={styles.eduGpa}>
                                GPA: {edu.gpa}
                              </div>
                            )}
                            {edu.additionalInfo && (
                              <p className={styles.eduAdditional}>
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

                  {/* ── Certificates ── */}
                  {certificates && certificates.length > 0 && (
                    <section className={styles.section}>
                      <h2 className={styles.sectionTitle}>Certificates</h2>
                      <div className={styles.sectionContent}>
                        {certificates.map((cert) => (
                          <div key={cert.id} className={styles.entry}>
                            <div className={styles.entryTopRow}>
                              <h3 className={styles.entryTitle}>
                                {cert.link ? (
                                  <a
                                    href={formatUrl(cert.link)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.projectLink}
                                  >
                                    <span>{cert.name}</span>
                                    <ExternalLinkIcon />
                                  </a>
                                ) : (
                                  cert.name
                                )}
                              </h3>
                              {cert.year && (
                                <span className={styles.eduDate}>
                                  {formatSingleDate(cert.year)}
                                </span>
                              )}
                            </div>
                            {(cert.issuer || cert.additionalInfo) && (
                              <div className={styles.eduRow}>
                                {cert.issuer && <span className={styles.eduSchool}>{cert.issuer}</span>}
                                {cert.additionalInfo && (
                                  <span className={styles.eduDate}>{cert.additionalInfo}</span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
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
