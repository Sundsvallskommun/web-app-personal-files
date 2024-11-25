import { Button, Modal, FormLabel, FormControl, FileUpload, Select, Input, useSnackbar } from '@sk-web-gui/react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
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
  const uploadDocument = useDocumentStore((s) => s.uploadDocument);
  const getDocuments = useDocumentStore((s) => s.getDocumentList);
  const documentTypes = useDocumentStore((s) => s.documentTypes);
  const user = useUserStore((s) => s.user);
  const selectedEmployment = useEmployeeStore((s) => s.selectedEmployment);
  const employeeUsersEmployments = useEmployeeStore((s) => s.employeeUsersEmployments);

  const toastMessage = useSnackbar();

  const closeHandler = () => {
    reset();
    setIsOpen(false);
  };

  console.log(documentTypes);

  //NOTE: Use on upload button in modal when emp Id is implemented in employee API, also chnage emp data when fetching documents
  const submitHandler = () => {
    const body: CreateDocument = {
      createdBy: user.username,
      confidentiality: {
        confidential: true,
        legalCitation: '25 kap. 1 § OSL',
      },
      archive: false,
      description: 'Dokument anställning',
      metadataList: [
        {
          key: 'employmentId',
          value: '123',
        },
        {
          key: 'partyId',
          value: [employeeUsersEmployments[0].personNumber],
        },
      ],
      type: 'EMPLOYMENT_CERTIFICATE',
    };

    uploadDocument(body)
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
              matchesAny: ['123'],
              matchesAll: [],
            },
            {
              key: 'partyId',
              matchesAny: [employeeUsersEmployments[0].personNumber],
              matchesAll: [],
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
    resolver: yupResolver(formSchema),
    defaultValues: {
      attachment: undefined,
      attachmentCatgory: '',
    },
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
                value={getValues()?.attachment ? getValues()?.attachment[0]?.name : undefined}
                readOnly
                placeholder="Bläddra bland dokument"
              />
            </FormLabel>
          </FormControl>
          <FormControl className="w-full">
            <FormLabel className="text-label-small">Tilldela kategori</FormLabel>
            <Select
              onChange={(e) => setValue('attachmentCatgory', e.target.value, { shouldDirty: true })}
              // value={documentTypes?.find((x) => x.type === getValues().attachmentCatgory)?.displayName}
              value="banan"
              className="w-full"
            >
              <Select.Option>Välj kategori</Select.Option>
              {/* {documentTypes?.map((type, idx) => {
                <Select.Option key={`type-${idx}`} value={type.type}>
                  {type.displayName}
                </Select.Option>;
              })} */}
            </Select>
          </FormControl>
        </Modal.Content>
        <Modal.Footer>
          <Button
            className="w-full"
            disabled={
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
