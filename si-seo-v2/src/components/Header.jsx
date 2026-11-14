import React from 'react';
import { Icon } from './Icons.jsx';
import { PRESETS } from '../data/presets.js';

export const Header = ({ currentPreset, onSelectPreset }) => {
  return (
    <header className="si-header">
      <div className="si-header-left">
        <span className="si-badge-logo">SI-SEO</span>
        <span className="si-header-title">Playground de Teste em Tempo Real</span>
      </div>

      <div className="si-header-actions">
        <button
          type="button"
          className={`si-preset-btn btn-good ${currentPreset === 'optimized' ? 'is-active' : ''}`}
          onClick={() => onSelectPreset(PRESETS.optimized)}
        >
          <Icon name="star" size={13} />
          Artigo otimizado (100)
        </button>

        <button
          type="button"
          className={`si-preset-btn btn-moderate ${currentPreset === 'intermediate' ? 'is-active' : ''}`}
          onClick={() => onSelectPreset(PRESETS.intermediate)}
        >
          <Icon name="gear" size={13} />
          Artigo intermediário (~80)
        </button>

        <button
          type="button"
          className={`si-preset-btn btn-poor ${currentPreset === 'failing' ? 'is-active' : ''}`}
          onClick={() => onSelectPreset(PRESETS.failing)}
        >
          <Icon name="cross" size={12} />
          Artigo com falhas
        </button>

        <button
          type="button"
          className={`si-preset-btn ${currentPreset === 'realNews1' ? 'is-active' : ''}`}
          onClick={() => onSelectPreset(PRESETS.realNews1)}
          title="Matéria real do Saúde Insider"
        >
          Notícia Real (SI)
        </button>
      </div>
    </header>
  );
};
