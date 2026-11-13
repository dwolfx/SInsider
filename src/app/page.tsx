import React from 'react';
import Link from 'next/link';
import { LivePageRenderer } from '@/components/LivePageRenderer';
import { UserCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* 100% replica fiel do DOM de saudeinsider.com.br */}
      <LivePageRenderer />

      {/* Floating CTA para a Redação CMS de Victor Hugo */}
      <div className="fixed bottom-5 right-5 z-50">
        <Link
          href="/admin"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#7a0f16] text-white text-xs font-bold shadow-2xl hover:scale-105 transition-transform border border-white/20"
        >
          <UserCheck className="w-4 h-4" />
          <span>Redação & Governança CMS</span>
        </Link>
      </div>
    </>
  );
}
