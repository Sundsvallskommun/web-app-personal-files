import { useUserStore } from '@services/user-service/user-service';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { SearchField, FormLabel, Spinner, Table, Button, FormErrorMessage, useSnackbar } from '@sk-web-gui/react';
import { useEmployeeStore } from '@services/employee-service/employee-service';
import { useRouter } from 'next/navigation';
import { Employment } from '@interfaces/employee/employee';
import { set } from 'react-hook-form';

export const SearchPersonalFiles: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [isSearch, setIsSearch] = useState(false);
  const [message, setMessage] = useState('');
  const user = useUserStore((s) => s.user);
  const setEmploymentslist = useEmployeeStore((s) => s.setEmployments);
  const employmentslist = useEmployeeStore((s) => s.employmentslist);
  const getADUserEmployments = useEmployeeStore((s) => s.getADUserEmployments);
  const employeeUsersEmployments = useEmployeeStore((s) => s.employeeUsersEmployments);
  const setSelectedEmployment = useEmployeeStore((s) => s.setSelectedEmployment);
  const setEmployeeUserEmployments = useEmployeeStore((s) => s.setEmployeeUserEmployments);
  const empIsLoading = useEmployeeStore((s) => s.empIsLoading);
  const setEmpIsLoading = useEmployeeStore((s) => s.setEmpIsLoading);
  const { t } = useTranslation();
  const router = useRouter();
  const toastMessage = useSnackbar();

  const searchResultOfAD = () => {
    const personalNumber = query.replace('-', '');
    getADUserEmployments(personalNumber)
      .then((res) => {
        setIsSearch(true);
        const employments: Employment[] = [];
        if (res.data) {
          res.data.map(
            (users) =>
              users.employments &&
              users.employments.map((emp) => {
                if (emp?.isManual === false && emp?.benefitGroupId === 44) {
                  employments.push(emp);
                }
              })
          );
        }

        if (employments.length === 0) {
          setIsSearch(false);
          setEmployeeUserEmployments([]);
          toastMessage({
            position: 'bottom',
            closeable: false,
            message: 'Det gick inte att hitta någon timavlönad personakt under det här personnumret',
            status: 'error',
          });
        }

        setEmploymentslist(employments);
      })
      .catch((e) => {
        toastMessage({
          position: 'bottom',
          closeable: false,
          message: 'Det gick inte att hitta någon personakt under det här personnumret',
          status: 'error',
        });
      });
  };

  useEffect(() => {
    if (employeeUsersEmployments.length !== 0 && query.length < 12) {
      setIsSearch(false);
    }
  }, [employeeUsersEmployments, query]);

  useEffect(() => {
    if (query.length > 0) {
      if (
        query.includes('/[a-zA-Z]/') ||
        query.length < 12 ||
        query.length > 13 ||
        (query.length === 13 && query[8] !== '-')
      ) {
        setMessage('Personnumret måste innehålla siffror och efterlikna följande struktur: ååååmmddnnnn');
      } else {
        setMessage('');
      }
    } else {
      setMessage('');
    }
  }, [query]);

  return (
    <>
      <div className="max-w-[590px] w-full pt-16 px-24 pb-24 shadow-100 rounded-button">
        <FormLabel>
          <span className="font-bold">Skriv fullständigt personnummer</span>
          <span className="text-gray-500 font-normal"> (ååååmmddnnnn)</span>
        </FormLabel>
        <SearchField
          data-cy="searchfield-personalfiles"
          value={query}
          className="mt-8"
          placeholder="Skriv personnummer"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          showSearchButton={(query.length === 13 && query[8] === '-') || query.length === 12}
          onSearch={() => {
            if ((query.length === 13 && query[8] === '-') || query.length === 12) {
              searchResultOfAD();
            }
          }}
          onReset={() => {
            setIsSearch(false);
            setQuery('');
          }}
        />
        {message.length ?
          <FormErrorMessage className="mt-8" data-cy="not-found-error-message">
            {message}
          </FormErrorMessage>
        : <></>}
      </div>
      {empIsLoading ?
        <Spinner size={5} />
      : isSearch && employmentslist.length !== 0 ?
        <Table data-cy="personalfile-result-table" className="max-w-[590px] w-full" background={true}>
          <Table.Header>
            <Table.HeaderColumn>Namn</Table.HeaderColumn>
            <Table.HeaderColumn>Personnummer</Table.HeaderColumn>
            <Table.HeaderColumn>Anställningar</Table.HeaderColumn>
            <Table.HeaderColumn className="hidden">Knapp Öppna personakt</Table.HeaderColumn>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Column data-cy={`pf-name`}>
                <span className="font-bold">
                  {employeeUsersEmployments[0].givenname} {employeeUsersEmployments[0].lastname}
                </span>
              </Table.Column>
              <Table.Column data-cy={`pf-personnumber`}>{employeeUsersEmployments[0].personNumber}</Table.Column>
              <Table.Column data-cy={`pf-numberofemployments`}>{employmentslist.length} st</Table.Column>
              <Table.Column data-cy={`pf-openbutton`}>
                <Button
                  variant="tertiary"
                  onClick={() => {
                    setEmpIsLoading(true);
                    setSelectedEmployment(
                      employmentslist.sort((a, b) => Number(b.isMainEmployment) - Number(a.isMainEmployment))[0]
                    );
                    router.push(`sok-personakt/${employeeUsersEmployments[0].personId}`);
                  }}
                >
                  Öppna personakt
                </Button>
              </Table.Column>
            </Table.Row>
          </Table.Body>
        </Table>
      : <p>I denna version kan du enbart söka personakter för timavlönade.</p>}
    </>
  );
};
