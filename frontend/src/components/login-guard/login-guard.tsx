'use client';

import LoaderFullScreen from '@components/loader/loader-fullscreen';
import EmptyLayout from '@layouts/empty-layout/empty-layout.component';
import { useUserStore } from '@services/user-service/user-service';
import { hasPermission } from '@utils/has-permission';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export const LoginGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const user = useUserStore((s) => s.user);
  const getMe = useUserStore((s) => s.getMe);

  const router = useRouter();
  const pathName = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getMe().catch((message) => {
      const params = new URLSearchParams({ failMessage: message });
      router.push(`/login?${params.toString()}`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted || (!user.name && !pathName.includes('/login'))) {
    return <LoaderFullScreen />;
  }

  const { CANREADPF } = hasPermission(user);

  // Routes by permissions
  if (pathName == '/sok-personakt' && !CANREADPF) {
    router.push('/login');
    return (
      <EmptyLayout>
        <p>Du saknar behörigheter för att nå den här sidan</p>
      </EmptyLayout>
    );
  }

  return <>{children}</>;
};

export default LoginGuard;
