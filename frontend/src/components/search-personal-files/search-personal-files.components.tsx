import { useUserStore } from '@services/user-service/user-service';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import {
  SearchField,
  FormLabel,
  Spinner,
  Table,
  Button,
  Icon,
  FormErrorMessage,
  Link,
  useSnackbar,
} from '@sk-web-gui/react';
import { useEmployeeStore } from '@services/employee-service/employee-service';
import { CornerDownRight } from 'lucide-react';
import { useRouter } from 'next/router';

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
  const { t } = useTranslation();
  const router = useRouter();
  const toastMessage = useSnackbar();

  const searchResultOfAD = () => {
    const personalNumber = query.replace('-', '');
    getADUserEmployments(personalNumber)
      .then(() => {
        setIsSearch(true);
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
    if (employeeUsersEmployments.length && query.length < 13) {
      setIsSearch(false);
    }
  }, [employeeUsersEmployments, query]);

  useEffect(() => {
    if (query.length > 0) {
      if (query.includes('/[a-zA-Z]/') || query.length < 13 || query[8] !== '-') {
        setMessage('Personnumret måste innehålla siffror och efterlikna följande struktur: YYYYMMDD-XXXX');
      } else {
        setMessage('');
      }
    } else {
      setMessage('');
    }
  }, [query]);

  useEffect(() => {
    const employments = [];

    employeeUsersEmployments.map((users) =>
      users.employments.map((emp) => {
        employments.push(emp);
      })
    );

    setEmploymentslist(employments);
  }, [employeeUsersEmployments]);

  return (
    <>
      <div className="max-w-[590px] w-full pt-16 px-24 pb-24 shadow-100 rounded-button">
        <FormLabel>
          <span className="font-bold">Skriv fullständigt personnummer</span>
          <span className="text-gray-500 font-normal"> (ååååmmdd-nnnn)</span>
        </FormLabel>
        <SearchField
          value={query}
          className="mt-8"
          placeholder="Skriv personnummer"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          showSearchButton={query.length === 13 && query[8] === '-'}
          onSearch={searchResultOfAD}
          onReset={() => {
            setIsSearch(false);
            setQuery('');
          }}
        />
        {message.length ?
          <FormErrorMessage className="text-error mt-8" data-cy="not-found-error-message">
            {message}
          </FormErrorMessage>
        : <></>}
      </div>
      {isSearch && !employeeUsersEmployments.length ?
        <Spinner size={6} />
      : isSearch ?
        <Table className="max-w-[590px] w-full" background={true}>
          <Table.Header>
            <Table.HeaderColumn>Namn</Table.HeaderColumn>
            <Table.HeaderColumn>Personnummer</Table.HeaderColumn>
            <Table.HeaderColumn>Anställningar</Table.HeaderColumn>
            <Table.HeaderColumn className="hidden">Knapp Öppna personakt</Table.HeaderColumn>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Column>
                <span className="font-bold">
                  {employeeUsersEmployments[0].givenname} {employeeUsersEmployments[0].lastname}
                </span>
              </Table.Column>
              <Table.Column>{employeeUsersEmployments[0].personNumber}</Table.Column>
              <Table.Column>{employmentslist.length} st</Table.Column>
              <Table.Column>
                <Button
                  variant="tertiary"
                  onClick={() => {
                    setSelectedEmployment(employmentslist[0]);
                    router.push(`sok-personakt/personakt/${employeeUsersEmployments[0].personId}`);
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
