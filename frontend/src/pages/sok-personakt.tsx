import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { useUserStore } from '@services/user-service/user-service';
import { Link, SearchField } from '@sk-web-gui/react';
import NextLink from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { capitalize } from 'underscore.string';
import { ChangeEvent } from 'react';

export const SokPersonakt: React.FC = () => {
  const user = useUserStore((s) => s.user);
  const { t } = useTranslation();
  console.log('user', user);
  return (
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - ${t('example:title')}`}>
      <Main>
        <div className="flex flex-col justify-center items-center gap-24">
          <h1 className="text-center">
            Sök personakt
            {/* {capitalize(`${t('common:welcome')}
            ${user.name ? ` ${user.name}` : ''}!`)} */}
          </h1>
          <div className="max-w-[590px] w-full pt-16 px-24 pb-24 shadow-100 rounded-button">
            <SearchField
              value={''}
              onChange={function (event: ChangeEvent<HTMLInputElement>): void {
                throw new Error('Function not implemented.');
              }}
            />
          </div>
          <p>I denna version kan du enbart söka personakter för timavlönade.</p>
          {user.name ?
            <NextLink href={`/logout`}>
              <Link as="span" variant="link">
                {capitalize(t('common:logout'))}
              </Link>
            </NextLink>
          : ''}
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
