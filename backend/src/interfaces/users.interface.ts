export type User = {
  // id: number;
  personId: string;
  name: string;
  givenName: string;
  surname: string;
  email: string;
  username: string;
  // groups: string;
  // permissions: Permissions;
};

export type ClientUser = {
  name: string;
  username: string;
  givenName: string;
  surname: string;
};
