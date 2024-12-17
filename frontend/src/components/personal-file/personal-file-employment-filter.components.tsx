import { useEmployeeStore } from '@services/employee-service/employee-service';
import { Select, FormLabel } from '@sk-web-gui/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export interface PersonalFileEmploymentFilterModel {
  employmentId: string;
}

export const PersonalFileEmploymentFilter: React.FC = () => {
  const employmentslist = useEmployeeStore((s) => s.employmentslist);
  const selectedEmployment = useEmployeeStore((s) => s.selectedEmployment);
  const setSelectedEmployment = useEmployeeStore((s) => s.setSelectedEmployment);

  const { watch, setValue, getValues, trigger } = useForm<PersonalFileEmploymentFilterModel>({
    defaultValues: {
      employmentId: selectedEmployment.empRowId || employmentslist[0].empRowId,
    },
    mode: 'onChange', // NOTE: Needed if we want to disable submit until valid
  });

  const employmentId = watch('employmentId');
  useEffect(() => {
    setSelectedEmployment(employmentslist.find((x) => x.empRowId === employmentId));
  }, [employmentId]);

  return (
    <div className="flex gap-8 items-center w-full">
      <FormLabel>Visa anställning:</FormLabel>
      <Select
        data-cy="selectemployment"
        value={employmentId}
        onChange={(e) => {
          setValue('employmentId', e.target.value);
          trigger('employmentId');
        }}
      >
        {employmentslist.map((emp, idx) => {
          return (
            <Select.Option value={emp.empRowId} key={`employment-${idx}`}>
              {emp.title}
            </Select.Option>
          );
        })}
      </Select>
    </div>
  );
};
