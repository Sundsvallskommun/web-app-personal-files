import { useUserStore } from '@services/user-service/user-service';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { SearchField, FormLabel, Spinner, Table, Button, Icon } from '@sk-web-gui/react';
import { useEmployeeStore } from '@services/employee-service/employee-service';
import { CornerDownRight } from 'lucide-react';

export const SearchPersonalFiles = () => {
  const [query, setQuery] = useState<string>('');
  const [isSearch, setIsSearch] = useState(false);
  const user = useUserStore((s) => s.user);
  const getADUserEmployments = useEmployeeStore((s) => s.getADUserEmployments);
  const employeeEmployments = useEmployeeStore((s) => s.employee);
  const { t } = useTranslation();
  console.log('user', query);

  const searchResultOfAD = () => {
    const personalNumber = query.replace('-', '');
    getADUserEmployments(personalNumber).then(() => {
      setIsSearch(true);
    });
  };

  useEffect(() => {
    if (employeeEmployments.length && query.length < 13) {
      setIsSearch(false);
    }
  }, [employeeEmployments, query]);

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
      </div>
      {isSearch && !employeeEmployments.length ?
        <Spinner size={6} />
      : isSearch ?
        <Table className="max-w-[590px] w-full" background={true}>
          <Table.Header>
            <Table.HeaderColumn colSpan={3}>
              <span className="font-bold">
                {employeeEmployments[0].givenname} {employeeEmployments[0].lastname} -
              </span>
              <span className="font-normal"> {employeeEmployments[0].personNumber}</span>
            </Table.HeaderColumn>
          </Table.Header>
          <Table.Body>
            {employeeEmployments.map((employeeUsers) =>
              employeeUsers.employments.map((employment, idx) => {
                return (
                  <Table.Row key={`emprow-${idx}`}>
                    <Table.Column>
                      <Icon icon={<CornerDownRight />} />
                      <Button variant="link">{employment.title}</Button>
                    </Table.Column>
                    <Table.Column>{employment.orgName}</Table.Column>
                    <Table.Column>{employment.formOfEmploymentId}</Table.Column>
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table>
      : <p>I denna version kan du enbart söka personakter för timavlönade.</p>}
    </>
  );
};
