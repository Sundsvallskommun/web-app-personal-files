import { useEmployeeStore } from '@services/employee-service/employee-service';
import { Select, FormLabel } from '@sk-web-gui/react';

export const PersonalFileEmploymentFilter: React.FC = () => {
  const employmentslist = useEmployeeStore((s) => s.employmentslist);
  const selectedEmployment = useEmployeeStore((s) => s.selectedEmployment);
  const setSelectedEmployment = useEmployeeStore((s) => s.setSelectedEmployment);

  return (
    <div className="flex gap-8 items-center w-full">
      <FormLabel>Visa anställning:</FormLabel>
      <Select
        value={selectedEmployment.title}
        onSelect={(e) => setSelectedEmployment(employmentslist.find((x) => (x.title = e.target.value)))}
      >
        {employmentslist.map((emp, idx) => {
          return (
            <Select.Option value={emp.title} key={`employment-${idx}`}>
              {emp.title}
            </Select.Option>
          );
        })}
      </Select>
    </div>
  );
};
