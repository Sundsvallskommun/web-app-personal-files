export type User = {
  personId: string;
  username: string;
  name: string;
  givenName: string;
  surname: string;
  groups: string;
  permissions: Permissions;
};

export type ClientUser = {
  name: string;
  username: string;
  givenName: string;
  surname: string;
  groups: string;
  permissions: Permissions;
};

export interface Permissions {
  canReadPersonalfile: boolean;
  canUploadDocument: boolean;
  canDownloadDocument: boolean;
  canDeleteDocument: boolean;
}

/** Internal roles */
export type InternalRole = 'personakter_superadmin' | 'personakter_admin';
export enum InternalRoleEnum {
  'personakter_superadmin',
  'personakter_admin',
}

export type InternalRoleMap = Map<InternalRole, Partial<Permissions>>;
