import {
  Button,
  Modal,
  FormLabel,
  FormControl,
  FileUpload,
  Select,
  Input,
  useSnackbar,
  FormErrorMessage,
} from '@sk-web-gui/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDocumentStore } from '@services/document-service/document-service';
import { useUserStore } from '@services/user-service/user-service';
import { CreateDocument } from '@interfaces/document/document';
import { useEmployeeStore } from '@services/employee-service/employee-service';

export interface PersonalFileUploadDocumentFormModel {
  attachment: File;
  attachmentCatgory: string;
}

let formSchema = yup.object({
  attachmentCatgory: yup.string().required(),
});

export const PersonalFileUploadDocument: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useUserStore((s) => s.user);
  const uploadDocument = useDocumentStore((s) => s.uploadDocument);
  const getDocuments = useDocumentStore((s) => s.getDocumentList);
  const documentTypes = useDocumentStore((s) => s.documentTypes);
  const selectedEmployment = useEmployeeStore((s) => s.selectedEmployment);
  const employeeUsersEmployments = useEmployeeStore((s) => s.employeeUsersEmployments);

  const [fileError, setFileError] = useState<string>('');

  const toastMessage = useSnackbar();

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
    trigger,
    formState: { errors, isDirty },
  } = useForm<PersonalFileUploadDocumentFormModel>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      attachmentCatgory: 'EMPLOYMENT_CERTIFICATE',
    },
    mode: 'onChange', // NOTE: Needed if we want to disable submit until valid
  });

  const attachment = watch('attachment');

  useEffect(() => {
    if (getValues()?.attachment) {
      const attachmentFile = getValues()?.attachment;
      const attachmentTypeget = attachmentFile?.name.split('.').pop();
      if (attachmentTypeget !== 'pdf') {
        setFileError('Fel filtyp, välj en pdf');
      } else {
        setFileError('');
      }
    }
  });

  return (
    <div>
      <Button data-cy="upload-document" variant="tertiary" onClick={() => setIsOpen(true)}>
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
                value={getValues()?.attachment ? getValues()?.attachment?.name : ''}
                readOnly
                placeholder="Bläddra bland dokument"
              />
            </FormLabel>
          </FormControl>
          <FormControl className="w-full">
            <FormLabel className="text-label-small">Tilldela kategori</FormLabel>
            <Select
              onChange={(e) => {
                setValue('attachmentCatgory', e.target.value, { shouldDirty: true });
                trigger('attachmentCatgory');
              }}
              value={getValues().attachmentCatgory ? getValues().attachmentCatgory : ''}
              className="w-full"
            >
              {documentTypes?.map((type, idx) => {
                return (
                  <Select.Option key={`type-${idx}`} value={type.type}>
                    {type.displayName}
                  </Select.Option>
                );
              })}
            </Select>
          </FormControl>
          {fileError !== '' && <FormErrorMessage className="text-error">{fileError}</FormErrorMessage>}
        </Modal.Content>
        <Modal.Footer>
          <Button
            className="w-full"
            onClick={() => {
              const body: CreateDocument = {
                createdBy: user.username,
                confidentiality: {
                  confidential: false,
                },
                archive: false,
                description: `${documentTypes ? documentTypes.find((t) => t.type === getValues().attachmentCatgory)?.displayName : 'Anställningsbevis'} för timavlönad`,
                metadataList: [
                  {
                    key: 'employmentId',
                    value: `${selectedEmployment.empRowId}`,
                  },
                  {
                    key: 'partyId',
                    value: `${employeeUsersEmployments[0].personId}`,
                  },
                  {
                    key: 'startDate',
                    value: `${selectedEmployment.startDate}`,
                  },
                  {
                    key: 'endDate',
                    value: `${selectedEmployment.endDate}`,
                  },
                ],
                type: getValues().attachmentCatgory,
              };

              return uploadDocument(body, getValues().attachment)
                .then(async (res) => {
                  if (res.data) {
                    toastMessage({
                      position: 'bottom',
                      closeable: false,
                      message: 'Dokumentet laddades upp',
                      status: 'success',
                    });

                    await getDocuments([
                      {
                        key: 'employmentId',
                        matchesAny: [selectedEmployment.empRowId ?? ''],
                      },
                      {
                        key: 'partyId',
                        matchesAny: [employeeUsersEmployments[0].personId ?? ''],
                      },
                    ]);
                    closeHandler();
                    reset();
                  }
                })
                .catch((e) => {
                  toastMessage({
                    position: 'bottom',
                    closeable: false,
                    message: 'Dokumentet gick inte att ladda upp',
                    status: 'error',
                  });
                });
            }}
            disabled={
              fileError.length !== 0 ||
              (!formState.dirtyFields.attachment && !formState.dirtyFields.attachmentCatgory) ||
              getValues().attachment === undefined ||
              getValues().attachmentCatgory === undefined ||
              !getValues().attachmentCatgory.length
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
