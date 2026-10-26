'use client';
import { useState } from 'react';
import { useResumeStore, Certificate } from '@/store/useResumeStore';
import styles from './forms.module.css';

export default function CertificatesForm() {
  const { data, addCertificate, updateCertificate, removeCertificate, reorderCertificates } = useResumeStore();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Certificate>>({
    name: '',
    year: '',
    issuer: '',
    link: '',
    additionalInfo: '',
  });

  const certificates = data.certificates || [];

  const handleEdit = (cert: Certificate) => {
    setForm(cert);
    setEditingId(cert.id);
  };

  const handleAddNew = () => {
    setForm({ name: '', year: '', issuer: '', link: '', additionalInfo: '' });
    setEditingId('new');
  };

  const handleSave = () => {
    if (editingId === 'new') {
      addCertificate({ ...form, id: Date.now().toString() } as Certificate);
    } else if (editingId) {
      updateCertificate(editingId, form);
    }
    setEditingId(null);
  };

  if (editingId) {
    return (
      <div className={styles.formContainer}>
        <h2 className={styles.sectionTitle}>
          {editingId === 'new' ? 'ADD CERTIFICATE' : 'EDIT CERTIFICATE'}
        </h2>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>WHAT IS THE CERTIFICATE / CERTIFICATION NAME?</label>
          <input 
            className={styles.input} 
            value={form.name || ''} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
            placeholder="e.g. AWS Certified Solutions Architect"
          />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>YEAR / DATE EARNED</label>
            <input 
              className={styles.input} 
              value={form.year || ''} 
              onChange={(e) => setForm({ ...form, year: e.target.value })} 
              placeholder="e.g. 2024 or May 2024"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>ISSUING ORGANIZATION (OPTIONAL)</label>
            <input 
              className={styles.input} 
              value={form.issuer || ''} 
              onChange={(e) => setForm({ ...form, issuer: e.target.value })} 
              placeholder="e.g. Amazon Web Services"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>CREDENTIAL LINK / URL (OPTIONAL)</label>
          <input 
            className={styles.input} 
            value={form.link || ''} 
            onChange={(e) => setForm({ ...form, link: e.target.value })} 
            placeholder="e.g. https://www.credly.com/badges/..."
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>ADDITIONAL INFORMATION (OPTIONAL)</label>
          <textarea 
            className={styles.textarea} 
            style={{ minHeight: '80px' }} 
            value={form.additionalInfo || ''} 
            onChange={(e) => setForm({ ...form, additionalInfo: e.target.value })} 
            placeholder="e.g. Credential ID, topics covered, honors..."
          />
        </div>

        <div className={styles.actions} style={{ gap: '1rem' }}>
          <button 
            type="button"
            onClick={() => setEditingId(null)} 
            className={styles.saveBtn} 
            style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            CANCEL
          </button>
          <button type="button" onClick={handleSave} className={styles.saveBtn}>
            SAVE CERTIFICATE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.sectionTitle}>CERTIFICATES</h2>
      {certificates.map((cert, idx) => (
        <div 
          key={cert.id} 
          className={styles.listItem}
          draggable
          onDragStart={(e) => {
            setDraggedIdx(idx);
            e.dataTransfer.effectAllowed = 'move';
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (draggedIdx !== null && draggedIdx !== idx) {
              reorderCertificates(draggedIdx, idx);
            }
            setDraggedIdx(null);
          }}
          style={{ opacity: draggedIdx === idx ? 0.5 : 1 }}
        >
          <div className={styles.dragHandle} title="Drag to reorder">☰</div>
          <div className={styles.itemDetails}>
            <h3>{cert.name || 'Untitled Certificate'}</h3>
            <p>{cert.issuer ? `${cert.issuer} • ` : ''}{cert.year}</p>
          </div>
          <div className={styles.itemActions}>
            <button type="button" className={styles.editBtn} onClick={() => handleEdit(cert)}>Edit</button>
            <button type="button" className={styles.deleteBtn} onClick={() => removeCertificate(cert.id)}>Delete</button>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addBtn} onClick={handleAddNew}>+ ADD NEW CERTIFICATE</button>
    </div>
  );
}
