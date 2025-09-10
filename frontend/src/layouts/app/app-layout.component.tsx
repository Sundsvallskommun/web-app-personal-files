'use client';

import { ReactNode, use, useEffect, useState } from 'react';
import 'dayjs/locale/sv';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import updateLocale from 'dayjs/plugin/updateLocale';
import { GuiProvider } from '@sk-web-gui/react';
import { useLocalStorage } from '@utils/use-localstorage.hook';
import { useShallow } from 'zustand/react/shallow';
import { useUserStore } from '@services/user-service/user-service';
import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { hasPermission } from '@utils/has-permission';
import EmptyLayout from '@layouts/empty-layout/empty-layout.component';
import { usePathname, useRouter } from 'next/navigation';

dayjs.extend(utc);
dayjs.locale('sv');
dayjs.extend(updateLocale);
dayjs.updateLocale('sv', {
  months: [
    'Januari',
    'Februari',
    'Mars',
    'April',
    'Maj',
    'Juni',
    'Juli',
    'Augusti',
    'September',
    'Oktober',
    'November',
    'December',
  ],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
});

interface ClientApplicationProps {
  children: ReactNode;
}

const AppLayout = ({ children }: ClientApplicationProps) => {
  const router = useRouter();
  const pathName = usePathname();
  const colorScheme = useLocalStorage(useShallow((state) => state.colorScheme));
  const getMe = useUserStore((state) => state.getMe);
  const user = useUserStore((state) => state.user);
  const { CANREADPF } = hasPermission(user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getMe().catch((e) => {});
    setMounted(true);
  }, [getMe, setMounted]);

  useEffect(() => {
    if (!user || !CANREADPF || (!CANREADPF && pathName.includes('sok-personakt'))) {
      router.push('/login');
    }
  }, [router, user]);

  if (!mounted) {
    return <LoaderFullScreen />;
  }

  return <GuiProvider colorScheme={colorScheme}>{children}</GuiProvider>;
};

export default AppLayout;
