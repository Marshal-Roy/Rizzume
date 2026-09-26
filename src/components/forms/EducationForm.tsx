'use client';
import { useState } from 'react';
import { useResumeStore, Education } from '@/store/useResumeStore';
import styles from './forms.module.css';

export default function EducationForm() {
  const { data, addEducation, updateEducation, removeEducation } = useResumeStore();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Education>>({
    degree: '', school: '', location: '', date: '', minor: '', gpa: '', additionalInfo: ''
  });

  const handleEdit = (edu: Education) => {
    setForm(edu);
    setEditingId(edu.id);
  };

  const handleAddNew = () => {
    setForm({ degree: '', school: '', location: '', date: '', minor: '', gpa: '', additionalInfo: '' });
    setEditingId('new');
  };

  const handleSave = () => {
    if (editingId === 'new') {
      addEducation({ ...form, id: Date.now().toString() } as Education);
    } else if (editingId) {
      updateEducation(editingId, form);
    }
    setEditingId(null);
  };

  if (editingId) {
    return (
      <div className={styles.formContainer}>
        <h2 className={styles.sectionTitle}>
          {editingId === 'new' ? 'ADD EDUCATION' : 'EDIT EDUCATION'}
        </h2>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>WHAT IS YOUR DEGREE OR OTHER QUALIFICATION?</label>
          <input className={styles.input} value={form.degree} onChange={(e) => setForm({...form, degree: e.target.value})} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>WHERE DID YOU EARN IT?</label>
          <input className={styles.input} value={form.school} onChange={(e) => setForm({...form, school: e.target.value})} />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>LOCATION</label>
            <input className={styles.input} value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>WHEN DID YOU EARN IT?</label>
            <input className={styles.input} value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>DID YOU MINOR IN ANYTHING?</label>
            <input className={styles.input} value={form.minor} onChange={(e) => setForm({...form, minor: e.target.value})} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>GPA (IF APPLICABLE)</label>
            <input className={styles.input} value={form.gpa} onChange={(e) => setForm({...form, gpa: e.target.value})} />
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>OPEN FIELD FOR ADDITIONAL INFORMATION</label>
          <textarea className={styles.textarea} style={{minHeight: '80px'}} value={form.additionalInfo} onChange={(e) => setForm({...form, additionalInfo: e.target.value})} />
        </div>

        <div className={styles.actions} style={{ gap: '1rem' }}>
          <button onClick={() => setEditingId(null)} className={styles.saveBtn} style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>CANCEL</button>
          <button onClick={handleSave} className={styles.saveBtn}>SAVE EDUCATION LIST</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.sectionTitle}>EDUCATION</h2>
      {data.education.map(edu => (
        <div key={edu.id} className={styles.listItem}>
          <div className={styles.itemDetails}>
            <h3>{edu.degree}</h3>
            <p>{edu.school} • {edu.date}</p>
          </div>
          <div className={styles.itemActions}>
            <button className={styles.editBtn} onClick={() => handleEdit(edu)}>Edit</button>
            <button className={styles.deleteBtn} onClick={() => removeEducation(edu.id)}>Delete</button>
          </div>
        </div>
      ))}
      <button className={styles.addBtn} onClick={handleAddNew}>+ ADD NEW EDUCATION</button>
    </div>
  );
}
