import React, { useState } from 'react';
import styles from './GoogleSnippet.module.css';
import { SerpPreview } from '../SerpPreview/SerpPreview';
import { MetaDescriptionInput } from '../MetaDescriptionInput/MetaDescriptionInput';

interface GoogleSnippetProps {
  title: string;
  slug: string;
  metaDescription: string;
  onMetaDescriptionChange?: (metaDescription: string) => void;
  defaultOpen?: boolean;
}

export const GoogleSnippet: React.FC<GoogleSnippetProps> = ({
  title,
  slug,
  metaDescription,
  onMetaDescriptionChange,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const descLen = metaDescription ? metaDescription.length : 0;
  
  const getSnippetStatus = () => {
    if (descLen === 0) {
      return { label: 'Descrição pendente', class: styles.statusPillWarning };
    }
    if (descLen > 160) {
      return { label: 'Muito longa', class: styles.statusPillDanger };
    }
    if (descLen >= 120 && descLen <= 160) {
      return { label: 'Tamanho ideal', class: styles.statusPillSuccess };
    }
    return { label: `${descLen}/160 caracteres`, class: styles.statusPillWarning };
  };

  const status = getSnippetStatus();

  return (
    <div className={styles.accordion}>
      <button
        type="button"
        className={styles.accordionHeader}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className={styles.headerLeft}>
          <svg
            className={styles.googleIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className={styles.title}>Prévia no Google</span>
        </div>

        <div className={styles.headerRight}>
          <span className={`${styles.statusPill} ${status.class}`}>{status.label}</span>
          <svg
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className={styles.accordionContent}>
          {/* 1. Prévia no Google Desktop & Mobile no topo */}
          <SerpPreview title={title} slug={slug} metaDescription={metaDescription} />

          {/* 2. Campo de Meta Descrição ABAIXO da Prévia para visualização direta */}
          {onMetaDescriptionChange && (
            <MetaDescriptionInput value={metaDescription} onChange={onMetaDescriptionChange} />
          )}
        </div>
      )}
    </div>
  );
};
