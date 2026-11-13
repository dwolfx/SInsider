'use client';

import React, { useState } from 'react';

interface ShareRailCopyButtonProps {
  fullUrl: string;
}

export const ShareRailCopyButton: React.FC<ShareRailCopyButtonProps> = ({ fullUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`si-article__acao ${copied ? 'si-acao--copiado' : ''}`}
      aria-label={copied ? 'Link copiado!' : 'Copiar link da notícia'}
      title={copied ? 'Link copiado!' : 'Copiar link da notícia'}
    >
      <svg
        className="si-icon"
        aria-hidden="true"
        focusable="false"
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.25 8.125a3.125 3.125 0 0 0 4.7125.3375l1.875-1.875a3.125 3.125 0 0 0-4.41875-4.41875L7.34375 3.2375"
          stroke={copied ? '#008a05' : '#767676'}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.75 6.875a3.125 3.125 0 0 0-4.7125-.3375L2.1625 8.4125a3.125 3.125 0 0 0 4.41875 4.41875L7.65625 11.7625"
          stroke={copied ? '#008a05' : '#767676'}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};
