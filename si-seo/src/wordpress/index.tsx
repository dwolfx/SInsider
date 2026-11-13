import React, { useState } from 'react';
import { SeoPanel } from '../ui/SeoPanel/SeoPanel';
import { SeoAnalysisInput } from '../core/types';

declare global {
  interface Window {
    wp?: {
      plugins?: {
        registerPlugin: (id: string, config: { render: React.ComponentType; icon: string }) => void;
      };
      editPost?: {
        PluginSidebar: React.ComponentType<{ name: string; title: string; icon: string; children: React.ReactNode }>;
      };
      data?: {
        select: (store: string) => any;
        dispatch: (store: string) => any;
      };
    };
  }
}

export const GutenbergSidebarIntegration: React.FC = () => {
  const wp = typeof window !== 'undefined' ? window.wp : undefined;

  // Se estiver rodando dentro do Gutenberg, assina as mudanças do post com useSelect em tempo real
  const postData = wp?.data?.useSelect?.((select: any) => {
    const editor = select('core/editor');
    if (!editor) return null;
    return {
      title: editor.getEditedPostAttribute('title') || '',
      content: editor.getEditedPostAttribute('content') || '',
      slug: editor.getEditedPostAttribute('slug') || '',
      meta: editor.getEditedPostAttribute('meta') || {},
    };
  }, []);

  if (wp?.data && postData) {
    const { title, content, slug, meta } = postData;
    const editorDispatch = wp.data.dispatch('core/editor');

    const focusKeyword = meta._si_seo_focus_keyword || meta._yoast_wpseo_focuskw || '';
    const metaDescription = meta._si_seo_meta_desc || meta._yoast_wpseo_metadesc || '';

    const handleKeywordChange = (newKeyword: string) => {
      editorDispatch?.editPost({
        meta: {
          ...meta,
          _si_seo_focus_keyword: newKeyword,
          _yoast_wpseo_focuskw: newKeyword, // Retrocompatibilidade direta com Yoast!
        },
      });
    };

    const handleMetaDescriptionChange = (newDesc: string) => {
      editorDispatch?.editPost({
        meta: {
          ...meta,
          _si_seo_meta_desc: newDesc,
          _yoast_wpseo_metadesc: newDesc, // Retrocompatibilidade direta com Yoast!
        },
      });
    };

    const input: SeoAnalysisInput = {
      focusKeyword,
      title,
      slug,
      metaDescription,
      content,
    };

    return (
      <SeoPanel
        input={input}
        onKeywordChange={handleKeywordChange}
        onMetaDescriptionChange={handleMetaDescriptionChange}
      />
    );
  }

  // Fallback caso seja renderizado fora do WordPress
  const [keyword, setKeyword] = useState('');
  const [metaDesc, setMetaDesc] = useState('Acompanhe as análises exclusivas do setor de saúde suplementar.');
  const fallbackInput: SeoAnalysisInput = {
    focusKeyword: keyword,
    title: 'Exemplo de Matéria no Saúde Insider',
    slug: 'exemplo-de-materia',
    metaDescription: metaDesc,
    content: 'A saúde suplementar tem passado por transformações profundas.',
  };

  return (
    <SeoPanel
      input={fallbackInput}
      onKeywordChange={setKeyword}
      onMetaDescriptionChange={setMetaDesc}
    />
  );
};

// Registra automaticamente no Gutenberg se o ambiente WordPress estiver presente
if (typeof window !== 'undefined' && window.wp?.plugins?.registerPlugin && window.wp?.editPost?.PluginSidebar) {
  const { registerPlugin } = window.wp.plugins;
  const { PluginSidebar } = window.wp.editPost;

  registerPlugin('si-seo-sidebar', {
    icon: 'chart-line',
    render: () => (
      <PluginSidebar name="si-seo-sidebar" title="SI-SEO (Saúde Insider)" icon="chart-line">
        <GutenbergSidebarIntegration />
      </PluginSidebar>
    ),
  });
}
