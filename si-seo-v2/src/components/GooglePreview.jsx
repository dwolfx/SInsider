import React, { useState } from 'react';

export const GooglePreview = ({ title, slug, desc }) => {
  const [device, setDevice] = useState('desktop');

  const cleanTitle = title || 'Título da sua matéria aparecerá aqui...';
  const cleanSlug = slug || 'slug-da-url-amigavel';
  const cleanDesc = desc || 'Adicione uma meta descrição persuasiva para os leitores encontrarem sua notícia nos resultados do Google.';

  const titleLen = cleanTitle.length;
  const descLen = cleanDesc.length;

  const getTitleStatus = () => {
    if (titleLen === 0) return 'poor';
    if (titleLen <= 60) return 'good';
    if (titleLen <= 70) return 'moderate';
    return 'poor';
  };

  const getDescStatus = () => {
    if (descLen === 0) return 'poor';
    if (descLen >= 120 && descLen <= 160) return 'good';
    if (descLen < 120) return 'moderate';
    return 'poor';
  };

  return (
    <div className="si-snippet-card">
      <div className="si-snippet-header">
        <span className="si-snippet-title">Prévia no Google</span>
        <div className="si-device-toggle">
          <button
            type="button"
            className={`si-device-btn ${device === 'desktop' ? 'is-active' : ''}`}
            onClick={() => setDevice('desktop')}
          >
            Desktop
          </button>
          <button
            type="button"
            className={`si-device-btn ${device === 'mobile' ? 'is-active' : ''}`}
            onClick={() => setDevice('mobile')}
          >
            Mobile
          </button>
        </div>
      </div>

      <div className={`si-serp-box ${device === 'mobile' ? 'is-mobile' : ''}`}>
        <div className="si-serp-source">
          <div className="si-serp-favicon">SI</div>
          <div className="si-serp-site-info">
            <span className="si-serp-site-name">Saúde Insider</span>
            <span className="si-serp-url">{`https://saudeinsider.com.br > ${cleanSlug}`}</span>
          </div>
        </div>

        <a className="si-serp-link" href="#preview" onClick={(e) => e.preventDefault()}>
          {cleanTitle}
        </a>

        <div className="si-serp-snippet">{cleanDesc}</div>
      </div>

      <div className="si-snippet-footer">
        <span className={`si-counter-text ${getTitleStatus()}`}>
          Título: {titleLen}/60 carac.
        </span>
        <span className={`si-counter-text ${getDescStatus()}`}>
          Meta Desc: {descLen}/160 carac.
        </span>
      </div>
    </div>
  );
};
