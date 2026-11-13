import React, { useState, useEffect, useRef } from 'react';
import styles from './App.module.css';
import '../styles/tokens.module.css';
import { SeoPanel } from '../ui/SeoPanel/SeoPanel';
import { SeoAnalysisInput } from '../core/types';
import { sampleGoodPost, sampleMediumPost, sampleBadPost } from './presets';
import { createDiacriticRegexPattern, stripAccents } from '../core/textUtils';

const MIN_SIDEBAR_WIDTH = 340;
const MAX_SIDEBAR_WIDTH = 800;
const DEFAULT_SIDEBAR_WIDTH = 440;

export const App: React.FC = () => {
  const [postData, setPostData] = useState<SeoAnalysisInput>(sampleGoodPost);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [sidebarWidth, setSidebarWidth] = useState<number>(DEFAULT_SIDEBAR_WIDTH);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [activeHighlightKeyword, setActiveHighlightKeyword] = useState<string | null>(null);

  const isResizingRef = useRef(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFieldChange = (field: keyof SeoAnalysisInput, value: string) => {
    setPostData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Alternar o grifo da palavra-chave no texto
  const handleToggleHighlight = (keyword: string) => {
    if (activeHighlightKeyword && activeHighlightKeyword.toLowerCase() === keyword.toLowerCase()) {
      setActiveHighlightKeyword(null);
    } else {
      setActiveHighlightKeyword(keyword);
    }
  };

  // Sincronização do scroll entre o textarea e o backdrop
  const handleTextareaScroll = () => {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Gerenciamento de arrastar para redimensionar o painel flutuante
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    isResizingRef.current = true;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isResizingRef.current) {
        setIsResizing(false);
        isResizingRef.current = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Conta as ocorrências ativas (insensível a acentos)
  const getOccurrencesCount = () => {
    if (!activeHighlightKeyword || !postData.content) return 0;
    const pattern = createDiacriticRegexPattern(activeHighlightKeyword.trim());
    if (!pattern) return 0;
    const matches = postData.content.match(new RegExp(pattern, 'gi'));
    return matches ? matches.length : 0;
  };

  // Renderiza o backdrop com texto transparente e apenas os <mark> amarelos visíveis (insensível a acentos)
  const renderBackdropMarks = () => {
    if (!activeHighlightKeyword || !postData.content) {
      return postData.content;
    }

    const keyword = activeHighlightKeyword.trim();
    if (!keyword) return postData.content;

    const pattern = createDiacriticRegexPattern(keyword);
    if (!pattern) return postData.content;

    const regex = new RegExp(`(${pattern})`, 'gi');
    const parts = postData.content.split(regex);
    const normalizedKeyword = stripAccents(keyword.toLowerCase());

    return parts.map((part, index) => {
      if (stripAccents(part.toLowerCase()) === normalizedKeyword) {
        return (
          <mark key={index} className={styles.keywordMark}>
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className={styles.playground}>
      <header className={styles.topBar}>
        <div className={styles.brand}>
          <span className={styles.logoBadge}>SI-SEO</span>
          <h1 className={styles.title}>Playground de Teste em Tempo Real</h1>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.presetButton}
            onClick={() => {
              setPostData(sampleGoodPost);
              setActiveHighlightKeyword(null);
            }}
          >
            <svg
              className={styles.presetIcon}
              viewBox="0 0 20 20"
              fill="currentColor"
              style={{ color: 'var(--si-color-success, #10b981)' }}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>Artigo otimizado (100)</span>
          </button>

          <button
            type="button"
            className={styles.presetButton}
            onClick={() => {
              setPostData(sampleMediumPost);
              setActiveHighlightKeyword(null);
            }}
          >
            <svg
              className={styles.presetIcon}
              viewBox="0 0 20 20"
              fill="currentColor"
              style={{ color: 'var(--si-color-primary, #0066cc)' }}
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Artigo intermediário (~80)</span>
          </button>

          <button
            type="button"
            className={styles.presetButton}
            onClick={() => {
              setPostData(sampleBadPost);
              setActiveHighlightKeyword(null);
            }}
          >
            <svg
              className={styles.presetIcon}
              viewBox="0 0 20 20"
              fill="currentColor"
              style={{ color: 'var(--si-color-danger, #ef4444)' }}
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>Artigo com falhas</span>
          </button>
        </div>
      </header>

      <div className={styles.mainContent}>
        {/* Editor de Post Centralizado (intocado e sem compressão) */}
        <main className={styles.editorArea}>
          <div className={styles.card}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Título do Post (H1)</label>
              <input
                type="text"
                className={styles.input}
                value={postData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Insira o título..."
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Slug da URL</label>
              <input
                type="text"
                className={styles.input}
                value={postData.slug}
                onChange={(e) => handleFieldChange('slug', e.target.value)}
                placeholder="exemplo-de-slug"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Meta Descrição</label>
              <input
                type="text"
                className={styles.input}
                value={postData.metaDescription}
                onChange={(e) => handleFieldChange('metaDescription', e.target.value)}
                placeholder="Insira a meta descrição para o Google..."
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.contentFieldGroup}`}>
              <div className={styles.fieldHeader}>
                <label className={styles.label}>Conteúdo do Post (HTML / Texto)</label>
                {activeHighlightKeyword && (
                  <div className={styles.highlightBadge}>
                    <span>
                      Destaque ativo: &quot;{activeHighlightKeyword}&quot; ({getOccurrencesCount()} ocorrências)
                    </span>
                    <button
                      type="button"
                      className={styles.clearHighlightBtn}
                      onClick={() => setActiveHighlightKeyword(null)}
                      title="Desativar destaque"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Editor com Backdrop Sincronizado: 100% editável em tempo real */}
              <div className={styles.editorContainer}>
                <div ref={backdropRef} className={styles.editorBackdrop} aria-hidden="true">
                  {renderBackdropMarks()}
                </div>
                <textarea
                  ref={textareaRef}
                  className={styles.editorTextarea}
                  value={postData.content}
                  onChange={(e) => handleFieldChange('content', e.target.value)}
                  onScroll={handleTextareaScroll}
                  placeholder="Escreva ou cole o HTML do artigo aqui..."
                />
              </div>
            </div>
          </div>
        </main>

        {/* Seta Sticky quando o painel está fechado (fixa no topo direito da tela) */}
        {!isSidebarOpen && (
          <button
            type="button"
            className={styles.stickyArrowClosed}
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Abrir painel de SEO"
            title="Abrir painel de SEO"
          >
            <svg className={styles.arrowIcon} viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
        )}

        {/* Painel Flutuante / Drawer Overlay Redimensionável */}
        <aside
          className={`${styles.floatingDrawer} ${
            isSidebarOpen ? styles.floatingDrawerOpen : styles.floatingDrawerClosed
          }`}
          style={{ width: `${sidebarWidth}px` }}
        >
          {/* Alça de redimensionamento (arrastar na borda esquerda) */}
          <div
            className={`${styles.resizerHandle} ${isResizing ? styles.resizerActive : ''}`}
            onMouseDown={startResizing}
            title="Arraste para redimensionar a largura do painel"
          />

          {/* Seta Sticky no Topo da aba aberta (para recolher) */}
          <button
            type="button"
            className={styles.stickyArrowOpen}
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Recolher painel de SEO"
            title="Recolher painel de SEO"
          >
            <svg className={styles.arrowIcon} viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>

          <div className={styles.drawerInner}>
            <SeoPanel
              input={postData}
              onKeywordChange={(keyword) => handleFieldChange('focusKeyword', keyword)}
              onMetaDescriptionChange={(desc) => handleFieldChange('metaDescription', desc)}
              activeHighlightKeyword={activeHighlightKeyword || undefined}
              onToggleHighlight={handleToggleHighlight}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};
