import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header.jsx';
import { ContentForm } from './components/ContentForm.jsx';
import { ScoreCard } from './components/ScoreCard.jsx';
import { KeywordInput } from './components/KeywordInput.jsx';
import { GooglePreview } from './components/GooglePreview.jsx';
import { Checklist } from './components/Checklist.jsx';
import { Drawer } from './components/Drawer.jsx';

import { runSeoAnalysis } from './engine/seo-analyzer.js';
import { extractSuggestedKeywords } from './engine/keyword-extractor.js';
import { PRESETS } from './data/presets.js';

import './styles/app.css';
import './styles/drawer.css';
import './styles/checklist.css';
import './styles/snippet.css';

export const App = ({ mode = 'playground' }) => {
  // Inicialização segura: se tiver dados do WordPress injetados via window, usa eles
  const wpData = typeof window !== 'undefined' && window.SI_SEO_DATA ? window.SI_SEO_DATA : null;

  const [currentPreset, setCurrentPreset] = useState(wpData ? 'custom' : 'intermediate');
  const [keyword, setKeyword] = useState(wpData?.keyword || PRESETS.intermediate.keyword);
  const [title, setTitle] = useState(wpData?.title || PRESETS.intermediate.title);
  const [slug, setSlug] = useState(wpData?.slug || PRESETS.intermediate.slug);
  const [desc, setDesc] = useState(wpData?.desc || PRESETS.intermediate.desc);
  const [content, setContent] = useState(wpData?.content || PRESETS.intermediate.content);

  const [activeHighlight, setActiveHighlight] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Seleção de Preset
  const handleSelectPreset = (preset) => {
    setCurrentPreset(preset.id);
    setKeyword(preset.keyword);
    setTitle(preset.title);
    setSlug(preset.slug);
    setDesc(preset.desc);
    setContent(preset.content);
    setActiveHighlight(false);
  };

  // Motor de análise em tempo real
  const analysis = useMemo(() => {
    return runSeoAnalysis({
      keyword,
      title,
      slug,
      desc,
      content,
    });
  }, [keyword, title, slug, desc, content]);

  // Extração inteligente de palavras-chave sugeridas do texto
  const suggestedKeywords = useMemo(() => {
    return extractSuggestedKeywords(title, content, 6);
  }, [title, content]);

  // Se o WordPress Gutenberg estiver ativo, ouve atualizações do editor
  useEffect(() => {
    if (typeof window !== 'undefined' && window.wp && window.wp.data) {
      const unsubscribe = window.wp.data.subscribe(() => {
        try {
          const editor = window.wp.data.select('core/editor');
          if (editor) {
            const currentTitle = editor.getEditedPostAttribute('title');
            const currentSlug = editor.getEditedPostAttribute('slug');
            const currentContent = editor.getEditedPostContent();
            if (currentTitle && currentTitle !== title) setTitle(currentTitle);
            if (currentSlug && currentSlug !== slug) setSlug(currentSlug);
            if (currentContent && currentContent !== content) setContent(currentContent);
          }
        } catch {
          // Fallback silencioso
        }
      });
      return () => unsubscribe();
    }
  }, [title, slug, content]);

  // Conteúdo unificado do plugin (renderizado exclusivamente dentro do Drawer)
  const pluginDrawerContent = (
    <>
      <ScoreCard analysis={analysis} />

      <KeywordInput
        keyword={keyword}
        onChangeKeyword={(val) => {
          setKeyword(val);
          setCurrentPreset('custom');
        }}
        suggestedKeywords={suggestedKeywords}
      />

      <GooglePreview title={title} slug={slug} desc={desc} />

      <Checklist
        checks={analysis.checks}
        onHighlightKeyword={() => setActiveHighlight((prev) => !prev)}
        activeHighlight={activeHighlight}
      />
    </>
  );

  // Modo Gutenberg Injetado: Apenas o Drawer Flutuante sobre o post
  if (mode === 'drawer') {
    return (
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onToggle={() => setIsDrawerOpen((prev) => !prev)}
        score={analysis.score}
        statusClass={analysis.statusClass}
      >
        {pluginDrawerContent}
      </Drawer>
    );
  }

  // Modo Playground (Página Limpa com Editor Centralizado + Drawer Flutuante)
  return (
    <div className="si-app">
      <Header currentPreset={currentPreset} onSelectPreset={handleSelectPreset} />

      <main className="si-main-content">
        <ContentForm
          title={title}
          onChangeTitle={(val) => {
            setTitle(val);
            setCurrentPreset('custom');
          }}
          slug={slug}
          onChangeSlug={(val) => {
            setSlug(val);
            setCurrentPreset('custom');
          }}
          desc={desc}
          onChangeDesc={(val) => {
            setDesc(val);
            setCurrentPreset('custom');
          }}
          content={content}
          onChangeContent={(val) => {
            setContent(val);
            setCurrentPreset('custom');
          }}
          keyword={keyword}
          activeHighlight={activeHighlight}
        />
      </main>

      {/* O Plugin fica exclusivamente no Drawer/Toggle retrátil com z-index alto */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onToggle={() => setIsDrawerOpen((prev) => !prev)}
        score={analysis.score}
        statusClass={analysis.statusClass}
      >
        {pluginDrawerContent}
      </Drawer>
    </div>
  );
};
