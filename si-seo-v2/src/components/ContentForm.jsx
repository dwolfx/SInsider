import React from 'react';
import { stripAccents } from '../engine/text-normalizer.js';

export const ContentForm = ({
  title,
  onChangeTitle,
  slug,
  onChangeSlug,
  desc,
  onChangeDesc,
  content,
  onChangeContent,
  keyword,
  activeHighlight,
}) => {
  /**
   * Renderiza o conteúdo com o destaque seguro da palavra-chave
   * Mantém acentos originais do texto intactos!
   */
  const renderHighlightedContent = () => {
    if (!activeHighlight || !keyword || !content) {
      return null;
    }

    const normKw = stripAccents(keyword.trim().toLowerCase());
    if (!normKw) return null;

    // Constrói padrão tolerante a acentos para cada caractere
    const accentPattern = normKw.split('').map((char) => {
      switch (char) {
        case 'a': return '[aáàãâä]';
        case 'e': return '[eéèêë]';
        case 'i': return '[iíìîï]';
        case 'o': return '[oóòõôö]';
        case 'u': return '[uúùûü]';
        case 'c': return '[cç]';
        default: return char.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      }
    }).join('');

    try {
      const regex = new RegExp(`(${accentPattern})`, 'gi');
      const parts = content.split(regex);

      return (
        <div className="si-form-group">
          <label className="si-label">Prévia com Termos Destacados</label>
          <div className="si-textarea si-highlight-preview">
            {parts.map((part, i) =>
              regex.test(part) ? (
                <mark key={i} className="si-highlight">
                  {part}
                </mark>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </div>
        </div>
      );
    } catch {
      return null;
    }
  };

  return (
    <div className="si-editor-pane">
      <div className="si-form-group">
        <label className="si-label" htmlFor="si-post-title">
          Título do Post (H1)
        </label>
        <input
          id="si-post-title"
          type="text"
          className="si-input"
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
          placeholder="Digite o título principal da matéria..."
        />
      </div>

      <div className="si-form-group">
        <label className="si-label" htmlFor="si-post-slug">
          Slug da URL
        </label>
        <input
          id="si-post-slug"
          type="text"
          className="si-input"
          value={slug}
          onChange={(e) => onChangeSlug(e.target.value)}
          placeholder="ex: omega-3-saude-coracao"
        />
      </div>

      <div className="si-form-group">
        <label className="si-label" htmlFor="si-post-desc">
          Meta Descrição
        </label>
        <input
          id="si-post-desc"
          type="text"
          className="si-input"
          value={desc}
          onChange={(e) => onChangeDesc(e.target.value)}
          placeholder="Resumo de 120 a 160 caracteres para o Google..."
        />
      </div>

      <div className="si-form-group">
        <label className="si-label" htmlFor="si-post-content">
          Conteúdo do Post (HTML / Texto)
        </label>
        <textarea
          id="si-post-content"
          className="si-textarea"
          value={content}
          onChange={(e) => onChangeContent(e.target.value)}
          placeholder="Escreva ou cole a matéria com subtítulos H2 e parágrafos..."
          rows={14}
        />
      </div>

      {renderHighlightedContent()}
    </div>
  );
};
