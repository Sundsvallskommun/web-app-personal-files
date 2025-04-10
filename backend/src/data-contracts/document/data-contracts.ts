/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Problem {
  title?: string;
  detail?: string;
  /** @format uri */
  instance?: string;
  /** @format uri */
  type?: string;
  parameters?: Record<string, object>;
  status?: StatusType;
}

export interface StatusType {
  /** @format int32 */
  statusCode?: number;
  reasonPhrase?: string;
}

/** Document */
export interface DocumentDataCreateRequest {
  /**
   * Actor that created this revision
   * @example "username123"
   */
  createdBy: string;
}

export interface ConstraintViolationProblem {
  cause?: ThrowableProblem;
  stackTrace?: {
    classLoaderName?: string;
    moduleName?: string;
    moduleVersion?: string;
    methodName?: string;
    fileName?: string;
    /** @format int32 */
    lineNumber?: number;
    className?: string;
    nativeMethod?: boolean;
  }[];
  /** @format uri */
  type?: string;
  status?: StatusType;
  violations?: Violation[];
  title?: string;
  message?: string;
  detail?: string;
  /** @format uri */
  instance?: string;
  parameters?: Record<string, object>;
  suppressed?: {
    stackTrace?: {
      classLoaderName?: string;
      moduleName?: string;
      moduleVersion?: string;
      methodName?: string;
      fileName?: string;
      /** @format int32 */
      lineNumber?: number;
      className?: string;
      nativeMethod?: boolean;
    }[];
    message?: string;
    localizedMessage?: string;
  }[];
  localizedMessage?: string;
}

export interface ThrowableProblem {
  cause?: ThrowableProblem;
  stackTrace?: {
    classLoaderName?: string;
    moduleName?: string;
    moduleVersion?: string;
    methodName?: string;
    fileName?: string;
    /** @format int32 */
    lineNumber?: number;
    className?: string;
    nativeMethod?: boolean;
  }[];
  message?: string;
  title?: string;
  detail?: string;
  /** @format uri */
  instance?: string;
  /** @format uri */
  type?: string;
  parameters?: Record<string, object>;
  status?: StatusType;
  suppressed?: {
    stackTrace?: {
      classLoaderName?: string;
      moduleName?: string;
      moduleVersion?: string;
      methodName?: string;
      fileName?: string;
      /** @format int32 */
      lineNumber?: number;
      className?: string;
      nativeMethod?: boolean;
    }[];
    message?: string;
    localizedMessage?: string;
  }[];
  localizedMessage?: string;
}

export interface Violation {
  field?: string;
  message?: string;
}

/** Confidentiality model. */
export interface Confidentiality {
  /**
   * A flag that can be set to alert administrative users handling the information that there are some special privacy policies to follow for the person in question.
   * If there are special privacy policies to follow for this record, this flag should be set to 'true', otherwise 'false'.
   * @example true
   */
  confidential?: boolean;
  /**
   * Legal citation
   * @example "25 kap. 1 § OSL"
   */
  legalCitation?: string;
}

/** Document */
export interface DocumentCreateRequest {
  /**
   * Actor that created this revision (all modifications will create new revisions)
   * @example "username123"
   */
  createdBy: string;
  /** Confidentiality model. */
  confidentiality?: Confidentiality;
  /**
   * Tells if the document is eligible for archiving
   * @example false
   */
  archive?: boolean;
  /**
   * Document description
   * @minLength 0
   * @maxLength 8192
   * @example "A brief description of this object. Maximum 8192 characters."
   */
  description: string;
  /** List of DocumentMetadata objects. */
  metadataList: DocumentMetadata[];
  /**
   * The type of document (validated against a defined list of document types).
   * @example "EMPLOYMENT_CERTIFICATE"
   */
  type: string;
}

/** DocumentMetadata model */
export interface DocumentMetadata {
  /**
   * Metadata key
   * @example "Some key"
   */
  key: string;
  /**
   * Metadata value
   * @example "Some value"
   */
  value: string;
}

/**
 * The sort order direction
 * @example "ASC"
 */
export enum Direction {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface DocumentParameters {
  /**
   * Page number
   * @format int32
   * @min 1
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Result size per page. Maximum allowed value is dynamically configured
   * @format int32
   * @min 1
   * @example 15
   */
  limit?: number;
  sortBy?: string[];
  /** The sort order direction */
  sortDirection?: Direction;
  /**
   * Municipality identifier
   * @example "1234"
   */
  municipalityId?: string;
  /**
   * Should the search include confidential documents?
   * @default false
   * @example true
   */
  includeConfidential?: boolean;
  /**
   * Should the search include only the latest revision of the documents?
   * @default false
   * @example true
   */
  onlyLatestRevision?: boolean;
  /** List of document types */
  documentTypes?: string[];
  metaData?: MetaData[];
}

/** List of metadata */
export interface MetaData {
  /**
   * Metadata key
   * @example "Some key"
   */
  key?: string;
  matchesAny?: string[];
  matchesAll?: string[];
}

/** Document model. */
export interface Document {
  /**
   * ID of the document.
   * @example "0d64c132-3aea-11ec-8d3d-0242ac130003"
   */
  id?: string;
  /**
   * Municipality ID
   * @example "2281"
   */
  municipalityId?: string;
  /**
   * Registration number on the format [YYYY-nnnn-nnnn].
   * @example "2023-2281-1337"
   */
  registrationNumber?: string;
  /**
   * Document revision.
   * @format int32
   * @example 2
   */
  revision?: number;
  /** Confidentiality model. */
  confidentiality?: Confidentiality;
  /**
   * Document description
   * @example "A brief description of this object."
   */
  description?: string;
  /**
   * Timestamp when document revision was created.
   * @format date-time
   * @example "2023-08-31T01:30:00+02:00"
   */
  created?: string;
  /**
   * Actor that created this revision.
   * @example "username123"
   */
  createdBy?: string;
  /**
   * Tells if the document is eligible for archiving
   * @example false
   */
  archive?: boolean;
  /** List of DocumentMetadata objects. */
  metadataList?: DocumentMetadata[];
  /** Document data */
  documentData?: DocumentData[];
  /**
   * Document type
   * @example "Type for the document."
   */
  type?: string;
}

/** DocumentData model. */
export interface DocumentData {
  /**
   * ID of the document data.
   * @example "082ba08f-03c7-409f-b8a6-940a1397ba38"
   */
  id?: string;
  /**
   * File name.
   * @example "my-file.pdf"
   */
  fileName?: string;
  /**
   * The mime type of the file.
   * @example "application/pdf"
   */
  mimeType?: string;
  /**
   * File size in bytes
   * @format int64
   * @example 5068
   */
  fileSizeInBytes?: number;
}

/** Paged document response model */
export interface PagedDocumentResponse {
  documents?: Document[];
  /** PagingMetaData model */
  _meta?: PagingMetaData;
}

/** PagingMetaData model */
export interface PagingMetaData {
  /**
   * Current page
   * @format int32
   * @example 5
   */
  page?: number;
  /**
   * Displayed objects per page
   * @format int32
   * @example 20
   */
  limit?: number;
  /**
   * Displayed objects on current page
   * @format int32
   * @example 13
   */
  count?: number;
  /**
   * Total amount of hits based on provided search parameters
   * @format int64
   * @example 98
   */
  totalRecords?: number;
  /**
   * Total amount of pages based on provided search parameters
   * @format int32
   * @example 23
   */
  totalPages?: number;
}

export interface DocumentTypeCreateRequest {
  /**
   * Identifier for the document type
   * @example "EMPLOYMENT_CERTIFICATE"
   */
  type: string;
  /**
   * Display name for the document type
   * @example "Anställningsbevis"
   */
  displayName: string;
  /**
   * Identifier for performing person
   * @example "username123"
   */
  createdBy: string;
}

/** DocumentUpdateRequest model. */
export interface DocumentUpdateRequest {
  /**
   * Actor that created this revision (all modifications will create new revisions).
   * @example "username123"
   */
  createdBy: string;
  /**
   * Document description
   * @minLength 0
   * @maxLength 8192
   * @example "A brief description of this object. Maximum 8192 characters."
   */
  description?: string;
  /**
   * Tells if the document is eligible for archiving
   * @example false
   */
  archive?: boolean;
  /** List of DocumentMetadata objects. */
  metadataList?: DocumentMetadata[];
  /**
   * The type of document (validated against a defined list of document types).
   * @example "EMPLOYMENT_CERTIFICATE"
   */
  type?: string;
}

/** ConfidentialityUpdateRequest model. */
export interface ConfidentialityUpdateRequest {
  /**
   * A flag that can be set to alert administrative users handling the information that there are some special privacy policies to follow for the person in question.
   * If there are special privacy policies to follow for this record, this flag should be set to 'true', otherwise 'false'.
   * Please note: This will affect all revisions, not just the latest revision.
   * @example false
   */
  confidential: boolean;
  /**
   * Legal citation
   * @example "25 kap. 1 § OSL"
   */
  legalCitation?: string;
  /**
   * Actor that performed this change
   * @example "username123"
   */
  changedBy: string;
}

export interface DocumentTypeUpdateRequest {
  /**
   * Display name for the document type
   * @example "Anställningsbevis"
   */
  displayName?: string;
  /**
   * Identifier for the document type
   * @example "EMPLOYMENT_CERTIFICATE"
   */
  type?: string;
  /**
   * Identifier for performing person
   * @example "username123"
   */
  updatedBy: string;
}

/** DocumentType model. */
export interface DocumentType {
  /**
   * Identifier for the document type
   * @example "EMPLOYMENT_CERTIFICATE"
   */
  type: string;
  /**
   * Display name for the document type
   * @example "Anställningsbevis"
   */
  displayName: string;
}
