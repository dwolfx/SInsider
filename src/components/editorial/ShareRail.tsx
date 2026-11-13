'use client';

import React from 'react';
import { ShareRailCopyButton } from './ShareRailCopyButton';
import { ShareRailSocialLinks } from './ShareRailSocialLinks';

interface ShareRailProps {
  title: string;
  url: string;
}

export const ShareRail: React.FC<ShareRailProps> = ({ title, url }) => {
  const fullUrl = url.startsWith('http') ? url : `https://saudeinsider.com.br${url}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="si-article__rail">
      <div className="si-article__rail-inner">
        <span className="si-article__rail-divisor" aria-hidden="true" />
        <ShareRailSocialLinks encodedUrl={encodedUrl} encodedTitle={encodedTitle} />
        <ShareRailCopyButton fullUrl={fullUrl} />
      </div>
    </div>
  );
};
