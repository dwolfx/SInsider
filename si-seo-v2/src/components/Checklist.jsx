import React, { useState } from 'react';
import { Icon } from './Icons.jsx';

export const Checklist = ({ checks = [], onHighlightKeyword, activeHighlight }) => {
  // Inicialmente expande itens com alerta ou erro para chamar atenção para correções
  const [expandedItems, setExpandedItems] = useState(() => {
    const initial = {};
    checks.forEach((c) => {
      if (c.status !== 'good') {
        initial[c.id] = true;
      }
    });
    return initial;
  });

  const toggleItem = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="si-checklist">
      {checks.map((item) => {
        const isExpanded = !!expandedItems[item.id];
        const statusIconName =
          item.status === 'good'
            ? 'check'
            : item.status === 'moderate' || item.status === 'warning'
            ? 'warning'
            : 'error';

        return (
          <div
            key={item.id}
            className={`si-check-item ${isExpanded ? 'is-expanded' : ''}`}
          >
            <div
              className="si-check-header"
              onClick={() => toggleItem(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && toggleItem(item.id)}
            >
              <div className="si-check-title-group">
                <span className={`si-status-icon ${item.status}`}>
                  <Icon name={statusIconName} size={16} />
                </span>
                <span className="si-check-title">{item.title}</span>
              </div>
              <span className="si-chevron-icon">
                <Icon name="chevron-down" size={14} />
              </span>
            </div>

            {isExpanded && (
              <div className="si-check-body">
                <div className="si-check-message">{item.message}</div>

                {item.tip && (
                  <div className="si-tip-box">
                    <Icon name="lightbulb" size={15} />
                    <div className="si-tip-text">
                      <strong className="si-tip-label">Dica:</strong>
                      {item.tip}
                    </div>
                  </div>
                )}

                {item.actionText && onHighlightKeyword && (
                  <button
                    type="button"
                    className={`si-action-btn ${activeHighlight ? 'is-active' : ''}`}
                    onClick={() => onHighlightKeyword()}
                  >
                    <Icon name="eye" size={13} />
                    {item.actionText}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
