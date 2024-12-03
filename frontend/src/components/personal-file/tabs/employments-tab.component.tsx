import { MetaData } from '@interfaces/document/document';
import { useDocumentStore } from '@services/document-service/document-service';
import { useEmployeeStore } from '@services/employee-service/employee-service';
import { FormLabel, Label, Table, Divider, Spinner, Icon, Button } from '@sk-web-gui/react';
import { useEffect } from 'react';
import { File, Trash } from 'lucide-react';
import dayjs from 'dayjs';

export const EmploymentsTab: React.FC = () => {
  const selectedEmployment = useEmployeeStore((s) => s.selectedEmployment);
  const employeeUsersEmployments = useEmployeeStore((s) => s.employeeUsersEmployments);
  const getDocumentList = useDocumentStore((s) => s.getDocumentList);
  const documentListIsLoading = useDocumentStore((s) => s.documentsIsLoading);
  const documentList = useDocumentStore((s) => s.documentList);
  const getDocumentTypes = useDocumentStore((s) => s.getDocumentTypes);

  useEffect(() => {
    getDocumentTypes();
  }, []);

  //NOTE: activate when employmentId is implemented in API Employee
  useEffect(() => {
    const metadata: MetaData[] = [
      {
        key: 'employmentId',
        matchesAny: [`${selectedEmployment.empRowId}`],
      },
      {
        key: 'partyId',
        matchesAny: [`${employeeUsersEmployments[0].personId}`],
      },
    ];
    getDocumentList(metadata);
  }, [employeeUsersEmployments, selectedEmployment]);

  return selectedEmployment ?
      <div>
        <Table background>
          <Table.Header>
            <Table.HeaderColumn>
              <span className="text-base">{selectedEmployment.title}</span>
            </Table.HeaderColumn>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Column className="flex-col">
                <div className="flex justify-start gap-40 py-16 px-16 w-full">
                  <div className="flex flex-col gap-24">
                    <div className="flex flex-col">
                      <FormLabel>Titel</FormLabel>
                      <Label className="w-fit" inverted>
                        {selectedEmployment.title}
                      </Label>
                    </div>
                    <div className="flex flex-col">
                      <FormLabel>Avdelning</FormLabel>
                      <Label className="w-fit" inverted>
                        {selectedEmployment.orgName}
                      </Label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-24">
                    <div className="flex flex-col">
                      <FormLabel>Verksamhet</FormLabel>
                      <Label className="w-fit" inverted>
                        {selectedEmployment.topOrgName}
                      </Label>
                    </div>
                    <div className="flex flex-col">
                      <FormLabel>Legal enhet</FormLabel>
                      <Label className="w-fit" inverted>
                        {selectedEmployment.companyId}
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="w-full px-16 pb-16">
                  <div className="flex items-center gap-10 mb-8">
                    <h2>Dokument</h2>
                    <Divider />
                  </div>
                  {documentListIsLoading ?
                    <Spinner size={4} />
                  : (
                    documentList?.documents?.length === 0 ||
                    !documentList?.documents?.filter((doc) =>
                      doc.metadataList.find((x) => x.value === selectedEmployment.empRowId)
                    )
                  ) ?
                    <span>Inga dokument finns att visa</span>
                  : <div className="flex flex-col gap-8">
                      {documentList?.documents?.map((document, idx) => {
                        const dateTime = () => {
                          const date = dayjs(document.created).date();
                          const month = new Date(document.created).toLocaleString('default', { month: 'long' });
                          const year = dayjs(document.created).year();
                          const time = dayjs(document.created).format('HH.mm');
                          const dateTime = `${date} ${month} ${year} kl.${time}`;
                          return dateTime;
                        };
                        return (
                          <div key={`document-${idx}`}>
                            <div className="flex justify-between items-center p-12">
                              <div className="flex items-center gap-8">
                                <div className={`self-center bg-vattjom-surface-accent p-12 rounded w-fit`}>
                                  <Icon icon={<File />} size={24} />
                                </div>
                                <p>
                                  <strong className="block">{document.documentData[0].fileName}</strong> {dateTime()}
                                </p>
                              </div>
                              <Button variant="ghost">
                                <Icon icon={<Trash />} />
                              </Button>
                            </div>
                            {documentList.documents[documentList.documents.length - 1].id !== document.id ?
                              <Divider />
                            : <></>}
                          </div>
                        );
                      })}
                    </div>
                  }
                </div>
              </Table.Column>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    : <span>Ingen anställning att visa</span>;
};
