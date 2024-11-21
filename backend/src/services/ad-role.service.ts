import { InternalRole } from '@/interfaces/users.interface';

export type RoleADMapping = {
  [key: string]: InternalRole;
};

let mapping: RoleADMapping = {};

export const roleADMapping: RoleADMapping = mapping;
