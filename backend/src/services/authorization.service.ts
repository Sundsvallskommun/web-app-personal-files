import { AUTHORIZED_GROUPS } from '@config';
import { InternalRole, Permissions } from '@interfaces/users.interface';
import { logger } from '@/utils/logger';
import { roleADMapping } from './ad-role.service';

export function authorizeGroups(groups) {
  logger.info('authorizing groups', groups);
  logger.info('against', AUTHORIZED_GROUPS);
  const authorizedGroupsList = AUTHORIZED_GROUPS.split(',');
  const groupsList = groups.split(',').map((g: string) => g.toLowerCase());
  return authorizedGroupsList.some(authorizedGroup => groupsList.includes(authorizedGroup.toLowerCase()));
}

export const defaultPermissions: () => Permissions = () => ({
  canReadPersonalfile: false,
  canUploadDocument: false,
  canDownloadDocument: false,
  canDeleteDocument: false,
});

enum RoleOrderEnum {
  'personakter_superadmin',
  'personakter_admin',
}

const roles = new Map<InternalRole, Partial<Permissions>>([
  [
    'personakter_superadmin',
    {
      canReadPersonalfile: true,
      canUploadDocument: true,
      canDownloadDocument: true,
      canDeleteDocument: true,
    },
  ],
  [
    'personakter_admin',
    {
      canReadPersonalfile: true,
      canUploadDocument: true,
      canDownloadDocument: true,
    },
  ],
]);

/**
 *
 * @param groups Array of groups/roles
 * @param internalGroups Whether to use internal groups or external group-mappings
 * @returns collected permissions for all matching role groups
 */
export const getPermissions = (groups: InternalRole[] | string[], internalGroups = false): Permissions => {
  const permissions: Permissions = defaultPermissions();
  groups.forEach(group => {
    const groupLower = group.toLowerCase();
    const role = internalGroups ? (groupLower as InternalRole) : (roleADMapping[groupLower] as InternalRole);
    if (roles.has(role)) {
      const groupPermissions = roles.get(role);
      Object.keys(groupPermissions).forEach(permission => {
        if (groupPermissions[permission] === true) {
          permissions[permission] = true;
        }
      });
    }
  });
  return permissions;
};

/**
 * Ensures to return only the role with most permissions
 * @param groups List of AD roles
 * @returns role with most permissions
 */
export const getRole = (groups: string[]) => {
  if (groups.length == 1) return roleADMapping[groups[0]]; // meta_read

  const roles: InternalRole[] = [];
  groups.forEach(group => {
    const groupLower = group.toLowerCase();
    const role = roleADMapping[groupLower];
    if (role) {
      roles.push(role);
    }
  });

  return roles.sort((a, b) => RoleOrderEnum[a] - RoleOrderEnum[b])[0];
};
