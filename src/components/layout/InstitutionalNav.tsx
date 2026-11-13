import React from 'react';
import Link from 'next/link';

export interface InstitutionalLink {
  name: string;
  href: string;
}

export const DEFAULT_INSTITUTIONAL_LINKS: InstitutionalLink[] = [
  { name: 'Quem Somos', href: '/quem-somos' },
  { name: 'Nossa Missão', href: '/missao' },
  { name: 'Propósito Editorial', href: '/proposito-editorial' },
  { name: 'Independência Editorial', href: '/independencia-editorial' },
  { name: 'Equipe', href: '/equipe' },
  { name: 'Termos de Uso', href: '/termos-de-uso' },
  { name: 'Política de Privacidade', href: '/politica-de-privacidade' },
  { name: 'Contato', href: '/contato' },
];

export interface InstitutionalNavProps {
  links?: InstitutionalLink[];
}

export const InstitutionalNav: React.FC<InstitutionalNavProps> = ({
  links = DEFAULT_INSTITUTIONAL_LINKS,
}) => {
  return (
    <nav className="si-footer__nav" aria-label="Links institucionais">
      <ul id="menu-institucional" className="si-footer__links">
        {links.map((link) => (
          <li key={link.name} className="menu-item">
            <Link href={link.href}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
