import React, { useMemo } from 'react';
import styles from './KeywordInput.module.css';

interface KeywordInputProps {
  value: string;
  onChange: (value: string) => void;
  title?: string;
  isHighlighted?: boolean;
  onToggleHighlight?: (keyword: string) => void;
}

export const KeywordInput: React.FC<KeywordInputProps> = ({
  value,
  onChange,
  title = '',
  isHighlighted = false,
  onToggleHighlight,
}) => {
  // Extrai sugestões inteligentes de palavras-chave baseadas no Título do post
  const suggestions = useMemo(() => {
    if (!title || !title.trim()) return [];

    const raw = title.trim();
    const candidates: string[] = [];

    // 1. Frases separadas por pontuação natural (: - | / ?)
    const parts = raw.split(/[:\-|/?!]/).map((p) => p.trim()).filter((p) => p.length >= 3);
    parts.forEach((p) => {
      const clean = p.toLowerCase();
      if (!candidates.includes(clean) && clean.split(/\s+/).length <= 4) {
        candidates.push(clean);
      }
    });

    // 2. Primeira entidade de 2 a 3 palavras do título
    const words = raw.split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      const firstTwo = `${words[0]} ${words[1]}`.toLowerCase().replace(/[^a-záàâãéêíóôõúç\s]/gi, '').trim();
      if (!candidates.includes(firstTwo) && firstTwo.length >= 4) {
        candidates.push(firstTwo);
      }
    }

    if (words.length >= 3) {
      const firstThree = `${words[0]} ${words[1]} ${words[2]}`.toLowerCase().replace(/[^a-záàâãéêíóôõúç\s]/gi, '').trim();
      if (!candidates.includes(firstThree) && firstThree.length >= 6) {
        candidates.push(firstThree);
      }
    }

    return candidates.slice(0, 3);
  }, [title]);

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <label className={styles.label} htmlFor="si-focus-keyword">
          Palavra-chave Foco
        </label>

        {value.trim() && onToggleHighlight && (
          <button
            type="button"
            className={`${styles.highlightButton} ${isHighlighted ? styles.highlightButtonActive : ''}`}
            onClick={() => onToggleHighlight(value)}
            title={isHighlighted ? 'Desativar destaque no texto' : 'Destacar no texto'}
          >
            <svg className={styles.btnIcon} viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{isHighlighted ? 'Desativar destaque' : 'Destacar no texto'}</span>
          </button>
        )}
      </div>

      <input
        id="si-focus-keyword"
        type="text"
        className={styles.input}
        placeholder="Digite o termo ou assunto principal da matéria..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <p className={styles.helpText}>
        Insira o termo exato que os leitores vão buscar no Google (ex: medicamento, sintoma, estudo clínico ou tema da reportagem).
      </p>

      {/* Sugestões inteligentes em pílulas com ícone vetorial */}
      {suggestions.length > 0 && !value && (
        <div className={styles.suggestionsBox}>
          <div className={styles.suggestionsTitle}>
            <svg className={styles.sparkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            <span>Sugestões baseadas no título (clique para escolher):</span>
          </div>
          <div className={styles.pillsRow}>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className={styles.suggestionPill}
                onClick={() => onChange(suggestion)}
                title={`Usar "${suggestion}" como palavra-chave foco`}
              >
                <svg className={styles.pillTagIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
