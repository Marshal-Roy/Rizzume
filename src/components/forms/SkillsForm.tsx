'use client';
import { useResumeStore } from '@/store/useResumeStore';
import styles from './forms.module.css';

export default function SkillsForm() {
  const { data, updateSkills } = useResumeStore();

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.sectionTitle}>ENTER THE SKILLS YOU POSSESS</h2>
      <div className={styles.formGroup}>
        <textarea
          className={styles.textarea}
          placeholder="e.g. NextJs, React, TypeScript..."
          value={data.skills}
          onChange={(e) => updateSkills(e.target.value)}
        />
      </div>
      <div className={styles.actions}>
        <button className={styles.saveBtn}>SAVE TO SKILLS LIST</button>
      </div>
    </div>
  );
}
