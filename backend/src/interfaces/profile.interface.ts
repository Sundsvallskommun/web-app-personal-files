import { Profile as SamlProfile } from 'passport-saml';
import { Permissions } from '@/interfaces/users.interface';

export interface Profile extends SamlProfile {
  citizenIdentifier: string;
  givenName: string;
  surname: string;
  username: string;
  attributes: { [key: string]: any };
  groups: string;
  permissions: Permissions;
}
