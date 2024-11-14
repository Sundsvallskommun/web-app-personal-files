import { Button, Modal, FormLabel, FormControl, FileUpload, Select, Input } from '@sk-web-gui/react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

export interface PersonalFileUploadDocumentFormModel {
  id?: string;
  attachment: File;
  attachmentCatgory: string;
}

export const PersonalFileUploadDocument: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeHandler = () => {
    reset();
    setIsOpen(false);
  };

  const {
    register,
    control,
    watch,
    reset,
    setValue,
    getValues,
    formState,
    formState: { errors, isDirty },
  } = useForm<PersonalFileUploadDocumentFormModel>({
    // resolver: yupResolver(formSchema),
    mode: 'onChange', // NOTE: Needed if we want to disable submit until valid
  });

  const attachment = watch('attachment');

  return (
    <div>
      <Button variant="tertiary" onClick={() => setIsOpen(true)}>
        Ladda upp
      </Button>

      <Modal className="max-w-[320px] w-full" show={isOpen} onClose={closeHandler}>
        <h2 className="text-base">Ladda upp dokument</h2>
        <Modal.Content className="flex flex-col gap-20">
          <FormControl className="w-full">
            <FormLabel className="">
              <div role="input" className="flex justify-between w-full">
                <span className="text-label-small">Vald fil</span>{' '}
                <span className="sk-link text-vattjom-text-primary font-normal hover:cursor-pointer">Bläddra</span>
              </div>
              <Input
                className="hidden"
                type="file"
                placeholder="Välja fil att lägga till"
                {...register('attachment')}
                //allowReplace={false}
              />
              <Input
                className="w-full"
                value={getValues()?.attachment ? getValues()?.attachment[0].name : ''}
                readOnly
                placeholder="Bläddra bland dokument"
              />
            </FormLabel>
          </FormControl>
          <FormControl className="w-full">
            <FormLabel className="text-label-small">Tilldela kategori</FormLabel>
            <Select
              onChange={(e) => setValue('attachmentCatgory', e.target.value, { shouldDirty: true })}
              value={getValues()?.attachmentCatgory}
              className="w-full"
            >
              <Select.Option>Välj kategori</Select.Option>
              <Select.Option value={'Banan'}>Banan</Select.Option>
            </Select>
          </FormControl>
        </Modal.Content>
        <Modal.Footer>
          <Button
            className="w-full"
            disabled={
              (!formState.dirtyFields.attachment && !formState.dirtyFields.attachmentCatgory) ||
              getValues().attachmentCatgory === undefined
            }
          >
            {' '}
            Ladda upp{' '}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
