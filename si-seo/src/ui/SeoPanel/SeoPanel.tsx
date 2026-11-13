import React, { useMemo } from 'react';
import styles from './SeoPanel.module.css';
import { SeoAnalysisInput } from '../../core/types';
import { analyzeSeo } from '../../core/engine';
import { ScoreBadge } from '../ScoreBadge/ScoreBadge';
import { Checklist } from '../Checklist/Checklist';
import { KeywordInput } from '../KeywordInput/KeywordInput';
import { GoogleSnippet } from '../GoogleSnippet/GoogleSnippet';

interface SeoPanelProps {
  input: SeoAnalysisInput;
  onKeywordChange: (keyword: string) => void;
  onMetaDescriptionChange?: (metaDescription: string) => void;
  activeHighlightKeyword?: string;
  onToggleHighlight?: (keyword: string) => void;
}

export const SeoPanel: React.FC<SeoPanelProps> = ({
  input,
  onKeywordChange,
  onMetaDescriptionChange,
  activeHighlightKeyword,
  onToggleHighlight,
}) => {
  const report = useMemo(() => analyzeSeo(input), [input]);

  const isKeywordHighlighted = Boolean(
    activeHighlightKeyword &&
    input.focusKeyword &&
    activeHighlightKeyword.toLowerCase() === input.focusKeyword.trim().toLowerCase()
  );

  const hasKeyword = Boolean(input.focusKeyword && input.focusKeyword.trim());

  return (
    <div className={styles.panel}>
      {/* Header Sticky com Pontuação e Métricas Jornalísticas */}
      <div className={styles.stickyHeader}>
        <ScoreBadge
          score={hasKeyword ? report.overallScore : 0}
          status={hasKeyword ? report.status : 'warning'}
          isPending={!hasKeyword}
        />

        {hasKeyword && (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{report.statistics.wordCount}</span>
              <span className={styles.statLabel}>Palavras</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{report.statistics.readingTimeMinutes} min</span>
              <span className={styles.statLabel}>Leitura</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{report.statistics.keywordDensityPercent}%</span>
              <span className={styles.statLabel}>Densidade</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{report.statistics.fleschScore}/100</span>
              <span className={styles.statLabel}>Flesch PT</span>
            </div>
          </div>
        )}
      </div>

      {/* Palavra-chave Foco com Sugestões Inteligentes baseadas no Título */}
      <KeywordInput
        value={input.focusKeyword}
        onChange={onKeywordChange}
        title={input.title}
        isHighlighted={isKeywordHighlighted}
        onToggleHighlight={onToggleHighlight}
      />

      {/* Se NÃO houver palavra-chave definida, exibe APENAS a orientação de boas-vindas */}
      {!hasKeyword && (
        <div className={styles.onboardingBanner}>
          <svg
            className={styles.bannerIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <div className={styles.bannerContent}>
            <h5 className={styles.bannerTitle}>Defina a palavra-chave foco</h5>
            <p className={styles.bannerText}>
              Selecione uma das sugestões acima ou digite o assunto principal da matéria para ativar a análise detalhada de SEO, legibilidade e a prévia do Google.
            </p>
          </div>
        </div>
      )}

      {/* Módulos de Análise: Exibidos EXCLUSIVAMENTE quando há palavra-chave definida */}
      {hasKeyword && (
        <>
          {/* Módulo Dropdown: Prévia no Google (SERP) no topo + Meta Descrição logo abaixo */}
          <GoogleSnippet
            title={input.title}
            slug={input.slug}
            metaDescription={input.metaDescription}
            onMetaDescriptionChange={onMetaDescriptionChange}
            defaultOpen={true}
          />

          {/* Checklist Completo com 12 Regras em Acordeom */}
          <Checklist
            results={report.results}
            focusKeyword={input.focusKeyword}
            activeHighlightKeyword={activeHighlightKeyword}
            onToggleHighlight={onToggleHighlight}
          />
        </>
      )}
    </div>
  );
};
