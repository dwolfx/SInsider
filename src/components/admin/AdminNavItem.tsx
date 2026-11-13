import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface AdminNavItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
}

export const AdminNavItem: React.FC<AdminNavItemProps> = ({
  label,
  href,
  icon: Icon,
  isActive,
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition-colors ${
        isActive
          ? 'bg-[var(--si-color-brand-primary,#7a0f16)] text-white shadow-sm'
          : 'text-slate-400 hover:text-white hover:bg-[#151515]'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  );
};
