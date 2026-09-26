'use client';
import { useState } from 'react';
import { useResumeStore, Experience } from '@/store/useResumeStore';
import styles from './forms.module.css';

export default function ExperienceForm() {
  const { data, addExperience, updateExperience, removeExperience } = useResumeStore();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Experience>>({
    role: '', company: '', startDate: '', endDate: '', location: '', description: []
  });
  const [bulletPoint, setBulletPoint] = useState('');

  const handleEdit = (exp: Experience) => {
    setForm(exp);
    setEditingId(exp.id);
  };

  const handleAddNew = () => {
    setForm({ role: '', company: '', startDate: '', endDate: '', location: '', description: [] });
    setEditingId('new');
  };

  const handleSave = () => {
    if (editingId === 'new') {
      addExperience({ ...form, id: Date.now().toString() } as Experience);
    } else if (editingId) {
      updateExperience(editingId, form);
    }
    setEditingId(null);
  };

  const handleAddBullet = () => {
    if (bulletPoint.trim()) {
      setForm({ ...form, description: [...(form.description || []), bulletPoint] });
      setBulletPoint('');
    }
  };

  if (editingId) {
    return (
      <div className={styles.formContainer}>
        <h2 className={styles.sectionTitle}>
          {editingId === 'new' ? 'ADD EXPERIENCE' : 'EDIT EXPERIENCE'}
        </h2>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>WHAT WAS YOUR ROLE?</label>
          <input className={styles.input} value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>FOR WHICH COMPANY DID YOU WORK?</label>
          <input className={styles.input} value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>START DATE</label>
            <input className={styles.input} value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>END DATE</label>
            <input className={styles.input} value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>WHERE WAS IT LOCATED?</label>
          <input className={styles.input} value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>WHAT DID YOU DO?</label>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
            {form.description?.map((desc, idx) => (
              <li key={idx} style={{ marginBottom: '0.25rem' }}>
                {desc}
                <button 
                  onClick={() => setForm({...form, description: form.description?.filter((_, i) => i !== idx)})}
                  style={{ marginLeft: '0.5rem', color: '#ef4444', fontSize: '0.75rem' }}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              className={styles.input} 
              value={bulletPoint} 
              onChange={(e) => setBulletPoint(e.target.value)} 
              placeholder="Add a bullet point..."
              onKeyDown={(e) => e.key === 'Enter' && handleAddBullet()}
            />
            <button onClick={handleAddBullet} className={styles.saveBtn} style={{ padding: '0 1rem' }}>+</button>
          </div>
        </div>

        <div className={styles.actions} style={{ gap: '1rem' }}>
          <button onClick={() => setEditingId(null)} className={styles.saveBtn} style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>CANCEL</button>
          <button onClick={handleSave} className={styles.saveBtn}>SAVE EXPERIENCE LIST</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.sectionTitle}>EXPERIENCE</h2>
      {data.experience.map(exp => (
        <div key={exp.id} className={styles.listItem}>
          <div className={styles.itemDetails}>
            <h3>{exp.role}</h3>
            <p>{exp.company} • {exp.startDate} - {exp.endDate}</p>
          </div>
          <div className={styles.itemActions}>
            <button className={styles.editBtn} onClick={() => handleEdit(exp)}>Edit</button>
            <button className={styles.deleteBtn} onClick={() => removeExperience(exp.id)}>Delete</button>
          </div>
        </div>
      ))}
      <button className={styles.addBtn} onClick={handleAddNew}>+ ADD NEW EXPERIENCE</button>
    </div>
  );
}
