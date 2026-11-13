import React from 'react';
import { User } from '@/types';
import { RoleBadge } from './RoleBadge';

interface AdminUserProfileProps {
  user: User;
}

export const AdminUserProfile: React.FC<AdminUserProfileProps> = ({ user }) => {
  return (
    <div className="p-4 mx-4 my-4 rounded-lg bg-[#111111] border border-[#222222] flex items-center gap-3">
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="w-10 h-10 rounded-full object-cover border-2 border-[var(--si-color-brand-primary,#7a0f16)]"
      />
      <div className="overflow-hidden">
        <h4 className="text-xs font-bold text-white truncate">{user.name}</h4>
        <div className="mt-1">
          <RoleBadge role={user.role} />
        </div>
      </div>
    </div>
  );
};
