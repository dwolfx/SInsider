import React, { useState, useEffect } from 'react';
import styles from './Checklist.module.css';
import { SeoRuleResult } from '../../core/types';

interface ChecklistItemProps {
  rule: SeoRuleResult;
  focusKeyword?: string;
  activeHighlightKeyword?: string;
  onToggleHighlight?: (keyword: string) => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  rule,
  focusKeyword,
  activeHighlightKeyword,
  onToggleHighlight,
}) => {
  // Erros e avisos iniciam abertos; itens de sucesso iniciam fechados
  const [isOpen, setIsOpen] = useState<boolean>(rule.status !== 'success');

  // Atualiza se o status mudar dinamicamente conforme o usuário digita
  useEffect(() => {
    setIsOpen(rule.status !== 'success');
  }, [rule.status]);

  const getStatusClass = () => {
    switch (rule.status) {
      case 'success':
        return styles.statusSuccess;
      case 'warning':
        return styles.statusWarning;
      case 'error':
      default:
        return styles.statusError;
    }
  };

  const renderStatusIcon = () => {
    switch (rule.status) {
      case 'success':
        return (
          <svg className={styles.iconSuccess} viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg className={styles.iconWarning} viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'error':
      default:
        return (
          <svg className={styles.iconError} viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const isKeywordRule = rule.id === 'keyword-density' || rule.id.startsWith('keyword-');
  const isHighlighted = Boolean(
    activeHighlightKeyword &&
    focusKeyword &&
    activeHighlightKeyword.toLowerCase() === focusKeyword.trim().toLowerCase()
  );

  return (
    <div className={`${styles.item} ${getStatusClass()}`}>
      <button
        type="button"
        className={styles.itemHeader}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <div className={styles.headerMain}>
          <span className={styles.iconWrapper}>{renderStatusIcon()}</span>
          <h5 className={styles.itemTitle}>{rule.name}</h5>
        </div>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.itemBody}>
          <p className={styles.itemMessage}>{rule.message}</p>
          {rule.status !== 'success' && (
            <div className={styles.itemRecommendation}>
              <svg
                className={styles.tipIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                <path d="M9 18h6" />
                <path d="M10 22h4" />
              </svg>
              <div className={styles.tipContent}>
                <strong className={styles.tipLabel}>Dica:</strong>
                <span>{rule.recommendation}</span>
              </div>
            </div>
          )}

          {isKeywordRule && focusKeyword && onToggleHighlight && (
            <button
              type="button"
              className={`${styles.highlightButton} ${isHighlighted ? styles.highlightButtonActive : ''}`}
              onClick={() => onToggleHighlight(focusKeyword)}
              title={isHighlighted ? 'Desativar destaque no texto' : `Destacar "${focusKeyword}" no texto`}
            >
              <svg className={styles.btnIcon} viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                {isHighlighted
                  ? 'Desativar destaque no texto'
                  : `Destacar "${focusKeyword}" no texto`}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
