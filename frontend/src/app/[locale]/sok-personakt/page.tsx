'use client';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { useUserStore } from '@services/user-service/user-service';
import { SearchPersonalFiles } from '@components/search-personal-files/search-personal-files.components';
import { SearchPersonalFileIcon } from '@components/app-icon/search-personal-file-icon.component';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { hasPermission } from '@utils/has-permission';
import { usePathname, useRouter } from 'next/navigation';

export const SokPersonakt: React.FC = () => {
  const user = useUserStore((s) => s.user);
  const { CANREADPF } = hasPermission(user);
  const router = useRouter();
  const pathName = usePathname();

  const { t } = useTranslation();

  useEffect(() => {
    if (!CANREADPF) {
      router.push('/login');
    }
  }, [router, CANREADPF]);

  return (
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - ${t('example:title')}`}>
      <Main>
        <div className="flex flex-col justify-center items-center py-24 gap-24">
          <SearchPersonalFileIcon />
          <h1 className="text-center">Sök personakt</h1>
          <SearchPersonalFiles />
        </div>
      </Main>
    </DefaultLayout>
  );
};

export default SokPersonakt;
