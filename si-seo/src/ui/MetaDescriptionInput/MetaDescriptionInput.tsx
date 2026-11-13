import React from 'react';
import styles from './MetaDescriptionInput.module.css';

interface MetaDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const MIN_RECOMMENDED_CHARS = 120;
const MAX_RECOMMENDED_CHARS = 160;

export const MetaDescriptionInput: React.FC<MetaDescriptionInputProps> = ({ value, onChange }) => {
  const charCount = value ? value.length : 0;

  const getCounterClass = () => {
    if (charCount === 0) return styles.counterWarning;
    if (charCount > MAX_RECOMMENDED_CHARS) return styles.counterDanger;
    if (charCount >= MIN_RECOMMENDED_CHARS && charCount <= MAX_RECOMMENDED_CHARS) {
      return styles.counterSuccess;
    }
    return styles.counterWarning;
  };

  const getProgressBarColor = () => {
    if (charCount === 0) return '#cbd5e1';
    if (charCount > MAX_RECOMMENDED_CHARS) return 'var(--si-color-danger, #ef4444)';
    if (charCount >= MIN_RECOMMENDED_CHARS && charCount <= MAX_RECOMMENDED_CHARS) {
      return 'var(--si-color-success, #10b981)';
    }
    return 'var(--si-color-warning, #f59e0b)';
  };

  const progressPercent = Math.min(100, Math.round((charCount / MAX_RECOMMENDED_CHARS) * 100));

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <label className={styles.label} htmlFor="si-meta-description">
          Meta Descrição (Google Snippet)
        </label>
        <span className={`${styles.counter} ${getCounterClass()}`}>
          {charCount} / {MAX_RECOMMENDED_CHARS} carac.
        </span>
      </div>

      <textarea
        id="si-meta-description"
        className={styles.textarea}
        rows={3}
        placeholder="Escreva um resumo atrativo entre 120 e 160 caracteres para exibir nos resultados do Google..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <div className={styles.progressBarTrack}>
        <div
          className={styles.progressBarFill}
          style={{
            width: `${progressPercent}%`,
            backgroundColor: getProgressBarColor(),
          }}
        />
      </div>

      <p className={styles.helpText}>
        Ideal entre 120 e 160 caracteres com a palavra-chave para garantir máxima taxa de cliques (CTR).
      </p>
    </div>
  );
};
