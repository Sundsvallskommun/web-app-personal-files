import { Employee, Employment, LoginName, PortalPersonData } from '@interfaces/employee/employee';
import { ApiResponse, apiService } from '@services/api-service';
import { emptyEmployee } from './defaults';
import { createWithEqualityFn } from 'zustand/traditional';
import { devtools, persist } from 'zustand/middleware';
import { ServiceResponse } from '@interfaces/services';
import { __DEV__ } from '@sk-web-gui/react';

const luhnCheck = (str = ''): boolean => {
  str = str?.replace('-', '');
  if (!str) {
    return false;
  }
  str = str.length === 12 ? str.slice(2) : str;
  let sum = 0;
  for (let i = 0, l = str.length; i < l; i++) {
    let v = parseInt(str[i]);
    v *= 2 - (i % 2);
    if (v > 9) {
      v -= 9;
    }
    sum += v;
  }
  return sum % 10 === 0;
};

export const isValidPersonalNumber: (ssn: string) => boolean = (ssn) =>
  luhnCheck(ssn) && ((ssn.length === 12 && parseInt(ssn[4]) < 2) || (ssn.length === 10 && parseInt(ssn[2]) < 2));

export const setAdministrationCode: (orgTree: string) => string | {} = (orgTree) => {
  return {
    administrationCodes: orgTree.split('¤')[0].split('|')[1].toString(),
  };
};

export const searchHitADUser: (personId: string) => Promise<any> = async (personId: string) => {
  return await apiService
    .get<any>(`/portalpersondata/${personId}/employeeEmployments`)
    .then((res) => {
      return res.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when fetching AD user på id');
      throw e;
    });
};

export const searchADUserByUsername: (username: string) => Promise<any> = async (username: string) => {
  return await apiService
    .get<any>(`/portalpersondata/personal/${username}`)
    .then((res) => {
      return res.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when fetching AD user på username');
      throw e;
    });
};
export async function searchADUserByPersonNumber(personalNumber: string) {
  personalNumber = personalNumber.replace(/\D/g, '');
  return !isValidPersonalNumber(personalNumber) ?
      Promise.resolve([])
    : await apiService
        .get<ApiResponse<LoginName[]>>(`portalpersondata/${personalNumber}/loginname`)
        .then((res) => {
          return res.data.data;
        })
        .then((res) => {
          return searchADUserByUsername(res[0].loginName);
        });
}

interface State {
  employee: Employee[];
  employmentslist: Employment[];
}
interface Actions {
  setEmployee: (employee: Employee[]) => void;
  setEmployments: (employmentslist: Employment[]) => void;
  getADUserEmployments: (personalNumber: string) => Promise<ServiceResponse<Employee[]>>;
  getEmploymentsById: (personId: string) => Promise<ServiceResponse<Employee[]>>;
  reset: () => void;
}

const initialState: State = {
  employee: [],
  employmentslist: [],
};

export const useEmployeeStore = createWithEqualityFn<
  State & Actions,
  [
    ['zustand/devtools', never],
    [
      'zustand/persist',
      {
        employee: Employee[];
        employmentslist: Employment[];
      },
    ],
  ]
>(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setEmployee: (employee) => set(() => ({ employee })),
        setEmployments: (employmentslist) => set(() => ({ employmentslist })),
        getADUserEmployments: async (personalNumber: string) => {
          let employee = get().employee;
          const userInfo = await searchADUserByPersonNumber(personalNumber);
          const res = await searchHitADUser(userInfo.personid);

          if (res) {
            employee = res;
            set(() => ({ employee: employee }));
          }
          return { data: employee };
        },
        getEmploymentsById: async (personId: string) => {
          let employee = get().employee;
          const res = await searchHitADUser(personId);
          if (res) {
            employee = res;

            set(() => ({ employee: employee }));
          }
          return { data: employee };
        },
        reset: () => {
          set(initialState);
        },
      }),
      {
        name: 'employee-storage',
        version: 1,
        partialize: ({ employee, employmentslist }) => ({
          employee,
          employmentslist,
        }),
      }
    ),
    { enabled: __DEV__ }
  )
);
