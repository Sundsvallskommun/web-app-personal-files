import { useEmployeeStore } from '@services/employee-service/employee-service';
import { Disclosure, FormLabel, Label, Accordion, Table } from '@sk-web-gui/react';

export const EmploymentsTab: React.FC = () => {
  const employmentslist = useEmployeeStore((s) => s.employmentslist);
  const selectedEmployment = useEmployeeStore((s) => s.selectedEmployment);

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
              <Table.Column>
                <div className="flex justify-start gap-40 py-16 px-16">
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
              </Table.Column>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    : <span>Ingen anställning att visa</span>;
};
