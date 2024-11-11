import { useEmployeeStore } from '@services/employee-service/employee-service';
import { Disclosure, FormLabel, Label } from '@sk-web-gui/react';

export const EmploymentsTab: React.FC = () => {
  const employmentslist = useEmployeeStore((s) => s.employmentslist);
  const selectedEmployment = useEmployeeStore((s) => s.selectedEmployment);

  return selectedEmployment ?
      <div>
        <Disclosure
          header={`${selectedEmployment.title}, Platsnamn`}
          className=""
          initalOpen={employmentslist[0] === selectedEmployment}
        >
          <div className="flex justify-between">
            <div className="flex flex-col gap-24">
              <div className="flex flex-col">
                <FormLabel>Titel</FormLabel>
                <Label inverted>{selectedEmployment.title}</Label>
              </div>
              <div className="flex flex-col">
                <FormLabel>Team</FormLabel>
                <Label inverted>{selectedEmployment.paTeam || 'Ej ifyllt'}</Label>
              </div>
            </div>
            <div className="flex flex-col gap-24">
              <div className="flex flex-col">
                <FormLabel>Verksamhet</FormLabel>
                <Label inverted>{selectedEmployment.topOrgName}</Label>
              </div>
              <div className="flex flex-col">
                <FormLabel>Avdelning</FormLabel>
                <Label inverted>{selectedEmployment.orgName}</Label>
              </div>
            </div>
            <div className="flex flex-col gap-24">
              <div className="flex flex-col">
                <FormLabel>Plats</FormLabel>
                <Label inverted>Platsnamn</Label>
              </div>
              <div className="flex flex-col">
                <FormLabel>Legal enhet</FormLabel>
                <Label inverted>{selectedEmployment.companyId}</Label>
              </div>
            </div>
          </div>
        </Disclosure>
      </div>
    : <span>Ingen anställning att visa</span>;
};
