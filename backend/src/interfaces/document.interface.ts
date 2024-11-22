export interface Document {
  documents?: [
    {
      id?: string;
      /** @format int32 */
      municipalityId?: number;
      registrationNumber?: string;
      /** @format int32 */
      revision?: number;
      confidentiality?: {
        confidential?: boolean;
        legalCitation?: string;
      };
      description?: string;
      created?: string;
      createdBy?: string;
      archive?: boolean;
      metadataList?: MetadataList[];
      documentData?: DocumentData[];
      type?: string;
    },
  ];
  _meta?: {
    /** @format int32 */
    page?: number;
    /** @format int32 */
    limit?: number;
    /** @format int32 */
    count?: number;
    /** @format int32 */
    totalRecords?: number;
    /** @format int32 */
    totalPages?: number;
  };
}

export interface MetadataList {
  key: string;
  value: any;
}

export interface DocumentData {
  id?: string;
  fileName?: string;
  mimeType?: string;
  /** @format int32 */
  fileSizeInBytes?: number;
}

export class CreateDocument {
  createdBy: string;
  confidentiality: {
    confidential: boolean;
    legalCitation: string;
  };
  archive: boolean;
  description: string;
  metadataList: MetadataList[];
  type: string;
}

export class SearchDocument {
  page: number;
  limit: number;
  sortBy: string[];
  sortDirection: string;
  includeConfidential: boolean;
  onlyLatestRevision: boolean;
  documentTypes: string[];
  metaData: [
    {
      key: string;
      matchesAny: string[];
      matchesAll: string[];
    },
  ];
}
