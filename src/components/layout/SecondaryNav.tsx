import React from 'react';
import Link from 'next/link';
import { NavItem } from './PrimaryNav';

export const DEFAULT_SECONDARY_NAV: NavItem[] = [
  {
    name: 'Opinião',
    href: '/editoria/opiniao',
    children: [
      { name: 'Artigos', href: '/editoria/opiniao/artigos' },
      { name: 'Colunistas', href: '/editoria/opiniao/colunistas' },
      { name: 'Editorial', href: '/editoria/opiniao/editorial' },
    ],
  },
  { name: 'Dashboard', href: '/editoria/dashboard' },
  { name: 'Cúpula', href: '/editoria/cupula' },
  { name: 'Newsletter', href: '/newsletter' },
  { name: 'Podcasts', href: '/editoria/podcasts' },
  { name: 'Tecnologia', href: '/editoria/tecnologia' },
];

export interface SecondaryNavProps {
  items?: NavItem[];
  className?: string;
  onLinkClick?: () => void;
}

export const SecondaryNav: React.FC<SecondaryNavProps> = ({
  items = DEFAULT_SECONDARY_NAV,
  className = 'si-nav si-nav--secondary',
  onLinkClick,
}) => {
  return (
    <nav className={className} aria-label="Seções">
      <ul id="menu-secoes" className="si-nav__list">
        {items.map((item) => (
          <li key={item.name} className={`menu-item ${item.children ? 'menu-item-has-children' : ''}`}>
            <Link href={item.href} onClick={onLinkClick}>
              {item.name}
            </Link>
            {item.children && (
              <ul className="sub-menu">
                {item.children.map((child) => (
                  <li key={child.name} className="menu-item">
                    <Link href={child.href} onClick={onLinkClick}>
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
