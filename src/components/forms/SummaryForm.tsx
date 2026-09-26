'use client';
import { useResumeStore } from '@/store/useResumeStore';
import styles from './forms.module.css';

export default function SummaryForm() {
  const { data, updateSummary } = useResumeStore();

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.sectionTitle}>WRITE A PROFESSIONAL SUMMARY</h2>
      <div className={styles.formGroup}>
        <textarea
          className={styles.textarea}
          placeholder="Enter your professional summary here..."
          value={data.summary}
          onChange={(e) => updateSummary(e.target.value)}
        />
      </div>
      <div className={styles.actions}>
        <button className={styles.saveBtn}>SAVE SUMMARY INFO</button>
      </div>
    </div>
  );
}
