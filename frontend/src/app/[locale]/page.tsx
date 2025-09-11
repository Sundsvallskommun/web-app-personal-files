'use client';

import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { useUserStore } from '@services/user-service/user-service';
import { hasPermission } from '@utils/has-permission';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Index = () => {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const { CANREADPF } = hasPermission(user);

  useEffect(() => {
    if (!CANREADPF) {
      router.push('/login');
    } else {
      router.push('/sok-personakt');
    }
  }, [router, CANREADPF]);

  return <LoaderFullScreen />;
};

export default Index;
