'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function useNextRouter(basePath: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return {
    pathname,
    searchParams,
    push: (segment: string) => {
      const url = segment.startsWith('/') ? segment : `${basePath}/${segment}`;
      router.push(url);
    },
    replace: (segment: string) => {
      const url = segment.startsWith('/') ? segment : `${basePath}/${segment}`;
      router.replace(url);
    },
    navigate: (segment: string) => {
      const url = segment.startsWith('/') ? segment : `${basePath}/${segment}`;
      router.push(url); // Toolpad yêu cầu có navigate, dùng push tương đương
    },
  };
}
