import { ServiceResponse } from '@interfaces/services';
import { __DEV__ } from '@sk-web-gui/react';
import { createWithEqualityFn } from 'zustand/traditional';
import { devtools, persist } from 'zustand/middleware';

interface State {
  documentList: [];
  documentsIsLoading: boolean;
}
interface Actions {
  setDocumentList: (documentList: []) => void;
  getDocumentList: (empId: string) => Promise<ServiceResponse<[]>>;
  reset: () => void;
}

const initialState: State = {
  documentList: [],
  documentsIsLoading: false,
};

export const useDocumentStore = createWithEqualityFn<
  State & Actions,
  [
    ['zustand/devtools', never],
    [
      'zustand/persist',
      {
        documentList: [];
      },
    ],
  ]
>(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setDocumentList: (documentList) => set(() => ({ documentList })),
        getDocumentList: async (empId: string) => {
          let documents = get().documentList;
          await set(() => ({ documentsIsLoading: true }));
          const res = 1;
          if (res === 1) {
            await set(() => ({ documentList: [], documentsIsLoading: false }));
          }

          return { data: documents };
        },
        reset: () => {
          set(initialState);
        },
      }),
      {
        name: 'document-storage',
        version: 1,
        partialize: ({ documentList }) => ({
          documentList,
        }),
      }
    ),
    { enabled: __DEV__ }
  )
);
