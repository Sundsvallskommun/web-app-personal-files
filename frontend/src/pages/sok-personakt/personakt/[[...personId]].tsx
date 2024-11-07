import { PersonalFileUploadDocument } from '@components/personal-file/personal-file-upload-document.component';
import { EmploymentsTab } from '@components/personal-file/tabs/employments-tab.component';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { searchHitADUser, useEmployeeStore } from '@services/employee-service/employee-service';
import { t } from 'i18next';
import { default as NextLink } from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Personakt() {
  const router = useRouter();
  const routerPersonId = router.query['personId'];
  const employeeEmployments = useEmployeeStore((s) => s.employee);
  const getEmploymentsById = useEmployeeStore((s) => s.getEmploymentsById);
  const personId = routerPersonId && Array.isArray(routerPersonId) ? routerPersonId.pop() : null;

  useEffect(() => {
    const loadClass = async () => {
      if (personId) {
        if (router.pathname.includes(personId)) return;
        if (!employeeEmployments.length && employeeEmployments[0].personId !== personId) {
          await getEmploymentsById(routerPersonId as string);
        }
      } else {
        if (!personId) {
          router.push('/sok-personakt');
        }
      }
    };

    if (router.isReady) {
      loadClass();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, router.isReady]);

  return (
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - ${t('example:title')}`}>
      <Main>
        <div className="flex justify-between items-center max-w-[960px] w-full m-auto">
          <h1>
            {employeeEmployments[0].givenname} {employeeEmployments[0].lastname}
          </h1>
          <PersonalFileUploadDocument />
        </div>
        <div className="max-w-[960px] w-full m-auto">
          <EmploymentsTab />
        </div>
      </Main>
    </DefaultLayout>
  );
}
