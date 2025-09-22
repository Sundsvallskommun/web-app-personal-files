import { MetaData } from '@interfaces/document/document';
import { useDocumentStore } from '@services/document-service/document-service';
import { useEmployeeStore } from '@services/employee-service/employee-service';
import {
  FormLabel,
  Label,
  Table,
  Divider,
  Spinner,
  Icon,
  Button,
  useConfirm,
  useSnackbar,
  PopupMenu,
  DialogContextType,
} from '@sk-web-gui/react';
import { useEffect, useState } from 'react';
import { File, Trash, Eye, Ellipsis } from 'lucide-react';
import dayjs from 'dayjs';
import { useFoundationObjectStore } from '@services/foundation-object/foundation-object-service';
import { hasPermission } from '@utils/has-permission';
import { useUserStore } from '@services/user-service/user-service';

interface documentDataList {
  fileName: string;
  originalName: string;
  registrationNumber: string;
  id: string;
  mimeType: string;
  dateTime: string;
  createdOriginal: Date;
}

export const EmploymentsTab: React.FC = () => {
  const selectedEmployment = useEmployeeStore((s) => s.selectedEmployment);
  const employeeUsersEmployments = useEmployeeStore((s) => s.employeeUsersEmployments);
  const getDocumentList = useDocumentStore((s) => s.getDocumentList);
  const documentListIsLoading = useDocumentStore((s) => s.documentsIsLoading);
  const deleteDocument = useDocumentStore((s) => s.deleteDocument);
  const getDocument = useDocumentStore((s) => s.getDocument);
  const documentList = useDocumentStore((s) => s.documentList);
  const getDocumentTypes = useDocumentStore((s) => s.getDocumentTypes);
  const documentTypes = useDocumentStore((s) => s.documentTypes);
  const getCompanies = useFoundationObjectStore((s) => s.getCompanies);
  const companies = useFoundationObjectStore((s) => s.companies);
  const getFormOfEmmployments = useFoundationObjectStore((s) => s.getFormOfEmployments);
  const formOfEmployments = useFoundationObjectStore((s) => s.formOfEmployments);
  const user = useUserStore((s) => s.user);

  const [documentDataList, setDocumentDataList] = useState<documentDataList[]>([]);

  const { CANDELETEDOCS, CANREADDOCS } = hasPermission(user);

  const toastMessage = useSnackbar();
  const deleteConfirm: DialogContextType = useConfirm();

  useEffect(() => {
    getDocumentTypes();
    getCompanies();
    getFormOfEmmployments();
  }, []);

  useEffect(() => {
    const metadata: MetaData[] = [
      {
        key: 'employmentId',
        matchesAny: [`${selectedEmployment?.empRowId}`],
      },
      {
        key: 'partyId',
        matchesAny: [`${employeeUsersEmployments[0]?.personId}`],
      },
    ];
    getDocumentList(metadata);
  }, [employeeUsersEmployments, selectedEmployment]);

  useEffect(() => {
    const list: documentDataList[] = [];
    if (documentList?.documents) {
      documentList.documents
        .filter((document) => document?.metadataList?.find((x) => x.value === selectedEmployment?.empRowId))
        .forEach((document) => {
          const dateTime = () => {
            const date = dayjs(document.created).date();
            const month = new Date(document.created || '').toLocaleString('default', { month: 'long' });
            const year = dayjs(document.created).year();
            const time = dayjs(document.created).format('HH.mm');
            const dateTime = `${date} ${month} ${year} kl.${time}`;
            return dateTime;
          };

          if (document?.documentData?.length !== 0) {
            document?.documentData?.forEach((data) => {
              list.push({
                fileName: `${data.fileName} ${documentTypes && `(${documentTypes.find((x) => x.type === document.type)?.displayName})`}`,
                originalName: data.fileName || '',
                registrationNumber: document.registrationNumber || '',
                id: data.id || '',
                mimeType: data.mimeType || '',
                dateTime: dateTime(),
                createdOriginal: new Date(document.created || ''),
              });
            });
          }
        });
    }
    setDocumentDataList(list);
  }, [documentList]);

  const downloadDocument = (a: documentDataList, file: string) => {
    const uri = `data:${a.mimeType};base64,${file}`;
    const link = document.createElement('a');
    const filename = a.originalName;
    link.href = uri;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
  };

  const onDeleteDocument = (document: documentDataList) => {
    if (document) {
      deleteConfirm
        .showConfirmation(
          'Är du säker?',
          'Om du tar bort dokumentet försvinner den från anställningen.',
          'Ja',
          'Nej',
          'info',
          'info'
        )
        .then((confirmed) => {
          if (confirmed) {
            deleteDocument(document.registrationNumber, document.id)
              .then(async (res) => {
                if (res) {
                  toastMessage({
                    position: 'bottom',
                    closeable: false,
                    message: 'Dokumentet togs bort',
                    status: 'success',
                  });

                  await getDocumentList([
                    {
                      key: 'employmentId',
                      matchesAny: [selectedEmployment?.empRowId || ''],
                    },
                    {
                      key: 'partyId',
                      matchesAny: [employeeUsersEmployments[0]?.personId || ''],
                    },
                  ]);
                }
              })
              .catch((e) => {
                toastMessage({
                  position: 'bottom',
                  closeable: false,
                  message: 'Dokumentet kunde inte tas bort',
                  status: 'error',
                });
              });
          }
          return confirmed ? () => true : () => {};
        });
    }
  };

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
              <Table.Column className="flex-col flex-wrap">
                <div className="flex justify-start gap-40 py-16 px-16 w-full">
                  <div className="flex flex-col gap-24">
                    <div className="flex flex-col">
                      <FormLabel>Titel</FormLabel>
                      <Label className="w-fit" inverted>
                        {selectedEmployment.title}
                      </Label>
                    </div>
                    <div className="flex flex-col">
                      <FormLabel>Anställningsform</FormLabel>
                      <Label className="w-fit" inverted>
                        {formOfEmployments.length !== 0 ?
                          formOfEmployments.find((x) => x?.foeId === selectedEmployment?.formOfEmploymentId)
                            ?.description
                        : 'Timavlönade'}
                      </Label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-24">
                    <div className="flex flex-col">
                      <FormLabel>Kommun</FormLabel>
                      <p>
                        {companies.length !== 0 ?
                          companies.find((x) => x?.companyId === selectedEmployment?.companyId)?.displayName
                        : 'Saknar information'}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <FormLabel>Förvaltning</FormLabel>
                      <p>{selectedEmployment.topOrgName}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-24">
                    <div className="flex flex-col">
                      <FormLabel>Enhet</FormLabel>
                      <p>{selectedEmployment.orgName}</p>
                    </div>
                  </div>
                </div>
                {CANREADDOCS && (
                  <div className="w-full px-16 pb-16">
                    <div className="flex items-center gap-10 mb-8">
                      <h2>Dokument</h2>
                      <Divider />
                    </div>
                    {documentListIsLoading ?
                      <Spinner size={4} />
                    : documentDataList?.length === 0 ?
                      <span>Inga dokument finns att visa</span>
                    : <div className="flex flex-col gap-8" data-cy="document-list">
                        {documentDataList
                          ?.sort((a, b) => b.createdOriginal?.getTime() - a.createdOriginal?.getTime())
                          .map((document, idx) => {
                            return (
                              <div key={`document-${idx}`} data-cy={`document-${idx}`}>
                                <div className="flex justify-between items-center p-12">
                                  <div className="flex items-center gap-8">
                                    <div className={`self-center bg-vattjom-surface-accent p-12 rounded w-fit`}>
                                      <Icon icon={<File />} size={24} />
                                    </div>
                                    <p>
                                      <strong className="block">{document.fileName}</strong> {document.dateTime}
                                    </p>
                                  </div>
                                  <div className="self-center relative mr-20">
                                    <PopupMenu position={documentDataList.length - 1 === idx ? 'over' : 'under'}>
                                      <PopupMenu.Button size="md" aria-label="Alternativ" inverted>
                                        <Ellipsis />
                                      </PopupMenu.Button>
                                      <PopupMenu.Panel>
                                        <PopupMenu.Items>
                                          <PopupMenu.Group>
                                            <PopupMenu.Item>
                                              <Button
                                                leftIcon={<Icon icon={<Eye />} />}
                                                variant="ghost"
                                                onClick={() => {
                                                  getDocument(document.registrationNumber, document.id).then((res) => {
                                                    if (res) {
                                                      downloadDocument(document, res.data as string);
                                                    }
                                                  });
                                                }}
                                              >
                                                Öppna
                                              </Button>
                                            </PopupMenu.Item>
                                            {CANDELETEDOCS && (
                                              <PopupMenu.Item>
                                                <Button
                                                  variant="ghost"
                                                  leftIcon={<Icon icon={<Trash />} />}
                                                  onClick={() => onDeleteDocument(document)}
                                                >
                                                  Ta bort
                                                </Button>
                                              </PopupMenu.Item>
                                            )}
                                          </PopupMenu.Group>
                                        </PopupMenu.Items>
                                      </PopupMenu.Panel>
                                    </PopupMenu>
                                  </div>
                                </div>
                                {documentDataList[documentDataList.length - 1].id !== document.id ?
                                  <Divider />
                                : <></>}
                              </div>
                            );
                          })}
                      </div>
                    }
                  </div>
                )}
              </Table.Column>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    : <span>Ingen anställning att visa</span>;
};
