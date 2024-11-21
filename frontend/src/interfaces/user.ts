export interface User {
  name: string;
  username: string;
  givenName: string;
  surname: string;
  groups: string[];
  permissions: Permissions;
}

export interface Permissions {
  canReadPersonalfile: boolean;
  canUploadDocument: boolean;
  canDownloadDocument: boolean;
  canDeleteDocument: boolean;
}
