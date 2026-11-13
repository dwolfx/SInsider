import React from 'react';
import Link from 'next/link';
import { InstitutionalNav } from './InstitutionalNav';
import { SocialLinks } from './SocialLinks';

export const Footer: React.FC = () => {
  return (
    <footer className="si-footer">
      <div className="si-footer__inner">
        <p className="si-footer__marca">
          <Link className="si-footer__marca-link" href="/" rel="home">
            Saúde / Insider
          </Link>
        </p>

        <div className="si-footer__linha">
          <p className="si-footer__copyright">© {new Date().getFullYear()} Saúde Insider</p>
          <InstitutionalNav />
        </div>

        <SocialLinks />
      </div>
    </footer>
  );
};
