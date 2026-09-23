import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.nav}>
          <button className={styles.navItem}>CONTACT</button>
          <button className={styles.navItem}>EXPERIENCE</button>
          <button className={styles.navItem}>PROJECT</button>
          <button className={styles.navItem}>EDUCATION</button>
          <button className={styles.navItem}>SKILLS</button>
          <button className={`${styles.navItem} ${styles.active}`}>SUMMARY</button>
        </div>
        <div className={styles.actions}>
          <button className={styles.previewBtn}>FINISH UP & PREVIEW</button>
          <button className={styles.aiBtn}>AI COVER LETTER</button>
        </div>
      </header>

      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <div className={styles.videoPlaceholder}>
            <span className={styles.playIcon}>▶</span>
          </div>
          <div className={styles.scoreCard}>
            <div className={styles.scoreCircle}>73</div>
            <div className={styles.scoreText}>
              <strong>Your Rezi Score</strong>
              <span>Needs improvement</span>
            </div>
          </div>
        </aside>

        <section className={styles.content}>
          <div className={styles.formPanel}>
            <h2>WRITE A PROFESSIONAL SUMMARY</h2>
            <textarea 
              className={styles.textarea} 
              placeholder="Enter your professional summary here..."
            />
            <div className={styles.formActions}>
              <button className={styles.saveBtn}>SAVE SUMMARY INFO</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
