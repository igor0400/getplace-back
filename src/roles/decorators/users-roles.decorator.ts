import { SetMetadata } from '@nestjs/common';

export const USERS_ROLES_KEY = 'roles';

export const UsersRoles = (...roles: string[]) =>
  SetMetadata(USERS_ROLES_KEY, roles);
