'use client';
import { useResumeStore } from '@/store/useResumeStore';
import styles from './forms.module.css';

export default function ContactForm() {
  const { data, updateContact } = useResumeStore();
  const { contact } = data;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateContact({ [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.sectionTitle}>BASIC INFORMATION</h2>
      
      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label className={styles.label}>FULL NAME</label>
          <input className={styles.input} name="fullName" value={contact.fullName} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>EMAIL ADDRESS</label>
          <input className={styles.input} name="email" type="email" value={contact.email} onChange={handleChange} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label className={styles.label}>PHONE NUMBER</label>
          <input className={styles.input} name="phone" value={contact.phone} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>LINKEDIN URL</label>
          <input className={styles.input} name="linkedin" value={contact.linkedin} onChange={handleChange} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label className={styles.label}>PERSONAL WEBSITE OR RELEVANT LINK</label>
          <input className={styles.input} name="website" value={contact.website} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>COUNTRY</label>
          <input className={styles.input} name="country" value={contact.country} onChange={handleChange} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label className={styles.label}>STATE</label>
          <input className={styles.input} name="state" value={contact.state} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>CITY</label>
          <input className={styles.input} name="city" value={contact.city} onChange={handleChange} />
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.saveBtn}>SAVE BASIC INFO</button>
      </div>
    </div>
  );
}
