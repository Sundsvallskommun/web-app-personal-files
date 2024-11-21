import { useDocumentStore } from '@services/document-service/document-service';
import { useEmployeeStore } from '@services/employee-service/employee-service';
import { Disclosure, FormLabel, Label, Accordion, Table, Divider, Spinner } from '@sk-web-gui/react';
import { useEffect } from 'react';

export const EmploymentsTab: React.FC = () => {
  const employmentslist = useEmployeeStore((s) => s.employmentslist);
  const selectedEmployment = useEmployeeStore((s) => s.selectedEmployment);
  const getDocumentList = useDocumentStore((s) => s.getDocumentList);
  const documentListIsLoading = useDocumentStore((s) => s.documentsIsLoading);
  const documentList = useDocumentStore((s) => s.documentList);

  useEffect(() => {
    getDocumentList('id');
  }, []);

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
                  : documentList.length === 0 ?
                    <span>Inga dokument finns att visa</span>
                  : <span>Lista</span>}
                </div>
              </Table.Column>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    : <span>Ingen anställning att visa</span>;
};
