'use client';

import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { useUserStore } from '@services/user-service/user-service';
import { hasPermission } from '@utils/has-permission';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Index = () => {
  const router = useRouter();
  const getMe = useUserStore((s) => s.getMe);
  const user = useUserStore((s) => s.user);
  const { CANREADPF } = hasPermission(user);
  useEffect(() => {
    getMe()
      .then((me) => {
        router.push('/sok-personakt');
      })
      .catch((message) => {
        const params = new URLSearchParams({ failMessage: message });
        router.push(`/login?${params.toString()}`);
      });
  }, [router]);

  return <LoaderFullScreen />;
};

export default Index;
