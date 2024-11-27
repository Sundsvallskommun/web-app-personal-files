import { ServiceResponse } from '@interfaces/services';
import { __DEV__ } from '@sk-web-gui/react';
import { createWithEqualityFn } from 'zustand/traditional';
import { devtools, persist } from 'zustand/middleware';
import { apiService } from '@services/api-service';
import {
  CreateDocument,
  Direction,
  Document,
  MetaData,
  SearchDocument,
  DocumentType,
  PageDocument,
} from '@interfaces/document/document';
import { toBase64 } from '@utils/toBase64';

export const getDocuments: (metaData: MetaData[]) => Promise<PageDocument> = async (metaData: MetaData[]) => {
  const body: SearchDocument = {
    page: 1,
    limit: 15,
    sortDirection: Direction.ASC,
    includeConfidential: true,
    onlyLatestRevision: true,
    metaData: metaData,
  };
  return await apiService
    .post<any>(`/document/search`, body)
    .then((res) => {
      return res.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when fetching employee documents');
      throw e;
    });
};

export const uploadDocument: (document: CreateDocument, documentFiles: File) => Promise<any> = async (
  document: CreateDocument,
  documentFiles: File
) => {
  const fileData = await toBase64(documentFiles);
  const buf = Buffer.from(fileData, 'base64');
  const blob = new Blob([buf], { type: documentFiles.type });

  const formData = new FormData();

  formData.append(`documentFiles`, blob, fileData);
  return await apiService
    .post<any>(
      `/document/upload`,
      { ...document, ...formData },
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      console.error('Something went wrong when uploading document to employee');
      throw e;
    });
};

export const getDocumentTypes: () => Promise<DocumentType[]> = async () => {
  return await apiService
    .get<any>('/document/types')
    .then((res) => {
      return res.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when fetching document types');
      throw e;
    });
};

interface State {
  documentList: PageDocument;
  documentTypes: DocumentType[];
  documentsIsLoading: boolean;
}
interface Actions {
  setDocumentList: (documentList: PageDocument) => void;
  setDocumentTypes: (DocumentTypes: DocumentType[]) => void;
  getDocumentList: (metadata: MetaData[]) => Promise<ServiceResponse<PageDocument>>;
  uploadDocument: (UploadBody: CreateDocument, file: File) => Promise<ServiceResponse<any>>;
  getDocumentTypes: () => Promise<ServiceResponse<DocumentType[]>>;
  reset: () => void;
}

const initialState: State = {
  documentList: {},
  documentTypes: [],
  documentsIsLoading: false,
};

export const useDocumentStore = createWithEqualityFn<
  State & Actions,
  [
    ['zustand/devtools', never],
    [
      'zustand/persist',
      {
        documentList: PageDocument;
        documentTypes: DocumentType[];
      },
    ],
  ]
>(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setDocumentList: (documentList) => set(() => ({ documentList, documentsIsLoading: false })),
        setDocumentTypes: (documentTypes) => set(() => ({ documentTypes })),
        getDocumentList: async (metadata: MetaData[]) => {
          let documents = get().documentList;
          await set(() => ({ documentsIsLoading: true }));
          const res = await getDocuments(metadata);
          if (res) {
            documents = res;
            set(() => ({ documentList: documents, documentsIsLoading: false }));
          }

          return { data: documents };
        },
        uploadDocument: async (body: CreateDocument, file: File) => {
          const res = await uploadDocument(body, file);
          return { data: res };
        },
        getDocumentTypes: async () => {
          let types = get().documentTypes;
          const res = await getDocumentTypes();
          if (res) {
            types = res;
            set(() => ({ documentTypes: types }));
          }
          return { data: types };
        },
        reset: () => {
          set(initialState);
        },
      }),
      {
        name: 'document-storage',
        version: 1,
        partialize: ({ documentList, documentTypes }) => ({
          documentList,
          documentTypes,
        }),
      }
    ),
    { enabled: __DEV__ }
  )
);
