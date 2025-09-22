'use client';

import { PersonalFileEmploymentFilter } from '@components/personal-file/personal-file-employment-filter.components';
import { PersonalFileUploadDocument } from '@components/personal-file/personal-file-upload-document.component';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { useEmployeeStore } from '@services/employee-service/employee-service';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Divider } from '@sk-web-gui/react';
import { TabsWrapper } from '@components/personal-file/tabs/tabs-wrapper.components';
import { hasPermission } from '@utils/has-permission';
import { useUserStore } from '@services/user-service/user-service';
import { Employment } from '@interfaces/employee/employee';

export default function Personakt() {
  const router = useRouter();
  const query = useSearchParams();
  const pathName = usePathname();
  const routerPersonId = pathName?.split('/')[2];
  const employeeUsersEmployments = useEmployeeStore((s) => s.employeeUsersEmployments);
  const getEmploymentsById = useEmployeeStore((s) => s.getEmploymentsById);
  const setEmploymentslist = useEmployeeStore((s) => s.setEmployments);
  const personId = pathName?.split('/')[2] ? pathName?.split('/')[2] : null;
  const user = useUserStore((s) => s.user);
  const setEmpIsLoading = useEmployeeStore((s) => s.setEmpIsLoading);

  const { CANUPLOAD, CANREADPF } = hasPermission(user);

  useEffect(() => {
    if (!user || !CANREADPF) {
      router.push('/login');
    }
  }, [user]);

  useEffect(() => {
    setEmpIsLoading(false);
    const loadPersonalFile = async () => {
      if (personId) {
        if (pathName.includes(personId)) return;
        if (!employeeUsersEmployments.length || employeeUsersEmployments[0].personId !== personId) {
          await getEmploymentsById(routerPersonId as string);
          const employments: Employment[] = [];

          employeeUsersEmployments.map((users) =>
            users?.employments?.map((emp) => {
              employments.push(emp);
            })
          );

          setEmploymentslist(employments);
        }
      } else {
        !personId ? router.push('/sok-personakt') : router.push(pathName);
      }
    };

    if (router) {
      if (CANREADPF) {
        loadPersonalFile();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, query, CANREADPF]);

  return (
    <DefaultLayout>
      <Main>
        <div className="flex justify-between items-center max-w-[996px] w-full m-auto">
          <h1 className="w-fit">
            {employeeUsersEmployments[0]?.givenname} {employeeUsersEmployments[0]?.lastname}
          </h1>
          <div className="flex gap-16">
            <PersonalFileEmploymentFilter />
            {CANUPLOAD && (
              <>
                <Divider orientation="vertical" />
                <PersonalFileUploadDocument />
              </>
            )}
          </div>
        </div>
        <div className="max-w-[996px] w-full m-auto">
          <TabsWrapper />
        </div>
      </Main>
    </DefaultLayout>
  );
}
