'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function PromoterLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('promoter_token');
    const user = Cookies.get('promoter_user');
    if (!token || !user) {
      router.replace('/promoter/login');
    }
  }, [router]);

  return <>{children}</>;
}
