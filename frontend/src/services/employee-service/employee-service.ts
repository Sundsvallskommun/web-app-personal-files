import { Employee, LoginName } from '@interfaces/employee/employee';
import { ApiResponse, apiService } from '@services/api-service';

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

export const searchADUser: (username: string, domain?: string) => Promise<Employee> = async (
  username: string,
  domain?: string
) => {
  if (!domain) {
    domain = 'PERSONAL';
  }

  return await apiService
    .get<any>(`/portalpersondata/personal/${username}`)
    .then((res) => {
      return {
        personId: res.data.data.personid,
        firstName: res.data.data.givenname,
        lastName: res.data.data.lastname,
        email: res.data.data.email,
        phone: res.data.data.mobilePhone,
        workPhone: res.data.data.workPhone,
        organizationName: '',
        street: res.data.data.street,
        city: res.data.data.city,
        zip: res.data.data.postalCode,
        careof: res.data.data.careof,
        loginName: res.data.data.loginName,
        company: res.data.data.company,
        orgTree: res.data.data.orgTree,
        metadata: setAdministrationCode(res.data.data.orgTree),
      } as Employee;
    })
    .catch((e) => {
      console.error('Something went wrong when fetching AD-user');
      throw e;
    });
};
export async function searchADUserByPersonNumber(personalNumber: string) {
  personalNumber = personalNumber.replace(/\D/g, '');
  return !isValidPersonalNumber(personalNumber) ?
      Promise.resolve([])
    : await apiService
        .get<ApiResponse<LoginName[]>>(`portalpersondata/${personalNumber}/loginname`)
        .then((res) => res.data.data)
        .then(async (res) => {
          if (res.length > 1) {
            const promises = res.map((user) => searchADUser(user.loginName, user.domain));
            const results = await Promise.all(promises);
            return results;
          } else {
            return searchADUser(res[0].loginName, res[0].domain);
          }
        });
}
