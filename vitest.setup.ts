import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Global mock for next/navigation
vi.mock('next/navigation', () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
    notFound: () => {
      const error = new Error('NEXT_NOT_FOUND');
      (error as any).digest = 'NEXT_NOT_FOUND';
      throw error;
    },
  };
});

