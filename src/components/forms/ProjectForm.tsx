'use client';
import { useState } from 'react';
import { useResumeStore, Project } from '@/store/useResumeStore';
import styles from './forms.module.css';

export default function ProjectForm() {
  const { data, addProject, updateProject, removeProject } = useResumeStore();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Project>>({
    title: '', subtitle: '', description: []
  });
  const [bulletPoint, setBulletPoint] = useState('');

  const handleEdit = (proj: Project) => {
    setForm(proj);
    setEditingId(proj.id);
  };

  const handleAddNew = () => {
    setForm({ title: '', subtitle: '', description: [] });
    setEditingId('new');
  };

  const handleSave = () => {
    if (editingId === 'new') {
      addProject({ ...form, id: Date.now().toString() } as Project);
    } else if (editingId) {
      updateProject(editingId, form);
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
          {editingId === 'new' ? 'ADD PROJECT' : 'EDIT PROJECT'}
        </h2>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>PROJECT TITLE</label>
          <input className={styles.input} value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>SUBTITLE (e.g., Company or Tech Stack)</label>
          <input className={styles.input} value={form.subtitle} onChange={(e) => setForm({...form, subtitle: e.target.value})} />
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
          <button onClick={handleSave} className={styles.saveBtn}>SAVE PROJECT LIST</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.sectionTitle}>PROJECTS</h2>
      {data.projects.map(proj => (
        <div key={proj.id} className={styles.listItem}>
          <div className={styles.itemDetails}>
            <h3>{proj.title}</h3>
            <p>{proj.subtitle}</p>
          </div>
          <div className={styles.itemActions}>
            <button className={styles.editBtn} onClick={() => handleEdit(proj)}>Edit</button>
            <button className={styles.deleteBtn} onClick={() => removeProject(proj.id)}>Delete</button>
          </div>
        </div>
      ))}
      <button className={styles.addBtn} onClick={handleAddNew}>+ ADD NEW PROJECT</button>
    </div>
  );
}
