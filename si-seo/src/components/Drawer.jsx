import React from 'react';
import { Icon } from './Icons.jsx';

export const Drawer = ({ isOpen, onClose, onToggle, score, statusClass, children }) => {
  return (
    <>
      {/* Floating Trigger Tab na lateral direita */}
      <button
        type="button"
        className="si-drawer-trigger"
        onClick={onToggle}
        aria-label="Abrir painel de SEO"
        title="SI-SEO Análise em Tempo Real"
      >
        <span className={`si-drawer-trigger-badge ${statusClass}`}>
          {score}
        </span>
        <span className="si-drawer-trigger-arrow">
          <Icon name={isOpen ? 'chevron-right' : 'chevron-left'} size={16} />
        </span>
      </button>

      {/* Backdrop transparente / blur */}
      <div
        className={`si-drawer-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
      />

      {/* Drawer deslizante flutuante com z-index alto */}
      <aside className={`si-drawer ${isOpen ? 'is-open' : ''}`}>
        <div className="si-drawer-header">
          <div className="si-drawer-header-title">
            <span className="si-badge-logo">SI-SEO</span>
            <span>Auditoria & Insights de SEO</span>
          </div>
          <button
            type="button"
            className="si-drawer-close-btn"
            onClick={onClose}
            aria-label="Fechar painel"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="si-drawer-body">
          {children}
        </div>
      </aside>
    </>
  );
};
