import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { useUserStore } from '@services/user-service/user-service';
import { Link, SearchField, FormLabel } from '@sk-web-gui/react';
import NextLink from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { capitalize } from 'underscore.string';
import { SearchPersonalFiles } from '@components/search-personal-files/search-personal-files.components';
import { SearchPersonalFileIcon } from '@components/app-icon/search-personal-file-icon.component';

export const SokPersonakt: React.FC = () => {
  const user = useUserStore((s) => s.user);
  const { t } = useTranslation();

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

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'example', 'layout'])),
  },
});

export default SokPersonakt;
